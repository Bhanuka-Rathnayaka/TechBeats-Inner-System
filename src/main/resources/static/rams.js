//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {

    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Ram")

    refreshTable();
    refreshForm();


}

//define refreshTable function
const refreshTable = () =>{
    //array for store ram data
    ram = new Array();
    ram = httpGetRequest("rams/all")

    //create display property list
    let display_property_list = ["rcode","rname","purchase_price","sale_price",'warrenty',"ram_status_id.name"];

    //cretae display property type list
    let display_property_datatype = ["text","text","decimal","decimal","text","object"];

    //calling fillTable function
    fillTable(tbl_ram,ram,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in ram){
        if (ram[index].ram_status_id.name == "Removed"){
            tbl_ram.children[1].children[index].children[7].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_ram').dataTable();


}

//refill when click edit button
const formReFill = (obj,rowno) => {

    ram = new Object();
    old_ram = new Object();

    $.ajax('/rams/getbyid/'+obj.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            ram = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            ram = {};
        }
    })

    $.ajax('/rams/getbyid/'+obj.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            old_ram = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            old_ram = {};
        }
    })

    //set value in to feild
    txt_rname.value =ram.rname
    txt_purchprice.value = ram.purchase_price;
    txt_profitrate.value =ram.profit_rate;
    txt_saleprice.value = ram.sale_price;
    txt_warrenty.value = ram.warrenty;


    fillSelectField(select_brand,"",brand,"name",ram.item_brand_id.name);
    fillSelectField(select_capacity,"",capacity,"name",ram.ram_capacity_id.name);
    fillSelectField(select_series,"",series,"name",ram.ram_product_series_id.name);
    fillSelectField(select_type,"",type,"name",ram.ram_type_id.name);
    fillSelectField(select_speed,"",speed,"name",ram.ram_speed_id.name);
    // fillSelectField(select_color,"Select Color",color,"name",ram.ram_color_id.name);

    /*if(ram.ram_color_id.name != undefined){
        fillSelectField(select_color,"",color,"name",ram.ram_color_id.name);
    }else{
        fillSelectField(select_color,"",color,"","");
    }*/

    fillSelectField(select_status,"",statuss,"name",ram.ram_status_id.name);

    setStyle("2px solid green");

    tabSwitch(ram_table,ram_form)

    disabledButton(false,true)


}

//delete function when click delete button
const rowDelete= (obj) => {

    let dlt_msg ="Are you suer want to delete following Ram? \n"+
        "Ram Code = "+obj.rcode + "\n" +
        "Ram name =" + obj.rname;
    let response = window.confirm(dlt_msg);

    if(response){

        let delete_server_responce;

        $.ajax("/rams",{
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

            alert("delete ok")
            refreshTable();

        }else{

            window.alert("you have follwing error \n" + delete_server_responce )
        }


    };



}

//view function
const rowView = (obj) =>{

    printRam = new Object();
    printRam = httpGetRequest('/rams/getbyid/'+obj.id)
    console.log(printRam);


    td_rcode.innerHTML = printRam.rcode;
    td_rname.innerHTML = printRam.rname;
    td_status.innerHTML = printRam.ram_status_id.name;
    td_pprice.innerHTML = printRam.purchase_price;
    td_sprice.innerHTML = printRam.sale_price;
    td_date.innerHTML = printRam.adddatetime;
    $('#ramViewModel').modal('show')
}

const ramPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>RAM Details</h2>"
        + ramPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}


const refreshForm =() =>{
     ram = new Object;
    old_ram = null;

    //create array for fill select element
    brand = new Array();
    brand = httpGetRequest("itembrand/bycategoryram")

    capacity = new Array();
    capacity =httpGetRequest("/ramcapacity/all");

   /* color = new Array();
    color = httpGetRequest("/ramcolor/all");*/


    series = new Array();
    series = httpGetRequest("/ramseries/all");

    speed = new Array();
    speed = httpGetRequest("ramspeed/all")

    statuss = new Array();
    statuss = httpGetRequest("/ramstatus/all");

    type = new Array();
    type = httpGetRequest("ramtype/all");


    user = new Array();
    user = httpGetRequest("/user/all")


    //fill data from above array to select feild in form
    fillSelectField(select_brand,"",brand,"name","");
    fillSelectField(select_capacity,"",capacity,"name","");
    fillSelectField(select_series,"",series,"name","");
    fillSelectField(select_type,"",type,"name","");
    fillSelectField(select_speed,"",speed,"name","");
    // fillSelectField(select_color,"",color,"name","");
    fillSelectField(select_status,"",statuss,"name","Use","");
    ram.ram_status_id = JSON.parse(select_status.value);


    //need to be empty all field after add

    txt_rname.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";
    txt_warrenty.value="";

    //set style to default
    setStyle("1px solid #fff")

    //set validate color to auto select field
    select_status.style.borderBottom = "1px solid green";


}

function setStyle(style){
    select_brand.style.borderBottom=style;
    select_capacity.style.borderBottom=style;
    select_series.style.borderBottom=style;
    select_type.style.borderBottom=style;
    select_speed.style.borderBottom=style;
    //select_color.style.borderBottom = style;
    txt_rname.style.borderBottom=style;
    select_status.style.borderBottom=style;
    txt_purchprice.style.borderBottom=style;
    txt_profitrate.style.borderBottom=style;
    txt_saleprice.style.borderBottom=style;
    txt_warrenty.style.borderBottom=style;

    disabledButton(true,false)
}

//check errors
const checkError = () =>{
    let errors = "";

     if(ram.item_brand_id == null){
        select_brand.style.borderBottom = '2px solid red';
        errors = errors + "Ram brand Not selected..<br>";
    }

    if(ram.ram_capacity_id == null){
        select_capacity.style.borderBottom = '2px solid red';
        errors = errors + "Ram capacity Not selected..<br>";
    }

    if(ram.ram_product_series_id == null){
        select_series.style.borderBottom = '2px solid red';
        errors = errors + "Ram series Not selected..<br>";
    }

    if(ram.ram_type_id == null){
        select_type.style.borderBottom = '2px solid red';
        errors = errors + "Ram type Not selected..<br>";
    }

    if(ram.ram_speed_id == null){
        select_speed.style.borderBottom = '2px solid red';
        errors = errors + "Ram speed Not selected..<br>";
    }


    if(ram.rname == null){
        txt_rname.style.borderBottom = '2px solid red';
        errors = errors + "Ram Name not Entered..<br>";
    }



    if(ram.ram_status_id == null){
        select_status.style.borderBottom = '2px solid red';
        errors = errors + "Ram Status Not selected..<br>";
    }



    if(ram.purchase_price == null){
        txt_purchprice.style.borderBottom = '2px solid red';
        errors = errors + "purchase price not Entered..<br>";
    }

    if(ram.profit_rate == null){
        txt_profitrate.style.borderBottom = '2px solid red';
        errors = errors + "profit rate not Entered..<br>";
    }


    if(ram.sale_price == null){
        txt_saleprice.style.borderBottom = '2px solid red';
        errors = errors + "Sale price not Entered..<br>";
    }

    if(ram.warrenty == null){
        txt_warrenty.style.borderBottom = '2px solid red';
        errors = errors + "Warrenty not Entered..<br>";
    }

    return errors;
}
//Add
const buttonAddMc = () =>{
    //Check errors before add
    let errors = checkError();

    //if no error
    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following RAM..?",
            message: "RAM Name ="+ram.rname,
            layout: 2,
            position: 'topCenter',
            overlay: true,
            timeout: false,
            close:false,
            closeOnEscape: false,
            progressBar: false,
            buttons: [
                ['<button><b>Yes</b></button>', function (instance, toast) {
                    // when the "Yes" button is clicked

                    let post_server_responce;

                    $.ajax("/rams",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(ram),//data that pass to backend
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
                            title: 'RAM Add Successfully',
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
                        tabSwitchForm(ram_table,ram_form);
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
                    // when the "No" button is clicked
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

//update

function checkUpdate(){
    let updates = "";

    if(ram != null && old_ram!= null){
        if(ram.rnam != old_ram.rname){
            updates = updates + "Ram name has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.item_brand_id.name != old_ram.item_brand_id.name){
            updates = updates + "Ram Brand has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.ram_product_series_id.name != old_ram.ram_product_series_id.name){
            updates = updates + "Ram series has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.ram_type_id.name != old_ram.ram_type_id.name){
            updates = updates + "Ram type has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.ram_capacity_id.name != old_ram.ram_capacity_id.name){
            updates = updates + "Ram capacity has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.ram_speed_id.name != old_ram.ram_speed_id.name){
            updates = updates + "Ram speed has changed..<br>";
        }
    }

    /*if(ram != null && old_ram!= null){
        if(ram.ram_color_id.name != old_ram.ram_color_id.name){
            updates = updates + "Ram color has changed..\n";
        }
    }*/


    if(ram != null && old_ram!= null){
        if(ram.ram_status_id.name != old_ram.ram_status_id.name){
            updates = updates + "Ram status has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.purchase_price != old_ram.purchase_price){
            updates = updates + "Ram purchase price has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.profit_rate != old_ram.profit_rate){
            updates = updates + "Ram profit rate has changed..<br>";
        }
    }


    if(ram != null && old_ram!= null){
        if(ram.min_discount != old_ram.min_discount){
            updates = updates + "Ram min_discount has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.max_discount != old_ram.max_discount){
            updates = updates + "Ram max_discount has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.sale_price != old_ram.sale_price){
            updates = updates + "Ram sale price has changed..<br>";
        }
    }

    if(ram != null && old_ram!= null){
        if(ram.warrenty != old_ram.warrenty){
            updates = updates + "Ram Warrety has changed..<br>";
        }
    }



    return updates;
}


const buttonUpdateMC = () =>{
    let errors = checkError();
    if (errors == ""){
        let updates = checkUpdate();
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

                        $.ajax("/rams",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(ram),//data that pass to backend
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
                                title: 'RAM Update Successfully',
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

const buttonClearMC = () =>{
    refreshTable();
    refreshForm();
}
