//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Vga")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

}

const refreshTable = () => {
    //array for store vga data
    vgas = new Array();
    vgas=httpGetRequest("/vga/all")


    //create display property list
    let display_property_list = ["vcode","vname","vga_status_id.name"];

    //cretae display property type list
    let display_property_datatype =["text","text","object"]

    //call filltable function fore fill table
    fillTable(tbl_vga,vgas,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    //To add jquery table
    $('#tbl_vga').dataTable();
}

const formReFill = (obj) =>{
    vga = new Object();
    vga = httpGetRequest('/vga/getbyid/'+obj.id)
    old_vga = new Object();
    old_vga = httpGetRequest('/vga/getbyid/'+obj.id)

    //set value to text field
    txt_vname.value =vga.vname;

    if(vga.edition != undefined){
        txt_vedition.value = vga.edition;
    }

    txt_length.value=vga.length
    txt_psu.value = vga.psu
    txt_profitrate.value =vga.profit_rate;



    //set value to select field
    fillSelectField(select_brand,"",brands,"name",vga.item_brand_id.name,"");
    fillSelectField(select_series,"",seriess,"name",vga.vga_series_id.name,"");
    fillSelectField(select_chipset,"",chipsets,"name",vga.vga_chipset_id.name,"");
    fillSelectField(select_capacity,"",capacitys,"name",vga.vga_capacity_id.name,"");
    fillSelectField(select_type,"",types,"name",vga.vga_type_id.name,"");
    fillSelectField(select_interface,"",interfaces,"name",vga.vga_interface_id,"");
    fillSelectField(select_status,"",statuss,"name",vga.vga_status_id.name,"");



}

const rowDelete = (obj) => {
    let dlt_msg = "Are you suer want to delete following VGA? \n" +
        "VGA Code = " + obj.vcode + "\n" +
        "VGA name =" + obj.vname;

    let response = window.confirm(dlt_msg);
    if (response) {

        let delete_server_responce;

        $.ajax("/vga", {
            async: false,
            type: "DELETE",//Method
            data: JSON.stringify(obj),//data that pass to backend
            contentType: "application/json",
            success: function (succsessResData, successStatus, resObj) {
                delete_server_responce = succsessResData;
            }, error: function (errorResOb, errorStatus, errorMsg) {
                delete_server_responce = errorMsg;
            }
        })
        if (delete_server_responce == "0") {

            alert("delete ok")
            refreshTable();

        } else {

            window.alert("you have follwing error \n" + delete_server_responce)
        }

    }
}

const rowView = (obj) =>{
    printVga = new Object();
    printVga = httpGetRequest('/vga/getbyid/'+obj.id)

    td_code.innerHTML = printVga.vcode;
    td_name.innerHTML = printVga.vname;
    td_status.innerHTML = printVga.vga_status_id.name;
    td_date.innerHTML = printVga.adddatetime;
    $('#vgaViewModel').modal('show')
};

const vgaPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'
        +"<h2>VGA Details</h2>"
        + vgaPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },100)
};


const refreshForm = () =>{
    vga = new Object();
    old_vga = null;

    //create array for fill select element
    brands = new Array();
    brands = httpGetRequest("/itembrand/bycategoryvga");

    capacitys = new Array();
    capacitys = httpGetRequest("/vgacapacity/all");

    chipsets = new Array();
    chipsets = httpGetRequest("/vgachipset/all");

    interfaces = new Array("");
    interfaces = httpGetRequest("/vgainterface/all");

    seriess = new Array();
    seriess = httpGetRequest("/vgaseries/all");

    statuss = new Array();
    statuss = httpGetRequest("/vgastatus/all");

    types = new Array();
    types = httpGetRequest("/vgatype/all");

    // bind
    fillSelectField(select_brand,"",brands,"name","");
    fillSelectField(select_series,"",seriess,"name","");
    fillSelectField(select_chipset,"",chipsets,"name","");
    fillSelectField(select_capacity,"",capacitys,"name","");
    fillSelectField(select_type,"",types,"name","");
    fillSelectField(select_interface,"",interfaces,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    vga.vga_status_id = JSON.parse(select_status.value);
};

const checkErrors = () => {
    let errors = "";

  if(vga.item_brand_id == null){
        errors += "Item Brand Not Selected\n";
        select_brand.style.borderBottom = "2px solid red"
  }

    if(vga.vga_series_id == null){
        errors += "VGA Series Not Selected\n";
        select_series.style.borderBottom = "2px solid red"
    }

    if(vga.vga_chipset_id == null){
        errors += "VGA Chipset Not Selected\n";
        select_chipset.style.borderBottom = "2px solid red"
    }

    if(vga.vga_capacity_id == null){
        errors += "VGA Capasity Not Selected\n";
        select_capacity.style.borderBottom = "2px solid red"
    }

    if(vga.vga_type_id == null){
        errors += "VGA Type Not Selected\n";
        select_type.style.borderBottom = "2px solid red"
    }

    if(vga.vname == null){
        errors += "VGA Name Not Enter\n";
        txt_vname.style.borderBottom = "2px solid red"
    }

    if(vga.vga_interface_id == null){
        errors += "VGA Interface Not Select\n";
        select_interface.style.borderBottom = "2px solid red"
    }

    if(vga.length == null){
        errors += "VGA Length Not Enter\n";
        txt_length.style.borderBottom = "2px solid red"
    }

    if(vga.psu == null){
        errors += "VGA Power Not Enter\n";
        txt_psu.style.borderBottom = "2px solid red"
    }

    if(vga.purchase_price == null){
        txt_purchprice.style.borderBottom = '2px solid red';
        errors = errors + "purchase price not Entered\n";
    }

    if(vga.profit_rate == null){
        txt_profitrate.style.borderBottom = '2px solid red\n';
        errors = errors + "profit rate not Entered\n";
    }


    if(vga.sale_price == null){
        txt_saleprice.style.borderBottom = '2px solid red';
        errors = errors + "Sale price not Entered\n";
    }

    return errors;
}

const buttonAddMc = () =>{
    console.log(vga)

    let error = checkErrors();

    if (error == ""){
        let submit_confirmMg = "are you suer to add following Processor"+
            "Processor name : "+vga.vname;

        let user_responce = window.confirm(submit_confirmMg);

        if(user_responce){

            let post_serverice_responce;

            $.ajax("/vga",{
                async : false,
                type:"POST",//Method
                data:JSON.stringify(vga),//data that pass to backend
                contentType:"application/json",
                success:function(succsessResData,successStatus,resObj){
                    post_serverice_responce = succsessResData;
                },error:function (errorResOb,errorStatus,errorMsg){
                    console.log(errorMsg)
                    post_serverice_responce = errorMsg;
                }
            })
            if(post_serverice_responce == "0"){

                alert("Add ok")
                refreshTable();
                refreshForm();

            }else{

                alert("you have following error \n" + post_serverice_responce)
            }
        }
    }else {
        alert(error)
    }


};

const buttonUpdateMC = () =>{
    let user_responce = window.confirm("are you suer to update following VGA changes..\n");

    if(user_responce) {

        //server responce
        let update_serverice_responce;

        $.ajax("/vga", {
            async: false,
            type: "PUT",//Method
            data: JSON.stringify(vga),//data that pass to backend
            contentType: "application/json",
            success: function (succsessResData, successStatus, resObj) {
                update_serverice_responce = succsessResData;
            }, error: function (errorResOb, errorStatus, errorMsg) {
                update_serverice_responce = errorMsg;
            }
        })
        if (update_serverice_responce == "0") {

            alert("update ok")

            refreshTable();
            refreshForm();

        } else {

            alert("update not complete:" + update_serverice_responce)
        }
    }
};

