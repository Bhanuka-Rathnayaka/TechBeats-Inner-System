//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Cooler")

    //Calling function refresh Cooler Table and form
    refreshTable();
    refreshForm();

    select_brand.addEventListener("change",event =>{

        seriessByBrand = httpGetRequest("coolerseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
        cooler.cooler_series_id = null
        select_series.style.borderBottom = "1px solid #fff"
    })


}

//define refreshTable function
const refreshTable = () =>{

    coolers = httpGetRequest("cooler/all")

    //create display property list
    let display_property_list =["cooler_code","name","cooler_status_id.name","purchase_price","sale_price"];

    //cretae display property type list
    let display_property_datatype =["text","text","object",getDecimal,"text"]

    //calling fillTable function
    fillTable(tbl_cooler,coolers,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    for (let index in coolers){
        if (coolers[index].cooler_status_id.name == "Removed"){
            tbl_cooler.children[1].children[index].children[6].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_cooler').dataTable();
}

const getDecimal = (obj) =>{
    return parseFloat(obj.purchase_price).toFixed(2);
}

const formReFill = (obj) =>{
    cooler = httpGetRequest("/cooler/getbyid?id="+obj.id)
    old_cooler = httpGetRequest("/cooler/getbyid?id="+obj.id)


    //set value in to text feild
    txt_model.value=cooler.modelname;
    txt_coolername.value=cooler.name;
    txt_purchprice.value=cooler.purchase_price;
    txt_profitrate.value=cooler.profit_rate;
    txt_saleprice.value=cooler.sale_price;

    /*if(cooler.radiator == undefined){
        txt_radiator.value="";
    }else{
        txt_radiator.value=cooler.radiator;
    }

    if(cooler.height == undefined){
        txt_height.value="";
    }else{
        txt_height.value=cooler.height;
    }*/


    //set value in to select feild
    fillSelectField(select_brand,"",brands,"name",cooler.item_brand_id.name);
    fillSelectField(select_type,"",types,"name",cooler.cooler_type_id.name);
    fillSelectField(select_status,"",statuss,"name",cooler.cooler_status_id.name);
    $('#select_status').css('pointer-events', 'auto');

    if(cooler.cooler_series_id != undefined){
        seriessByBrand = httpGetRequest("coolerseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name",cooler.cooler_series_id.name);
    }else{
        seriessByBrand = httpGetRequest("coolerseriess/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
    }


    // disable and enable fields based on the cooler type
    if (cooler.cooler_type_id.name === 'Liquid Cooler') {
        $('#txt_height').prop('disabled', true);
        $('#txt_radiator').prop('disabled', false);
        //txt_radiator.value=cooler.radiator;
        //txt_height.value="";
        if(cooler.radiator == undefined){
            txt_radiator.value="";
        }else{
            txt_radiator.value=cooler.radiator;
        }

    } else {
        $('#txt_radiator').prop('disabled', true);
        $('#txt_height').prop('disabled', false);
        //txt_height.value=cooler.height;
        //txt_radiator.value=""
        if(cooler.height == undefined){
            txt_height.value="";
        }else{
            txt_height.value=cooler.height;
        }

    }


    //set value to switch
    if (cooler.rgbsupport){
        checkrgb.checked=true;
        txtrgb.innerText="RGB : Support"
    }else{
        checkrgb.checked=false;
        txtrgb.innerText="RGB : Not-Support";
    }

    disabledButton(false,true);
    setStyle("1px solid green")



}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Cooler...?',
        message: "Cooler Code: " + obj.cooler_code + "<br>Cooler Name: " + obj.name,
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

                $.ajax("/cooler",{
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

const rowView = () =>{

}

const refreshForm = () =>{
    cooler = new Object();
    old_cooler = null;


    //create array for fill  select element
    brands = httpGetRequest("itembrand/bycategorycooler")

    /*seriess = httpGetRequest("coolerseriess/all")*/

    types = httpGetRequest("coolertype/all")


    statuss = httpGetRequest("coolerstatus/all")

    fillSelectField(select_brand,"",brands,"name","");
    /*fillSelectField(select_series,"",seriess,"name","");*/
    fillSelectField(select_type,"",types,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    cooler.cooler_status_id=JSON.parse(select_status.value);//Auto select value set
    $('#select_status').css('pointer-events', 'none');
    $('#txt_saleprice').css('pointer-events', 'none');


    //empty all text field after add
    txt_model.value="";
    txt_coolername.value="";
    txt_radiator.value="";
    txt_height.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";

    //
    checkrgb.checked=true;
    cooler.rgbsupport=true;
    txtrgb.innerText="RGB : Support"
    checkrgb.style.borderBottom="1px solid green"


    //set default style
    setStyle("1px solid #fff");

    disabledButton(true,false);

    $('#txt_height').prop('disabled', true);
    $('#txt_radiator').prop('disabled', true);
    // listen for change event on the customer type field
    $('#select_type').change(function() {
        if(this.value && JSON.parse(this.value).name === 'Liquid Cooler') {
            // disable the cooler height fields
            console.log(this.value)
            $('#txt_height').prop('disabled', true);
            $('#txt_radiator').prop('disabled', false);
            txt_height.value="";
            cooler.height = "";
            txt_height.style.borderBottom="1px solid #fff";
        } else {
            // disable the radiator fields
            console.log(this.value)
            $('#txt_radiator').prop('disabled', true);
            $('#txt_height').prop('disabled', false);
            txt_radiator.value="";
            cooler.radiator = "";
            txt_radiator.style.borderBottom="1px solid #fff";

        }
    });
};

const genarateName = () =>{

    if(select_brand.value != "" && txt_model.value!= ""){

        if (select_series.value == ""){
            txt_coolername.value=JSON.parse(select_brand.value).name + " " + txt_model.value;
            cooler.name = txt_coolername.value;

        }else{
            txt_coolername.value=JSON.parse(select_brand.value).name + " "+JSON.parse(select_series.value).name + " " + txt_model.value;
            cooler.name = txt_coolername.value;

        }

        if(old_cooler != null && cooler.name != old_cooler.name){
            txt_coolername.style.borderBottom = "1px solid orange"
        }else{
            txt_coolername.style.borderBottom = "1px solid green"
        }
    }else{
        txt_coolername.value="";
        cooler.name = null;
        txt_coolername.style.borderBottom = "1px solid red"

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
            cooler.sale_price = txt_saleprice.value;

            if (old_cooler != null && cooler.sale_price != old_cooler.sale_price) {
                txt_saleprice.style.borderBottom = "2px solid orange"
            } else {
                txt_saleprice.style.borderBottom = "2px solid green"
            }
        } else {
            txt_saleprice.value = "";
            cooler.sale_price = null;
            txt_saleprice.style.borderBottom = "1px solid #fff"
        }
    }else {
        txt_saleprice.value = "";
        cooler.sale_price = null;
        txt_saleprice.style.borderBottom = "1px solid #fff"
    }

}

const setStyle = (style) =>{
    select_brand.style.borderBottom=style;

    if(cooler.cooler_series_id != undefined){
        select_series.style.borderBottom=style;
    }else{
        select_series.style.borderBottom="1px solid #fff";
    }

    select_type.style.borderBottom=style;
    txt_model.style.borderBottom=style;
    txt_coolername.style.borderBottom=style;

    if(cooler.radiator != undefined){
        txt_radiator.style.borderBottom=style;
    }else{
        txt_radiator.style.borderBottom="1px solid #fff";
    }

    if(cooler.height != undefined){
        txt_height.style.borderBottom=style;
    }else{
        txt_height.style.borderBottom="1px solid #fff";
    }

    txt_purchprice.style.borderBottom=style;
    txt_profitrate.style.borderBottom=style;
    txt_saleprice.style.borderBottom=style;

}

const checkErrors = () => {
    let errors = "";

    if(cooler.item_brand_id == null){
        errors = errors+"Cooler Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }

    if(cooler.cooler_type_id == null){
        errors = errors+"Cooler Type Not Selected..<br>";
        select_type.style.borderBottom="1px solid red";
    }

    if(cooler.modelname == null){
        errors = errors+"Cooler Model Name Not Enter<br>";
        txt_model.style.borderBottom="1px solid red";
    }

    if(cooler.name == null){
        errors = errors+"Cooler Name Not Enter<br>";
        txt_coolername.style.borderBottom="1px solid red";
    }


    /*if(cooler.height == null){
        errors = errors+"Air Cooler Height Not Enter<br>";
        txt_height.style.borderBottom="1px solid red";
    }*/



    /*if(cooler.radiator == null){
        errors = errors+"Liquid Cooler Radiator Size Not Enter<br>";
        txt_radiator.style.borderBottom="1px solid red";
    }*/

    if (cooler.cooler_type_id != null){
        if(cooler.cooler_type_id.id == 1 && cooler.radiator == null){
            errors = errors+"Liquid Cooler Radiator Size Not Enter<br>";
            txt_radiator.style.borderBottom="1px solid red";
        }else if(cooler.cooler_type_id.id == 2 && cooler.height == null){
            errors = errors+"Air Cooler Height Not Enter<br>";
            txt_height.style.borderBottom="1px solid red";
        }
    }


    if(cooler.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors = errors + "purchase price not Entered...<br>";
    }

    if(cooler.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors = errors + "profit rate not Entered...<br>";
    }



    if(cooler.sale_price == null){
        txt_saleprice.style.borderBottom = '1px solid red';
        errors = errors + "Sale price not Entered...<br>";
    }

    if(cooler.cooler_status_id == null){
        errors = errors+"Cooler Status Not Selected..<br>";
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
            title: "Are You Suer To Add Following Cooler..?",
            message: "Cooler Name ="+cooler.name,
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

                    $.ajax("/cooler",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(cooler),//data that pass to backend
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
                            title: 'Cooler Add Successfully',
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

const checkUpdates = () =>{
    let updates = "";

    if (cooler != null && old_cooler != null) {
        if (cooler.item_brand_id.name != old_cooler.item_brand_id.name) {
            updates = updates + "Cooler Brand Has Changed..<br>"
        }


        if (cooler != null && old_cooler != null) {
            if (old_cooler.cooler_series_id != null && cooler.cooler_series_id != null && cooler.cooler_series_id.name != old_cooler.cooler_series_id.name) {
                updates = updates + "Cooler Series Has Changed..<br>";
            } else if (old_cooler.cooler_series_id == null && cooler.cooler_series_id != null) {
                updates = updates + "Cooler Series Has Been Added..<br>";
            } else if (old_cooler.cooler_series_id != null && cooler.cooler_series_id == null) {
                updates = updates + "Cooler Series Has Been Removed..<br>";
            }
        } else if (cooler != null && old_cooler == null && cooler.cooler_series_id != null) {
            updates = updates + "Cooler Series Has Been Added..<br>";
        }

        if (cooler.modelname != old_cooler.modelname) {
            updates = updates + "Cooler Model Has Changed..<br>"
        }

        if (cooler.cooler_type_id.name != old_cooler.cooler_type_id.name) {
            updates = updates + "Cooler Model Has Changed..<br>"
        }

        if (cooler.name != old_cooler.name) {
            updates = updates + "Cooler Name Has Changed..<br>"
        }

        if (cooler.radiator != old_cooler.radiator) {
            updates = updates + "Radiator length Has Changed..<br>"
        }

        if (cooler.height != old_cooler.height) {
            updates = updates + "Air cooler height Has Changed..<br>"
        }

        if (cooler.rgbsupport != old_cooler.rgbsupport) {
            updates = updates + "RGB supportability Has Changed..<br>"
        }

        if(cooler.purchase_price != old_cooler.purchase_price){
            updates=updates+"Cooler Purchase Price Has Changed..<br>"
        }


        if(cooler.profit_rate != old_cooler.profit_rate){
            updates=updates+"Cooler Profit Rate Has Changed..<br>"
        }


        if(cooler.sale_price != old_cooler.sale_price){
            updates=updates+"Cooler Sale price Has Changed..<br>"
        }

        if (cooler.cooler_status_id.name != old_cooler.cooler_status_id.name) {
            updates = updates + "Cooler Status Has Changed..<br>"
        }
    }
    return updates
}

const buttonUpdateMC = () =>{
    console.log(cooler)
    console.log("old")
    console.log(old_cooler)
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

                        $.ajax("/cooler",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(cooler),//data that pass to backend
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
                                title: 'Cooler Update Successfully',
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