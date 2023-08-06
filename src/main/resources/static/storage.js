//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Storage")

    //Calling function refresh Cooler Table and form
    refreshTable();
    refreshForm();

    select_type.addEventListener("change",event =>{

        formfactorByType = httpGetRequest("storageformfactor/allbytype?tid="+ JSON.parse(select_type.value).id);
        fillSelectField(select_formfactor,"",formfactorByType,"name","");
        storage.st_formfactor_id = null
        select_formfactor.style.borderBottom = "1px solid #fff"
    })


}

//define refreshTable function
const refreshTable = () =>{
    storages = httpGetRequest("/storage/all")

    //create display property list
    let display_property_list =["code","name","st_status_id.name","purchase_price","sale_price","warrenty"]

    //cretae display property type list
    let display_property_datatype =["text","text","object","decimal","decimal","text"]

    fillTable(tbl_storage,storages,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in storages){
        if (storages[index].st_status_id.name == "Removed"){
            tbl_storage.children[1].children[index].children[7].children[2].disabled = true;
        }
    }

    $('#tbl_storage').dataTable();


}

const formReFill = (obj) =>{
    storage = httpGetRequest("/storage/getbyid?id="+obj.id)
    old_storage = httpGetRequest("/storage/getbyid?id="+obj.id)


    //set value in to text feild
    txt_model.value=storage.modelname;
    txt_storagename.value=storage.name;
    txt_warrenty.value=storage.warrenty;
    txt_purchprice.value=parseFloat(storage.purchase_price).toFixed(2);
    txt_profitrate.value=parseFloat(storage.profit_rate).toFixed(2);
    txt_saleprice.value=parseFloat(storage.sale_price).toFixed(2);

    if (storage.photopath != null){
        stPhoto.src = storage.photopath;

        let imagePathArray = storage.photopath.split("/")
        console.log(imagePathArray);
        textSTPhotoName.innerText = imagePathArray[imagePathArray.length-1];
    }



    //set value in to select feild
    fillSelectField(select_brand,"",brands,"name",storage.item_brand_id.name);
    fillSelectField(select_capacity,"",capasities,"name",storage.st_capasity_id.name);
    fillSelectField(select_type,"",types,"name",storage.st_type_id.name);

    fillSelectField(select_interface,"",interfaces,"name",storage.st_interface_id.name);
    formfactorByType = httpGetRequest("storageformfactor/allbytype?tid="+ JSON.parse(select_type.value).id);

    fillSelectField(select_formfactor,"",formfactorByType,"name",storage.st_formfactor_id.name);
    fillSelectField(select_status,"",statuss,"name",storage.st_status_id.name);

    $('#select_status').css('pointer-events', 'auto');

    disabledButton(false,true);
    setStyle("1px solid green")


    toolTip();

}

const updatePhoto = () =>{
    txt_photocode.value = storage.code;
    $('#storagePhotoModel').modal('show')
}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Storage Device...?',
        message: "Storage Code: " + obj.code + "<br>Storaage Name: " + obj.name,
        layout: 2,
        position: 'topCenter',
        overlay: true,
        timeout: false,
        close:false,
        closeOnEscape: false,
        progressBar: false,
        buttons: [
            ['<button><b>Yes</b></button>', function (instance, toast) {
                // Do something when the "Yes" button is clicked

                let delete_server_responce;

                $.ajax("/storage",{
                    async : false,
                    type:"DELETE",//Method
                    data:JSON.stringify(obj),//data that pass to backend
                    contentType:"application/json",
                    success:function(succsessResData,successStatus,resObj){
                        delete_server_responce = succsessResData;
                    },error:function (errorResOb,errorStatus,errorMsg){
                        delete_server_responce = errorMsg;
                    }
                })
                if(delete_server_responce == "0"){
                    iziToast.success({
                        theme: 'dark',
                        title: 'Item Deleted',
                        position: 'topRight',
                        overlay: true,
                        displayMode: 'once',
                        zindex: 999,
                        animateInside: true,
                        closeOnEscape:true,
                        timeout: 2000,
                        closeOnClick: true,

                    });
                    refreshTable();
                }else{
                    iziToast.error({
                        title: 'An error occurred',
                        message: delete_server_responce,
                        position: 'topRight',
                        overlay: true,
                        closeOnEscape: false,
                        close: true,
                        layout: 2,
                        displayMode: 'once',
                        zindex: 999,
                        animateInside: true,
                        buttons: [
                            ['<button><b>OK</b></button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }, true]
                        ]
                    });
                }
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

            }, true],
            ['<button>No</button>', function (instance, toast) {
                // Do something when the "No" button is clicked
                iziToast.warning({
                    title: 'Cancel',
                })
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }]
        ]
    });

}

const rowView = (obj) =>{

    printStorage = new Object();
    printStorage = httpGetRequest("/storage/getbyid?id="+obj.id);

    td_code.innerHTML = printStorage.code;
    td_name.innerHTML = printStorage.name;
    td_ff.innerHTML = printStorage.st_formfactor_id.name;
    td_interface.innerHTML = printStorage.st_interface_id.name;
    td_status.innerHTML = printStorage.st_status_id.name
    td_pprice.innerHTML = parseFloat(printStorage.purchase_price).toFixed(2);
    td_pr.innerHTML = parseFloat(printStorage.profit_rate).toFixed(2);
    td_sprice.innerHTML = parseFloat(printStorage.sale_price).toFixed(2);
    $('#storageViewModel').modal('show')
}

const storagePrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Storage Details</h2>"
        + storagePrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const refreshForm = () =>{
    storage = new Object();
    old_storage = null;


    //create array for fill  select element
    brands = httpGetRequest("itembrand/bycategorystorage")
    capasities = httpGetRequest("storagecapasity/all")
    types = httpGetRequest("storagetype/all")
    formfactors = httpGetRequest("storageformfactor/all")
    interfaces = httpGetRequest("storageinterface/all")
    statuss = httpGetRequest("storagestatus/all")

    fillSelectField(select_brand,"",brands,"name","");
    fillSelectField(select_capacity,"",capasities,"name","");
    fillSelectField(select_type,"",types,"name","");
    fillSelectField(select_interface,"",interfaces,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    storage.st_status_id=JSON.parse(select_status.value);//Auto select value set


    //empty all text field after add
    txt_model.value="";
    txt_storagename.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";
    txt_warrenty.value="";


    //set default style
    setStyle("1px solid #fff");

    disabledButton(true,false);

    //disable field when refresh
    $('#select_status').css({
        'pointer-events': 'none',
        //'cursor': 'not-allowed'
    });

    $('#txt_saleprice').css({
        'pointer-events': 'none',
        //'cursor': 'not-allowed'
    });

    $('#select_formfactor').css('pointer-events', 'none');
    $('#txt_saleprice').css('pointer-events', 'none');
};

const toolTip = () =>{
    if(storage.st_type_id != null){
        $(".floating-label-content").tooltip('disable');
        $('#select_formfactor').css('pointer-events', 'auto');
    }
}

const genarateName = () =>{
    if(select_brand.value != "" && txt_model.value!= "" && select_capacity.value != "" && select_type.value !=""){
        txt_storagename.value=JSON.parse(select_brand.value).name + " "+txt_model.value+" "+JSON.parse(select_capacity.value).name + " " + JSON.parse(select_type.value).name;
        storage.name = txt_storagename.value;

        if(old_storage != null && storage.name != old_storage.name){
            txt_storagename.style.borderBottom = "1px solid orange"
        }else{
            txt_storagename.style.borderBottom = "1px solid green"
        }

    }else {
        txt_storagename.value="";
        storage.name = null;
        txt_storagename.style.borderBottom = "1px solid red"
    }
}

const genarateSellPrice = () =>{
    let pattern1 = new RegExp("^(?!0*(?:\\.00?$))([1-9]\\d{0,2}(?:\\.\\d{2})?|0?\\.\\d{2})$");
    let pattern2 = new RegExp("^(?!0\\d)(?!-)(?=\\d{4,})(?:\\d+|\\d{1,3}(?:,\\d{3})*)(?:\\.\\d{2})?$")
    if (pattern1.test(txt_profitrate.value) && pattern2.test(txt_purchprice.value)) {
        if (txt_purchprice.value != "" && txt_profitrate.value != "") {

            let profitAmount = parseFloat((txt_purchprice.value * txt_profitrate.value) / 100).toFixed(2);
            console.log(profitAmount);

            let purchasePrice = parseFloat(txt_purchprice.value);
            let sellPrice = purchasePrice + parseFloat(profitAmount);
            txt_saleprice.value = sellPrice.toFixed(2);
            storage.sale_price = txt_saleprice.value;

            if (old_storage != null && storage.sale_price != old_storage.sale_price) {
                txt_saleprice.style.borderBottom = "2px solid orange"
            } else {
                txt_saleprice.style.borderBottom = "2px solid green"
            }
        } else {
            txt_saleprice.value = "";
            storage.sale_price = null;
            txt_saleprice.style.borderBottom = "1px solid #fff"
        }
    }else {
        txt_saleprice.value = "";
        storage.sale_price = null;
        txt_saleprice.style.borderBottom = "1px solid #fff"
    }

}

const setStyle = (style) =>{
    select_brand.style.borderBottom = style;
    select_capacity.style.borderBottom = style;
    select_type.style.borderBottom = style;
    select_interface.style.borderBottom = style;
    select_formfactor.style.borderBottom = style;
    txt_model.style.borderBottom = style;
    txt_storagename.style.borderBottom = style;
    txt_purchprice.style.borderBottom = style;
    txt_profitrate.style.borderBottom = style;
    txt_saleprice.style.borderBottom = style;
    txt_warrenty.style.borderBottom = style;
}

const checkErrors = () => {
    let errors = "";


    if(storage.item_brand_id == null){
        errors = errors+"Storage Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }

    if(storage.modelname == null){
        errors = errors+"Valid Storage Model Name Not Enter..<br>";
        txt_model.style.borderBottom="1px solid red";
    }

    if(storage.st_capasity_id == null){
        errors = errors+"Storage Capacity Not Selected..<br>";
        select_capacity.style.borderBottom="1px solid red";
    }

    if(storage.st_type_id == null){
        errors = errors+"Storage Type Not Selected..<br>";
        select_type.style.borderBottom="1px solid red";
    }

    if(storage.name == null){
        errors = errors+"Valid Storage Name Not Enter..<br>";
        txt_storagename.style.borderBottom="1px solid red";
    }

    if(storage.st_formfactor_id == null){
        errors = errors+"Storage Form Factor Not Selected..<br>";
        select_formfactor.style.borderBottom="1px solid red";
    }

    if(storage.st_interface_id == null){
        errors = errors+"Storage Interface Not Selected..<br>";
       select_interface.style.borderBottom="1px solid red";
    }

    if(storage.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors = errors + "purchase price not Entered...<br>";
    }

    if(storage.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors = errors + "profit rate not Entered...<br>";
    }
    if(storage.sale_price == null){
        txt_saleprice.style.borderBottom = '1px solid red';
        errors = errors + "Sale price not Entered...<br>";
    }

    if(storage.warrenty == null){
        txt_warrenty.style.borderBottom = '1px solid red';
        errors = errors + "Warranty not Entered...<br>";
    }

    if(storage.st_status_id == null){
        errors = errors+"Storage Status Not Selected..<br>";
        select_status.style.borderBottom="1px solid red";
    }

    return errors;
}

const buttonAddMc = () =>{
    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Storage..?",
            message: "Storage Name ="+storage.name,
            layout: 2,
            position: 'topCenter',
            overlay: true,
            timeout: false,
            close:false,
            closeOnEscape: false,
            progressBar: false,
            buttons: [
                ['<button><b>Yes</b></button>', function (instance, toast) {
                    // Do something when the "Yes" button is clicked

                    let post_server_responce;

                   $.ajax("/storage",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(storage),//data that pass to backend
                        contentType:"application/json",
                        success:function(succsessResData,successStatus,resObj){
                            post_server_responce = succsessResData;
                        },error:function (errorResOb,errorStatus,errorMsg){
                            post_server_responce = errorMsg;
                        }
                    })
                    console.log(post_server_responce);
                    let regExp = new RegExp("^[S][T][0-9]{5}$")
                    if(regExp.test(post_server_responce)){

                        iziToast.success({
                            theme: 'dark',
                            title: 'Storage Add Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 1000,
                            closeOnClick: true,

                        });
                        refreshTable();
                        refreshForm();
                        txt_photocode.value = post_server_responce;
                        //$('#storagePhotoModel').modal('show')
                    }else{
                        iziToast.error({

                            title: 'An error occurred',
                            position: 'topRight',
                            overlay: true,
                            closeOnEscape: false,
                            close: true,
                            layout: 2,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            buttons: [
                                ['<button><b>OK</b></button>', function (instance, toast) {
                                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                                }, true]
                            ]
                        });


                    }
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }, true],
                ['<button>No</button>', function (instance, toast) {
                    // Do something when the "No" button is clicked
                    iziToast.warning({
                        title: 'Cancel',
                    })
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
        });

    }else{
        iziToast.error({
            title: 'You Have Following Error',
            message: errors,
            position: 'topCenter',
            overlay: true,
            closeOnEscape: false,
            close: true,
            layout: 2,
            displayMode: 'once',
            zindex: 999,
            animateInside: true,
            buttons: [
                ['<button><b>OK</b></button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true]
            ]
        });
    }
}

const checkUpdates = () => {
    let updates = "";
    if (storage != null && old_storage != null) {

        if(storage.item_brand_id.name != old_storage.item_brand_id.name) {
            updates = updates + "Storage Brand Has Changed..<br>"
        }

        if (storage.modelname != old_storage.modelname) {
            updates = updates + "Storage Model Has Changed..<br>"
        }

        if (storage.st_capasity_id.name != old_storage.st_capasity_id.name) {
            updates = updates + "Storage Capacity Has Changed..<br>"
        }

        if (storage.st_type_id.name != old_storage.st_type_id.name) {
            updates = updates + "Storage Brand Has Changed..<br>"
        }

        if (storage.name != old_storage.name) {
            updates = updates + "Storage Name Has Changed..<br>"
        }

        if (storage.st_formfactor_id.name != old_storage.st_formfactor_id.name) {
            updates = updates + "Storage Formfactor Has Changed..<br>"
        }

        if (storage.st_interface_id.name != old_storage.st_interface_id.name) {
            updates = updates + "Storage Interface Has Changed..<br>"
        }

        if(storage.purchase_price != old_storage.purchase_price){
            updates=updates+"Storage Purchase Price Has Changed..<br>"
        }
        if(storage.profit_rate != old_storage.profit_rate){
            updates=updates+"Storage Profit Rate Has Changed..<br>"
        }
        if(storage.sale_price != old_storage.sale_price){
            updates=updates+"Storage Sale price Has Changed..<br>"
        }
        if(storage.warrenty != old_storage.warrenty){
            updates=updates+"Storage Sale price Has Changed..<br>"
        }
        if (storage.st_status_id.name != old_storage.st_status_id.name) {
            updates = updates + "Storage Status Has Changed..<br>"
        }
    }

    return updates;
}

const buttonUpdateMC = () =>{
    let errors = checkErrors();
    if (errors == ""){
        let updates = checkUpdates();
        if(updates != ""){
            //Show the confirmation box when the Add button is clicked
            iziToast.show({
                theme: 'dark',
                title: "Are You Suer Update Following Updates?",
                message: updates,
                layout: 2,
                position: 'topCenter',
                overlay: true,
                timeout: false,
                close:false,
                closeOnEscape: false,
                progressBar: false,
                buttons: [
                    ['<button><b>Yes</b></button>', function (instance, toast) {
                        // Do something when the "Yes" button is clicked

                        let update_server_responce;

                        $.ajax("/storage",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(storage),//data that pass to backend
                            contentType:"application/json",
                            success:function(succsessResData,successStatus,resObj){
                                update_server_responce = succsessResData;
                            },error:function (errorResOb,errorStatus,errorMsg){
                                update_server_responce = errorMsg;
                            }
                        })
                        if(update_server_responce == "0"){

                            iziToast.success({
                                theme: 'dark',
                                title: 'Storage Update Successfully',
                                position: 'topRight',
                                overlay: true,
                                displayMode: 'once',
                                zindex: 999,
                                animateInside: true,
                                closeOnEscape:true,
                                timeout: 2000,
                                closeOnClick: true,

                            });
                            refreshTable();
                            refreshForm();
                        }else{
                            iziToast.error({

                                title: 'An error occurred',
                                message: update_server_responce,
                                position: 'topRight',
                                overlay: true,
                                closeOnEscape: false,
                                close: true,
                                layout: 2,
                                displayMode: 'once',
                                zindex: 999,
                                animateInside: true,
                                buttons: [
                                    ['<button><b>OK</b></button>', function (instance, toast) {
                                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                                    }, true]
                                ]
                            });


                        }
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                    }, true],
                    ['<button>No</button>', function (instance, toast) {
                        // Do something when the "No" button is clicked
                        iziToast.warning({
                            title: 'Cancel',
                        })
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    }]
                ]
            });
        }else {
            iziToast.warning({
                title: 'Nothing To Update',
            })
        }
    }else{
        iziToast.error({
            title: 'You Have Following Error',
            message: errors,
            position: 'topCenter',
            overlay: true,
            closeOnEscape: false,
            close: true,
            layout: 2,
            displayMode: 'once',
            zindex: 999,
            animateInside: true,
            buttons: [
                ['<button><b>OK</b></button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true]
            ]
        });
    }
}