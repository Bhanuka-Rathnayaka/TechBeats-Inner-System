//Function for browser onload event

window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Power Supply Unit")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();


}

//define refreshTable function
const refreshTable = () =>{
    //array for store ram data

    psu = new Array();
    psu = httpGetRequest("psu/all")

    //create display property list
    let display_property_list = ["pscode","psname","psstatus_id.name","purchase_price","sale_price"];

    //cretae display property type list
    let display_property_datatype = ["text","text","object","text","text"];

    //calling fillTable function
    fillTable(tbl_psu,psu,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in psu){
        if (psu[index].psstatus_id.name == "Removed"){
            tbl_psu.children[1].children[index].children[6].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_psu').dataTable();


}

const formReFill = (obj) =>{
    psu = httpGetRequest("/psu/getbyid?id="+obj.id)
    old_psu = httpGetRequest("/psu/getbyid?id="+obj.id)

    //set value in to text feild
    txt_psuname.value =psu.psname;
    txt_model.value =psu.model_name;
    txt_purchprice.value = psu.purchase_price;
    txt_profitrate.value =psu.profit_rate;
    txt_saleprice.value = psu.sale_price;

    fillSelectField(select_brand,"",brands,"name",psu.item_brand_id.name);

    if(psu.psseries_id != undefined){
        fillSelectField(select_series,"",seriess,"name",psu.psseries_id.name);
    }else{
        fillSelectField(select_series,"",seriess,"name","");

    }
    fillSelectField(select_wattage,"",wattages,"name",psu.pswattage_id.name);
    fillSelectField(select_efficiency,"",efficincies,"name",psu.psefficiency_id.name);
    fillSelectField(select_modular,"",modular,"name",psu.psmodular_id.name);
    fillSelectField(select_status,"",statuss,"name",psu.psstatus_id.name);

    setStyle("1px solid green");
}

const rowDelete= (obj) => {

    let dlt_msg ="Are you sure you want to delete the following PSU...?"+"\n"+
        "PSU Code: " + obj.pscode + "\n" +
        "PSU Name: " + obj.psname;


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
            title: 'Are you sure to delete the following PSU...?',
            message: "PSU Code: " + obj.pscode + "<br>PSU Name: " + obj.psname,
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

                            $.ajax("/psu",{
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
    psu = new Object();
    old_psu = null;

    //create array for fill select element
    brands = new Array();
    brands = httpGetRequest("/itembrand/bycategorypsu");

    efficincies = new Array();
    efficincies = httpGetRequest("/psuefficace/all");

    modular = new Array();
    modular = httpGetRequest("/psumodular/all");

    seriess = new Array();
    seriess = httpGetRequest("/psuseries/all");

    statuss = new Array();
    statuss = httpGetRequest("/psustatus/all");

    wattages = new Array();
    wattages = httpGetRequest("/psuwattage/all");

    colors = new Array();
    colors = httpGetRequest("casingcolor/all")

    fillSelectField(select_brand,"",brands,"name","");
    fillSelectField(select_series,"",seriess,"name","");
    fillSelectField(select_wattage,"",wattages,"name","");
    fillSelectField(select_efficiency,"",efficincies,"name","");
    fillSelectField(select_modular,"",modular,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    psu.psstatus_id=JSON.parse(select_status.value);//Auto select value set

    //need to be empty all field after add
    txt_model.value="";
    txt_psuname.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";

    //set validate color to auto select field
    select_status.style.borderBottom = "1px solid green";

    setStyle("1px solid #fff");
    select_series.style.borderBottom="1px solid #fff";

}

const setStyle = (style) =>{
    select_brand.style.borderBottom=style;
    select_wattage.style.borderBottom=style;
    select_efficiency.style.borderBottom=style;
    select_modular.style.borderBottom=style;
    txt_model.style.borderBottom=style;
    txt_psuname.style.borderBottom=style;
    txt_saleprice.style.borderBottom=style;
    txt_purchprice.style.borderBottom=style;
    txt_profitrate.style.borderBottom=style;

}

const checkErrors = () =>{
    let errors = "";
    if(psu.item_brand_id == null){
        errors = errors+"PSU Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }


    if(psu.model_name == null){
        errors = errors+"PSU Model Name Not Enter<br>";
        txt_model.style.borderBottom="1px solid red";
    }

    if(psu.pswattage_id == null){
        errors = errors+"PSU Wattage Not Selected<br>";
        select_wattage.style.borderBottom="1px solid red";
    }

    if(psu.psmodular_id == null){
        errors = errors+"PSU Modular Not Selected<br>";
        select_modular.style.borderBottom="1px solid red";
    }

    if(psu.psefficiency_id == null){
        errors = errors+"PSU Efficiency Not Selected<br>";
        select_efficiency.style.borderBottom="1px solid red";
    }


    if(psu.psname == null){
        errors = errors+"PSU Name Not Not Enter<br>";
        txt_psuname.style.borderBottom="1px solid red";
    }

    if(psu.psstatus_id == null){
        errors = errors+"PSU Status Not Selected<br>"
        select_status.style.borderBottom = '1px solid red';

    }

    if(psu.purchase_price == null){
        txt_purchprice.style.borderBottom = '1px solid red';
        errors = errors + "purchase price not Entered...<br>";
    }

    if(psu.profit_rate == null){
        txt_profitrate.style.borderBottom = '1px solid red';
        errors = errors + "profit rate not Entered...<br>";
    }



    if(psu.sale_price == null){
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
            title: "Are You Suer To Add Following PSU..?",
            message: "PSU Name ="+psu.psname,
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

                    $.ajax("/psu",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(psu),//data that pass to backend
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
                            title: 'PSU Add Successfully',
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

    if(psu != null && old_psu!= null){
        if (psu.item_brand_id.name != old_psu.item_brand_id.name){
            updates=updates+"PSU Brand Has Changed..<br>"
        }

        // if (psu.psseries_id.name != old_psu.psseries_id.name){
        //     updates=updates+"PSU Series Has Changed..<br>"
        // }

        if (psu.pswattage_id.name != old_psu.pswattage_id.name){
            updates=updates+"PSU Wattage Has Changed..<br>"
        }

        if (psu.psefficiency_id.name != old_psu.psefficiency_id.name){
            updates=updates+"PSU Efficiency Has Changed..<br>"
        }

        if (psu.psmodular_id.name != old_psu.psmodular_id.name){
            updates=updates+"PSU Modular Has Changed..<br>"
        }

        if (psu.psstatus_id.name != old_psu.psstatus_id.name){
            updates=updates+"PSU Status Has Changed..<br>"
        }

        if (psu.model_name != old_psu.model_name){
            updates=updates+"PSU Model Name Has Changed..<br>"
        }

        if (psu.psname != old_psu.psname){
            updates=updates+"PSU  Name Has Changed..<br>"
        }

        if(psu.purchase_price != old_psu.purchase_price){
            updates=updates+"PSU Purchase Price Has Changed..<br>"
        }


        if(psu.profit_rate != old_psu.profit_rate){
            updates=updates+"PSU Profit Rate Has Changed..<br>"
        }


        if(psu.sale_price != old_psu.sale_price){
            updates=updates+"PSU Sale price Has Changed..<br>"
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

                        $.ajax("/psu",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(psu),//data that pass to backend
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