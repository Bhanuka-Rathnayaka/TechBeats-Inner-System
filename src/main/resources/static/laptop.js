window.addEventListener("load",refreshBrowser);

function refreshBrowser(){

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Laptop")

    refreshForm();
    refreshTable()

    select_brand.addEventListener("change",event =>{
        seriessByBrand = httpGetRequest("/laptopseries/allbybrand?bid="+JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
        laptop.lap_seres_id = null;
        select_series.style.borderBottom = "1px solid #fff"
    })
}

const refreshTable = () =>{
    laptops = httpGetRequest("laptop/all");

    //create display property list
    let display_property_list =["code","name","processor","ram","vga","storage","purchase_price","sale_price","warrenty","lap_status_id.name"];

    //cretae display property type list
    let display_property_datatype =["text","text","text","text","text","text","decimal","decimal","text","object"];

    fillTable(tbl_lap,laptops,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    for (let index in laptops){
        if (laptops[index].lap_status_id.name == "Removed"){
            tbl_lap.children[1].children[index].children[11].children[2].disabled = true;
        }
    }

    $('#tbl_lap').dataTable();
}

const formReFill = (obj) =>{

    laptop = httpGetRequest("/laptop/getbyid?id="+obj.id)
    old_laptop = httpGetRequest("/laptop/getbyid?id="+obj.id)

    //set value in to select feild
    fillSelectField(select_brand,"",brands,"name",laptop.item_brand_id.name);


    if(laptop.lap_seres_id != undefined){
        seriessByBrand = httpGetRequest("/laptopseries/allbybrand?bid="+JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name",laptop.lap_seres_id.name);
    }else{
        seriessByBrand = httpGetRequest("laptopseries/allbybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_series,"",seriessByBrand,"name","");
    }

    txt_modelname.value=laptop.modelname;
    txt_name.value=laptop.name;

    txt_processor.value= laptop.processor;
    txt_rcapacity.value= laptop.ram;
    txt_vga.value= laptop.vga;
    txt_storage.value= laptop.storage

    txt_purchprice.value=laptop.purchase_price;
    txt_profitrate.value=laptop.profit_rate;
    txt_saleprice.value=laptop.sale_price;
    txt_warrenty.value=laptop.warrenty;

    disabledButton(false,true);
    setStyle("2px solid green")

    tabSwitch(lap_table,lap_form);
}

const rowDelete = (obj) =>{

}

const rowView = (obj) =>{

}

const refreshForm = () =>{

    laptop = new Object();
    old_laptop = null;

    brands = httpGetRequest("itembrand/bycategorylap");
    fillSelectField(select_brand,"",brands,"name","");

    statuss = httpGetRequest("laptopstatus/all");
    fillSelectField(select_status,"",statuss,"name","Use");
    laptop.lap_status_id = JSON.parse(select_status.value)//auto set value
    select_status.style.borderBottom="2px solid green";


    //empty text field value
    txt_modelname.value="";
    txt_name.value="";
    txt_processor.value="";
    txt_rcapacity.value="";
    txt_vga.value="";
    txt_storage.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";
    txt_warrenty.value="";

    //dissable update buton
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

    //set default style
    setStyle("1px solid #fff");


}

const setStyle = (style) =>{
    select_brand.style.borderBottom = style;

    if(laptop.lap_seres_id != undefined){
        select_series.style.borderBottom=style;
    }else{
        select_series.style.borderBottom="1px solid #fff";
    }

    select_status.style.borderBottom = style;
    txt_modelname.style.borderBottom = style;
    txt_name.style.borderBottom = style;
    txt_processor.style.borderBottom = style;
    txt_rcapacity.style.borderBottom = style
    txt_vga.style.borderBottom = style
    txt_storage.style.borderBottom = style
    txt_purchprice.style.borderBottom = style
    txt_profitrate.style.borderBottom = style
    txt_saleprice.style.borderBottom = style
    txt_warrenty.style.borderBottom = style
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
            laptop.sale_price = txt_saleprice.value;

            if (old_laptop != null && laptop.sale_price != old_laptop.sale_price) {
                txt_saleprice.style.borderBottom = "2px solid orange"
            } else {
                txt_saleprice.style.borderBottom = "2px solid green"
            }
        } else {
            txt_saleprice.value = "";
            laptop.sale_price = null;
            txt_saleprice.style.borderBottom = "1px solid #fff"
        }
    }else {
        txt_saleprice.value = "";
        laptop.sale_price = null;
        txt_saleprice.style.borderBottom = "1px solid #fff"
    }

}

const genarateName = () =>{
    if(select_brand.value != ""  && txt_modelname.value!= "" ){

        if (select_series.value == ""){
            select_series.value = ""
            txt_name.value=JSON.parse(select_brand.value).name + " " + txt_modelname.value;
            laptop.name = txt_name.value;

        }else{
            txt_name.value=JSON.parse(select_brand.value).name + " "+JSON.parse(select_series.value).name + " " + txt_modelname.value;
            laptop.name = txt_name.value;

        }


        if(old_laptop != null && laptop.name != old_laptop.name){
            txt_name.style.borderBottom = "1px solid orange"
        }else{
            txt_name.style.borderBottom = "1px solid green"
        }

    }else {
        txt_name.value="";
        laptop.name = null;
        txt_name.style.borderBottom = "1px solid red"
    }
}

const checkErrors = () =>{
    let errors = "";

    if (laptop.item_brand_id == null){
        select_brand.style.borderBottom="1px solid red";
        errors += "Laptop Brand Not Selected..<br>"
    }


    if (laptop.modelname == null){
        txt_modelname.style.borderBottom="1px solid red";
        errors += "Valid Laptop Model Not Enter..<br>"
    }

    if (laptop.name == null){
        txt_name.style.borderBottom="1px solid red";
        errors += "Valid Laptop Name Not Enter..<br>"
    }

    if (laptop.processor == null){
        txt_processor.style.borderBottom="1px solid red";
        errors += "Valid Processor Name Not Enter..<br>"
    }

    if (laptop.ram == null){
        txt_rcapacity.style.borderBottom="1px solid red";
        errors += "Valid RAM Not Enter..<br>"
    }

    if (laptop.storage == null){
        txt_storage.style.borderBottom="1px solid red";
        errors += "Valid Storage Not Enter..<br>"
    }

    if (laptop.vga == null){
         txt_vga.style.borderBottom="1px solid red";
        errors += "Valid Graphic Card Not Enter..<br>"
    }
    if(laptop.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors += "Valide purchase price not Entered...<br>";
    }

    if(laptop.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors += "Valide profit rate not Entered...<br>";
    }
    if(laptop.sale_price == null){
        txt_saleprice.style.borderBottom = '1px solid red';
        errors += "Valide Sale price not Entered...<br>";
    }

    if(laptop.warrenty == null){
        txt_warrenty.style.borderBottom = '1px solid red';
        errors += "Warranty not Entered...<br>";
    }

    if(laptop.lap_status_id == null){
        select_status.style.borderBottom = '1px solid red';
        errors += "Laptop Status not Entered...<br>";
    }

    return errors;
}

const buttonAddMc = () =>{
    console.log(laptop);
    let errors = checkErrors();

    if (errors == ""){
        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Laptop..?",
            message: "Laptop Name ="+laptop.name,
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

                    $.ajax("/laptop",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(laptop),//data that pass to backend
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

    }else {
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


