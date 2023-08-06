window.addEventListener("load", refreshBrowser);

function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Privilege")
    refreshTable();
    refreshForm()
};

const refreshTable = () =>{
    privilages = new Array();
    privilages = httpGetRequest("privilage/all")

    //create display property list
    let displayPropertyList = ["role_id.name","module_id.name","select_permission","insert_permission","update_permission","delete_permission"]

    //create display property data type
    let displayPropertyDataTypeList = ["object","object","text","text","text","text"]

    fillTable(tbl_privilage,privilages,displayPropertyList,displayPropertyDataTypeList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    //To add jquery table
    $('#tbl_privilage').dataTable();
}



const formReFill = (ob) =>{
    $.ajax('/privilage/getbyid?id='+ob.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            privilage = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            privilage = {};
        }
    })

    $.ajax('/privilage/getbyid?id='+ob.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            old_privilage = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            old_privilage = {};
        }
    })

    //fill select field
    fillSelectField(select_module,"",module,"name",privilage.module_id.name);
    fillSelectField(select_role,"",roles,"name",privilage.role_id.name);

    //checked radio button
    if(privilage.select_permission == true){
        rad_select_grant.checked=true
    }else {
        rad_select_notgrant.checked = true
    }

    if(privilage.insert_permission == true){
        rad_insert_grant.checked=true
    }else {
        rad_insert_notgrant.checked = true
    }

    if(privilage.update_permission == true){
        rad_update_grant.checked=true
    }else {
        rad_update_notgrant.checked = true
    }

    if(privilage.delete_permission == true){
        rad_delete_grant.checked=true
    }else {
        rad_delete_notgrant.checked = true
    }

    setStyle("1px solid green");



}

const rowView = () =>{

}

const rowDelete = (ob) =>{
    let dlt_msg ="Are you suer want to delete following privilage? \n"+"Role = "+ob.role_id.name + "\n"
        + "Module =" + ob.module_id.name;

    let responce = window.confirm(dlt_msg);

    if(responce){
        let delete_server_responce;

        $.ajax("/privilage",{
            async : false,
            type:"DELETE",//Method
            data:JSON.stringify(ob),//data that pass to backend
            contentType:"application/json",
            success:function(succsessResData,successStatus,resObj){
                delete_server_responce = succsessResData;
            },error:function (errorResOb,errorStatus,errorMsg){
                delete_server_responce = errorMsg;
            }
        })
        if(delete_server_responce == "0"){

            alert("Delete Successfully Complete")
            refreshTable();

        }else{

            window.alert("You have following error \n" + delete_server_responce )
        }
    }
}

const refreshForm = () =>{
    privilage = new Object();
    old_privilage = null;

    roles = new Array();
    roles = httpGetRequest("/role/all");

    module = new Array();
    module = httpGetRequest("/module/all");



    fillSelectField(select_module,"",module,"name","");
    fillSelectField(select_role,"",roles,"name","");

    //all field need to be empty after data add

    rad_select_grant.checked=false;
    rad_select_notgrant.checked=false;
    rad_insert_grant.checked=false;
    rad_insert_notgrant.checked=false;
    rad_update_grant.checked=false;
    rad_update_notgrant.checked=false;
    rad_delete_grant.checked=false;
    rad_delete_notgrant.checked=false;

    setStyle("1px solid #fff");
}

const setStyle = (style) =>{
    select_module.style.borderBottom=style;
    select_role.style.borderBottom=style;
    selectradio.style.borderBottom=style;

}

const checkErrors = () =>{
    let errors = "";

    if(privilage.role_id == null){
        errors=errors+"User Roll not selected \n";
        select_role.style.borderBottom = "1px solid red"
    };

    if(privilage.module_id == null){
        errors=errors+"User Module not selected \n";
        select_module.style.borderBottom = "1px solid red"
    }

    if(privilage.select_permission == null){
        errors=errors+"Select Permission not Set \n";
        selectradio.style.borderBottom = "1px solid red"
    }

    if(privilage.insert_permission == null){
        errors=errors+"Insert Permission not Set \n";
        insertradio.style.borderBottom = "1px solid red"
    }

    if(privilage.update_permission == null){
        errors=errors+"Update Permission not Set \n";
        updateradio.style.borderBottom = "1px solid red"
    }

    if(privilage.delete_permission == null){
        errors=errors+"Delete Permission not Set \n";
        deleteradio.style.borderBottom = "1px solid red"
    }

    return errors;
}

const buttonAddMC = () => {

    let error = checkErrors();
    if(error == ""){

        let submit_confirm = "Are you suer to add following privilage \n"+"User Role : "+privilage.role_id.name+"\n"+"User Module : "+privilage.module_id.name;
        let user_responce = window.confirm(submit_confirm);

        if(user_responce){

            let post_serverice_responce;

            $.ajax("/privilage",{
                async : false,
                type:"POST",//Method
                data:JSON.stringify(privilage),//data that pass to backend
                contentType:"application/json",
                success:function(succsessResData,successStatus,resObj){
                    post_serverice_responce = succsessResData;
                },error:function (errorResOb,errorStatus,errorMsg){
                    post_serverice_responce = errorMsg;
                }
            })
            if(post_serverice_responce == "0"){

                alert("Privilege Add Successfully Complete")
                refreshTable();
                refreshForm();

            }else{

                alert("you have following error \n" + post_serverice_responce )
            }
        }

    }else{
        alert("Privilege Add Not Complete You Have Following Error \n"+error)
    }
}

const buttonUpdateMC = () => {
    let errors = checkErrors();
    if(errors == ""){
        //user confirmation
        let user_responce = window.confirm("are you suer to update following Privilage changes..\n");

        if(user_responce) {

            //server responce
            let update_serverice_responce;

            $.ajax("/privilage", {
                async: false,
                type: "PUT",//Method
                data: JSON.stringify(privilage),//data that pass to backend
                contentType: "application/json",
                success: function (succsessResData, successStatus, resObj) {
                    update_serverice_responce = succsessResData;
                }, error: function (errorResOb, errorStatus, errorMsg) {
                    update_serverice_responce = errorMsg;
                }
            })
            if (update_serverice_responce == "0") {

                alert("Privilage Update Successfully Complete ")

                refreshTable();
                refreshForm();

            } else {

                alert("update not complete:" + update_serverice_responce)
            }
        }
    }else{
        alert("you have following errors \n" + errors);
    }
}



