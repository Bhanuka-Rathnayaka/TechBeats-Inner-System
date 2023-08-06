//Function for browser onload event

window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Casing")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();


}
//define refreshTable function
const refreshTable = () =>{
    casing = new Array();
    casing = httpGetRequest("casing/all")

    //create display property list
    let display_property_list =["casing_code","casing_name","status_id.name","purchase_price","sale_price"];

    //cretae display property type list
    let display_property_datatype =["text","text","object","text","text"]

    //calling fillTable function
    fillTable(tbl_casing,casing,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    for (let index in casing){
        if (casing[index].status_id.name == "Removed"){
            tbl_casing.children[1].children[index].children[6].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_casing').dataTable();
}

const formReFill = (obj) =>{

    casing = httpGetRequest("/casing/getbyid?id="+obj.id)
    old_casing = httpGetRequest("/casing/getbyid?id="+obj.id)

    //set value in to text feild
    txt_model.value=casing.model_name;
    txt_casingname.value=casing.casing_name;
    txt_hdd.value=casing.hdd_bays;
    txt_ssd.value=casing.ssd_bays;
    txt_gpu.value=casing.max_gpu_leangth;
    txt_psu.value=casing.max_psu_leangth;
    txt_cooling.value=casing.max_cpucooler_height;

    if(casing.max_radiator_leangth == undefined){
        txt_radiator.value="";
    }else{
        txt_radiator.value=casing.max_radiator_leangth;
    }

    txt_purchprice.value=casing.purchase_price;
    txt_profitrate.value=casing.profit_rate;
    txt_saleprice.value=casing.sale_price;

    //set value in to select feild
    fillSelectField(select_brand,"",brands,"name",casing.item_brand_id.name);


    if(casing.series_id != undefined){
        fillSelectField(select_series,"",seriess,"name",casing.series_id.name);
    }else{
        fillSelectField(select_series,"",seriess,"name","");
    }

    fillSelectField(select_type,"",types,"name",casing.type_id.name);
    fillSelectField(select_color,"",colors,"name",casing.colotr_id.name);
    fillSelectField(select_status,"",statuss,"name",casing.status_id.name);

    //set value to switch
    if (casing.support_liquidcooling){
        Checkliquid.checked=true;
        txtliquid.innerText="Liquid Cooling : Support";
    }else{
        Checkliquid.checked=false;
        txtliquid.innerText="Liquid Cooling : Not-Support";
    }

    setStyle("1px solid green");

}

const rowDelete= (obj) => {

    let dlt_msg ="Are you sure you want to delete the following Casing...?"+"\n"+
        "Casing Code: " + obj.casing_code + "\n" +
        "Casing Name: " + obj.casing_name;


    // let response = window.confirm(dlt_msg);
    // alertify.confirm('Confirmation Box', dlt_msg, function(){
    //         let delete_server_responce;
    //
    //         $.ajax("/psu",{
    //             async : false,
    //             type:"DELETE",//Method
    //             data:JSON.stringify(obj),//data that pass to backend
    //             contentType:"application/json",
    //             success:function(succsessResData,successStatus,resObj){
    //                 delete_server_responce = succsessResData;
    //             },error:function (errorResOb,errorStatus,errorMsg){
    //                 delete_server_responce = errorMsg;
    //             }
    //         })
    //         if(delete_server_responce == "0"){
    //
    //
    //             alertify.success('Delete Complete')
    //             refreshTable();
    //
    //         }else{
    //             alertify.alert("you have following error \n" + delete_server_responce )
    //             alertify.error("Error")
    //
    //         }
    //
    //
    //         }
    //     , function(){
    //     alertify.error('Cancel')});

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Casing...?',
        message: "Casing Code: " + obj.casing_code + "<br>Casing Name: " + obj.casing_name,
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

                $.ajax("/casing",{
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

//view function
const rowView = (obj) =>{

    printCase = new Object();
    printCase = httpGetRequest("/casing/getbyid?id="+obj.id);
    
    td_code.innerHTML = printCase.casing_code;
    td_name.innerHTML = printCase.casing_name;
    td_status.innerHTML = printCase.status_id.name
    td_pprice.innerHTML = printCase.purchase_price;
    td_sprice.innerHTML = printCase.sale_price;
    $('#caseViewModel').modal('show')
}

const casePrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Casing Details</h2>"
        + casePrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}



//define refreshForm function
const refreshForm = () =>{
    casing = new Object();
    old_casing = null;

    //create array for fill select element
    brands = new Array();
    brands = httpGetRequest("/itembrand/bycategorycase");

    seriess = new Array();
    seriess = httpGetRequest("casingseries/all");

    types = new Array();
    types = httpGetRequest("casingtype/all");

    colors = new Array();
    colors = httpGetRequest("casingcolor/all");

    statuss = new Array();
    statuss = httpGetRequest("casingstatus/all");

    fillSelectField(select_brand,"",brands,"name","");
    fillSelectField(select_series,"",seriess,"name","");
    fillSelectField(select_type,"",types,"name","");
    fillSelectField(select_color,"",colors,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    casing.status_id=JSON.parse(select_status.value);//Auto select value set

    //need to be empty all field after add
    txt_model.value="";
    txt_casingname.value="";
    txt_hdd.value="";
    txt_ssd.value="";
    txt_gpu.value="";
    txt_psu.value="";
    txt_cooling.value="";
    txt_radiator.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";

    Checkliquid.checked=true;
    casing.support_liquidcooling=true;
    txtliquid.innerText="Liquid Cooling : Support"

    //set validate color to auto select field
    select_status.style.borderBottom = "1px solid green";

    setStyle("1px solid #fff");
}

const setStyle = (style) =>{
    select_brand.style.borderBottom=style;


    if(casing.series_id != undefined){
        select_series.style.borderBottom=style;
    }else{
        select_series.style.borderBottom="1px solid #fff";
    }

    select_color.style.borderBottom=style;
    select_type.style.borderBottom=style;
    txt_model.style.borderBottom=style;
    txt_casingname.style.borderBottom=style;
    txt_hdd.style.borderBottom=style;
    txt_ssd.style.borderBottom=style;
    txt_gpu.style.borderBottom=style;
    txt_psu.style.borderBottom=style;
    txt_cooling.style.borderBottom=style;


    if(casing.max_radiator_leangth == undefined){
        txt_radiator.style.borderBottom="1px solid #fff";
    }else{
        txt_radiator.style.borderBottom=style;
    }

    txt_purchprice.style.borderBottom=style;
    txt_profitrate.style.borderBottom=style;
    txt_saleprice.style.borderBottom=style;

}

const checkErrors = () => {
    let errors = "";

    if(casing.item_brand_id == null){
        errors = errors+"Casing Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }



    if(casing.type_id == null){
        errors = errors+"Casing Type Not Selected..<br>";
        select_type.style.borderBottom="1px solid red";
    }

    if(casing.colotr_id == null){
        errors = errors+"Casing Color Not Selected..<br>";
        select_color.style.borderBottom="1px solid red";
    }

    if(casing.status_id == null){
        errors = errors+"Casing Status Not Selected..<br>";
        select_status.style.borderBottom="1px solid red";
    }


    if(casing.model_name == null){
        errors = errors+"Casing Model Name Not Enter<br>";
        txt_model.style.borderBottom="1px solid red";
    }

    if(casing.casing_name == null){
        errors = errors+"Casing Name Not Enter<br>";
        txt_casingname.style.borderBottom="1px solid red";
    }

    if(casing.hdd_bays == null){
        errors = errors+"No of HDD Bays Not Enter<br>";
        txt_hdd.style.borderBottom="1px solid red";
    }

    if(casing.ssd_bays == null){
        errors = errors+"No of SSD Bays Not Enter<br>";
        txt_ssd.style.borderBottom="1px solid red";
    }

    if(casing.max_gpu_leangth == null){
        errors = errors+"Maxmimum GPU Length Not Enter<br>";
        txt_gpu.style.borderBottom="1px solid red";
    }

    if(casing.max_psu_leangth == null){
        errors = errors+"Maxmimum PSU Length Not Enter<br>";
        txt_psu.style.borderBottom="1px solid red";
    }

    if(casing.max_cpucooler_height == null){
        errors = errors+"Maxmimum CPU Cooler Height Not Enter<br>";
        txt_cooling.style.borderBottom="1px solid red";
    }

    if(casing.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors = errors + "purchase price not Entered...<br>";
    }

    if(casing.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors = errors + "profit rate not Entered...<br>";
    }

    if(casing.sale_price == null){
        txt_saleprice.style.borderBottom = '1px solid red';
        errors = errors + "Sale price not Entered...<br>";
    }

    return errors;
}

const buttonAddMc = () =>{
    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Casing..?",
            message: "Casing Name ="+casing.casing_name,
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

                    $.ajax("/casing",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(casing),//data that pass to backend
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
                            title: 'Casing Add Successfully',
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

const checkUpdates = () => {
    let updates = "";

    if (casing != null && old_casing != null) {
        if (casing.item_brand_id.name != old_casing.item_brand_id.name) {
            updates = updates + "Casing Brand Has Changed..<br>"
        }

        if (casing.series_id.name != old_casing.series_id.name) {
            updates = updates + "Casing Series Has Changed..<br>"
        }

        if (casing.model_name != old_casing.model_name) {
            updates = updates + "Casing Model Name Has Changed..<br>"
        }

        if (casing.casing_name != old_casing.casing_name) {
            updates = updates + "Casing Name Has Changed..<br>"
        }

        if (casing.type_id.name != old_casing.type_id.name) {
            updates = updates + "Casing Brand Has Changed..<br>"
        }

        if (casing.ssd_bays != old_casing.ssd_bays) {
            updates = updates + "Casing SSD Bays Has Changed..<br>"
        }

        if (casing.hdd_bays != old_casing.hdd_bays) {
            updates = updates + "Casing HDD Bays Has Changed..<br>"
        }

        if (casing.max_gpu_leangth != old_casing.max_gpu_leangth) {
            updates = updates + "Casing Support Maximum GPU Length Has Changed..<br>"
        }

        if (casing.max_psu_leangth != old_casing.max_psu_leangth) {
            updates = updates + "Casing Support Maximum PSU Length Has Changed..<br>"
        }

        if (casing.max_cpucooler_height != old_casing.max_cpucooler_height) {
            updates = updates + "Casing Support Maximum CPU Cooler Height Has Changed..<br>"
        }

        if (casing.support_liquidcooling != old_casing.support_liquidcooling) {
            updates = updates + "Casing Liquidity Cooling Support Has Changed..<br>"
        }

        if (casing.max_radiator_leangth != old_casing.max_radiator_leangth) {
            updates = updates + "Casing Maximum Radiator Length  Has Changed..<br>"
        }

        if (casing.colotr_id.name != old_casing.colotr_id.name) {
            updates = updates + "Casing Color Has Changed..<br>"
        }

        if(casing.purchase_price != old_casing.purchase_price){
            updates=updates+"Casing Purchase Price Has Changed..<br>"
        }


        if(casing.profit_rate != old_casing.profit_rate){
            updates=updates+"Casing Profit Rate Has Changed..<br>"
        }


        if(casing.sale_price != old_casing.sale_price){
            updates=updates+"Casing Sale price Has Changed..<br>"
        }

        if (casing.status_id.name != old_casing.status_id.name) {
            updates = updates + "Casing Status Has Changed..<br>"
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

                        $.ajax("/casing",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(casing),//data that pass to backend
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
                                title: 'PSU Update Successfully',
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
