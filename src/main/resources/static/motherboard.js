window.addEventListener('load', refreshBrowser);

function refreshBrowser(){
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Motherboard")

    refreshForm();
    refreshTable();

    select_brand.addEventListener("change",event =>{

        seriessByBrand = httpGetRequest("motherboardsseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
        motherboard.mb_series_id = null
        select_series.style.borderBottom = "1px solid #fff"
    })
}

const refreshTable=() =>{
    motherboards = httpGetRequest("/motherboard/all")

    //create display property list
    let display_property_list =["code","name","mb_status_id.name","purchase_price","sale_price","warrenty"]

    //cretae display property type list
    let display_property_datatype =["text","text","object","decimal","decimal","text"]
    fillTable(tbl_mb,motherboards,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in motherboards){
        if (motherboards[index].mb_status_id.name == "Removed"){
            tbl_mb.children[1].children[index].children[7].children[2].disabled = true;
        }
    }

    $('#tbl_mb').dataTable();
}

const formReFill = (obj) =>{

    motherboard = httpGetRequest("/motherboard/getbyid?id="+obj.id)
    old_motherboard = httpGetRequest("/motherboard/getbyid?id="+obj.id)

    //set value in to select feild
    fillSelectField(select_brand,"",brands,"name",motherboard.item_brand_id.name);
    fillSelectField(select_ramtype,"",ramtypes,"name",motherboard.ram_type_id.name);
    fillSelectField(select_chipset,"",chipsets,"name",motherboard.mb_chipset_id.name);
    fillSelectField(select_formfactor,"",formfactors,"name",motherboard.mb_formfactor_id.name);
    fillSelectField(select_prosocket,"",prosockets,"name",motherboard.pro_socket_id.name);

    if(motherboard.mb_series_id != undefined){
        seriessByBrand = httpGetRequest("motherboardsseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name",motherboard.mb_series_id.name);
    }else{
        seriessByBrand = httpGetRequest("motherboardsseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
    }

    txt_modelname.value=motherboard.modelname;
    txt_name.value=motherboard.name;
    txt_mxmemory.value=motherboard.max_memory;
    txt_memoryslot.value=motherboard.memory_slots;




    txt_x16v4.value=motherboard.pciex16v4;
    txt_x16v5.value=motherboard.pciex16v5;
    txt_6gbs.value=motherboard.sata6gbs;
    txt_3gbs.value=motherboard.sata3gbs;
    txt_m2.value=motherboard.m2_port;
    txt_purchprice.value=motherboard.purchase_price;
    txt_profitrate.value=motherboard.profit_rate;
    txt_saleprice.value=motherboard.sale_price;
    txt_warrenty.value=motherboard.warrenty;

    disabledButton(false,true);
    setStyle("2px solid green")

    tabSwitch(mb_table,mb_form);
}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Motherboard...?',
        message: "Motherboard Code: " + obj.code + "<br>Motherboard Name: " + obj.name,
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

                $.ajax("/motherboard",{
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
    printMotherboard = httpGetRequest("/motherboard/getbyid?id="+obj.id)

    console.log(printMotherboard);

    td_code.innerHTML = printMotherboard.code;
    td_name.innerHTML = printMotherboard.name;
    td_formfacttor.innerHTML = printMotherboard.mb_formfactor_id.name;
    td_chipset.innerHTML = printMotherboard.mb_chipset_id.name;
    td_maxmem.innerHTML = printMotherboard.max_memory;
    td_memslot.innerHTML = printMotherboard.memory_slots;
    txt_x16v4.innerHTML = printMotherboard.pciex16v4;
    txt_x16v5.innerHTML = printMotherboard.pciex16v5;
    td_sata6gbs.innerHTML = printMotherboard.sata6gbs;
    td_sata3gbs.innerHTML = printMotherboard.sata3gbs;
    td_m2.innerHTML = printMotherboard.m2_port;
    td_ramtype.innerHTML = printMotherboard.ram_type_id.name;
    td_prosoc.innerHTML = printMotherboard.pro_socket_id.name;
    td_pprice.innerHTML = printMotherboard.purchase_price;
    td_pr.innerHTML = printMotherboard.profit_rate;
    td_sprice.innerHTML = printMotherboard.sale_price;
    td_adddate.innerHTML = printMotherboard.adddatetime;
    td_adduser.innerHTML = printMotherboard.adduser_id.user_name;
    td_warranty.innerHTML = printMotherboard.warrenty;
    td_status.innerHTML = printMotherboard.mb_status_id.name;

    $('#mbViewModel').modal('show')


}

const mbPrintModel = () =>{
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Motherboard Details</h2>"
        + mbPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const refreshForm = () =>{
    motherboard = new Object();
    old_motherboard = null;

    brands = httpGetRequest("itembrand/bycategorymb")
    fillSelectField(select_brand,"",brands,"name","");
/*
    seriess = httpGetRequest("/motherboardsseriess/all")
    fillSelectField(select_series,"",seriess,"name","");*/

    chipsets = httpGetRequest("/motherboardchipset/all")
    fillSelectField(select_chipset,"",chipsets,"name","");

    ramtypes = httpGetRequest("/ramtype/all")
    fillSelectField(select_ramtype,"",ramtypes,"name","");

    formfactors = httpGetRequest("/motherboardformfactor/all")
    fillSelectField(select_formfactor,"",formfactors,"name","");

    prosockets = httpGetRequest("/processorsocket/all")
    fillSelectField(select_prosocket,"",prosockets,"name","")

    statuss = httpGetRequest("/motherboardstatus/all")
    fillSelectField(select_status,"",statuss,"name","Used");
    motherboard.mb_status_id = JSON.parse(select_status.value);//Auto select value set

    //empty all text field after refresh
    txt_modelname.value="";
    txt_name.value="";
    txt_mxmemory.value="";
    txt_memoryslot.value="";
    txt_x16v4.value="";
    txt_x16v5.value="";
    txt_6gbs.value="";
    txt_3gbs.value="";
    txt_m2.value="";
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

    $('#txt_name').css({
        'pointer-events': 'none',
        //'cursor': 'not-allowed'
    });

    $('#txt_saleprice').css({
        'pointer-events': 'none',
        //'cursor': 'not-allowed'
    });



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
            motherboard.sale_price = txt_saleprice.value;

            if (old_motherboard != null && motherboard.sale_price != old_motherboard.sale_price) {
                txt_saleprice.style.borderBottom = "2px solid orange"
            } else {
                txt_saleprice.style.borderBottom = "2px solid green"
            }
        } else {
            txt_saleprice.value = "";
            motherboard.sale_price = null;
            txt_saleprice.style.borderBottom = "1px solid #fff"
        }
    }else {
        txt_saleprice.value = "";
        motherboard.sale_price = null;
        txt_saleprice.style.borderBottom = "1px solid #fff"
    }

}

const genarateName = () =>{
    if(select_brand.value != ""  && txt_modelname.value!= "" ){

        if (select_series.value == ""){
            select_series.value = ""
            txt_name.value=JSON.parse(select_brand.value).name + " " + txt_modelname.value;
            motherboard.name = txt_name.value;

        }else{
            txt_name.value=JSON.parse(select_brand.value).name + " "+JSON.parse(select_series.value).name + " " + txt_modelname.value;
            motherboard.name = txt_name.value;

        }


        if(old_motherboard != null && motherboard.name != old_motherboard.name){
            txt_name.style.borderBottom = "1px solid orange"
        }else{
            txt_name.style.borderBottom = "1px solid green"
        }

    }else {
        txt_name.value="";
        motherboard.name = null;
        txt_name.style.borderBottom = "1px solid red"
    }
}

const setStyle = (style) =>{
    select_brand.style.borderBottom = style;
    if(motherboard.mb_series_id != undefined){
        select_series.style.borderBottom=style;
    }else{
        select_series.style.borderBottom="1px solid #fff";
    }

    select_chipset.style.borderBottom = style;
    select_ramtype.style.borderBottom = style;
    select_formfactor.style.borderBottom = style;
    select_prosocket.style.borderBottom = style;

    txt_modelname.style.borderBottom = style
    txt_name.style.borderBottom = style
    txt_mxmemory.style.borderBottom = style
    txt_memoryslot.style.borderBottom = style
    txt_x16v4.style.borderBottom = style
    txt_x16v5.style.borderBottom = style
    txt_6gbs.style.borderBottom = style
    txt_3gbs.style.borderBottom = style
    txt_m2.style.borderBottom = style
    txt_purchprice.style.borderBottom = style
    txt_profitrate.style.borderBottom = style
    txt_saleprice.style.borderBottom = style
    txt_warrenty.style.borderBottom = style
}

const checkErrors = () =>{
    let errors = "";

    if(motherboard.item_brand_id == null){
        errors = errors+"Motherboard Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }

    if(motherboard.modelname == null){
        errors = errors+"Valid Motherboard Model Name Not Enter..<br>";
        txt_modelname.style.borderBottom="1px solid red";
    }

    if(motherboard.name == null){
        errors = errors+"Valid Motherboard Name Not Enter..<br>";
        txt_name.style.borderBottom="1px solid red";
    }

    if(motherboard.mb_chipset_id == null){
        errors = errors+"Motherboard Chipset Not Selected..<br>";
        select_chipset.style.borderBottom="1px solid red";
    }

    if(motherboard.ram_type_id == null){
        errors = errors+"Support Ram Type Not Selected..<br>";
        select_ramtype.style.borderBottom="1px solid red";
    }

    if(motherboard.pro_socket_id == null){
        errors = errors+"Support Processor Socket Not Selected..<br>";
        select_prosocket.style.borderBottom="1px solid red";
    }


    if(motherboard.mb_formfactor_id == null){
        errors = errors+"Support Ram Type Not Selected..<br>";
        select_formfactor.style.borderBottom="1px solid red";
    }

    if(motherboard.max_memory == null){
        errors = errors+"Valid Motherboard Max Memory Not Enter..<br>";
        txt_mxmemory.style.borderBottom="1px solid red";
    }

    if(motherboard.memory_slots == null){
        errors = errors+"Valid Motherboard Memory Slots Not Enter..<br>";
        txt_memoryslot.style.borderBottom="1px solid red";
    }
    if(motherboard.pciex16v4 == null){
        errors = errors+"Valid Motherboard PCIEx16 V4 Slots Not Enter..<br>";
        txt_x16v4.style.borderBottom="1px solid red";
    }
    if(motherboard.pciex16v5 == null){
        errors = errors+"Valid Motherboard PCIEx 16 V5 Slots Not Enter..<br>";
        txt_x16v5.style.borderBottom="1px solid red";
    }


    if(motherboard.sata6gbs == null){
        errors = errors+"Valid Motherboard SATA-6GBS Slots Not Enter..<br>";
        txt_6gbs.style.borderBottom="1px solid red";
    }

    if(motherboard.sata3gbs == null){
        errors = errors+"Valid Motherboard SATA-3GBS Slots Not Enter..<br>";
        txt_3gbs.style.borderBottom="1px solid red";
    }

    if(motherboard.m2_port == null){
        errors = errors+"Valid Motherboard M.2 Slots Not Enter..<br>";
        txt_m2.style.borderBottom="1px solid red";
    }

    if(motherboard.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors = errors + "Valide purchase price not Entered...<br>";
    }

    if(motherboard.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors = errors + "Valide profit rate not Entered...<br>";
    }
    if(motherboard.sale_price == null){
        txt_saleprice.style.borderBottom = '1px solid red';
        errors = errors + "Valide Sale price not Entered...<br>";
    }

    if(motherboard.warrenty == null){
        txt_warrenty.style.borderBottom = '1px solid red';
        errors = errors + "Warranty not Entered...<br>";
    }
    return errors;
}

const buttonAddMc = () =>{
    console.log(motherboard)
    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Motherboard..?",
            message: "Motherboard Name ="+motherboard.name,
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

                    $.ajax("/motherboard",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(motherboard),//data that pass to backend
                        contentType:"application/json",
                        success:function(succsessResData,successStatus,resObj){
                            post_server_responce = succsessResData;
                        },error:function (errorResOb,errorStatus,errorMsg){
                            post_server_responce = errorMsg;
                        }
                    })
                    if(post_server_responce == "0"){

                        iziToast.success({
                            theme: 'dark',
                            title: 'Motherboard Add Successfully',
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
                    }else{
                        iziToast.error({

                            title: 'An error occurred',
                            message: post_server_responce,
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
    if (motherboard != null && old_motherboard != null) {

        if(motherboard.item_brand_id.name != old_motherboard.item_brand_id.name) {
            updates = updates + "Motherboard Brands Has Changed..<br>"
        }

       /* if (motherboard != null && old_motherboard != null) {
            if (old_motherboard.mb_series_id != null && motherboard.mb_series_id != null && motherboard.mb_series_id.name != old_motherboard.mb_series_id.name) {
                updates = updates + "Motherboard Series Has Changed..<br>";
            } else if (old_motherboard.mb_series_id == null && motherboard.mb_series_id != null) {
                updates = updates + "Motherboard Series Has Been Added..<br>";
            } else if (old_motherboard.mb_series_id != null && motherboard.mb_series_id == null) {
                updates = updates + "Motherboard Series Has Been Removed..<br>";
            }
        } else if (motherboard != null && old_motherboard == null && motherboard.mb_series_id != null) {
            updates = updates + "Motherboard Series Has Been Added..<br>";
        }*/

        if(motherboard.modelname != old_motherboard.modelname) {
            updates = updates + "Motherboard Model Name Has Changed..<br>"
        }

        if(motherboard.name != old_motherboard.name) {
            updates = updates + "Motherboard Name Has Changed..<br>"
        }

        if(motherboard.mb_chipset_id.name != old_motherboard.mb_chipset_id.name) {
            updates = updates + "Motherboard Chipset Has Changed..<br>"
        }

        if(motherboard.ram_type_id.name != old_motherboard.ram_type_id.name) {
            updates = updates + "Motherboard Support RAM Type Has Changed..<br>"
        }

        if(motherboard.max_memory != old_motherboard.max_memory) {
            updates = updates + "Motherboard Support Max Memory Has Changed..<br>"
        }

        if(motherboard.memory_slots != old_motherboard.memory_slots) {
            updates = updates + "Motherboard Memory Slots Has Changed..<br>"
        }

        if(motherboard.pciex16v4 != old_motherboard.pciex16v4) {
            updates = updates + "Motherboard PCIEx 16 V4.0 Slots Has Changed..<br>"
        }

        if(motherboard.pciex16v5 != old_motherboard.pciex16v5) {
            updates = updates + "Motherboard PCIEx 16 V5.0 Slots Has Changed..<br>"
        }


        if(motherboard.sata6gbs != old_motherboard.sata6gbs) {
            updates = updates + "Motherboard SATA 6GBPS Slots Has Changed..<br>"
        }

        if(motherboard.sata3gbs != old_motherboard.sata3gbs) {
            updates = updates + "Motherboard SATA 3GBPS Slots Has Changed..<br>"
        }

        if(motherboard.m2_port != old_motherboard.m2_port) {
            updates = updates + "Motherboard M.2 Port Slots Has Changed..<br>"
        }

        if(motherboard.mb_formfactor_id.name != old_motherboard.mb_formfactor_id.name) {
            updates = updates + "Motherboard Form Factor Has Changed..<br>"
        }

        if(motherboard.pro_socket_id.name != old_motherboard.pro_socket_id.name) {
            updates = updates + "Motherboard Support Processor Socket Has Changed..<br>"
        }

        if(motherboard.purchase_price != old_motherboard.purchase_price){
            updates=updates+"Motherboard Purchase Price Has Changed..<br>"
        }
        if(motherboard.profit_rate != old_motherboard.profit_rate){
            updates=updates+"Motherboard Profit Rate Has Changed..<br>"
        }
        if(motherboard.sale_price != old_motherboard.sale_price){
            updates=updates+"Motherboard Sale price Has Changed..<br>"
        }
        if(motherboard.warrenty != old_motherboard.warrenty){
            updates=updates+"Motherboard Sale price Has Changed..<br>"
        }

    }
    return updates;


}

const buttonUpdateMC = () =>{
    console.log(motherboard);
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

                        $.ajax("/motherboard",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(motherboard),//data that pass to backend
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
                                title: 'Motherboard Update Successfully',
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
