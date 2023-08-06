window.addEventListener("load", refreshBrowser);



function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=User")
    refreshTable();
    refreshForm()
}

const refreshTable = () =>{
    console.log(loguserPrivilageForModule)
    users = new Array();
    users = httpGetRequest("/user/all")

    let displayPropertyList = ["employee_id.callingname","user_name","rolles","email","status"];

    let displayPropertyDataTypeList = [getempcodename,"text",getUserRoles,"text",getUserStatus];

    fillTable(tbl_user,users,displayPropertyList,displayPropertyDataTypeList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    for (let index in users){
        if (users[index].status == false){
            tbl_user.children[1].children[index].children[6].children[2].disabled = true;
        }
    }
}

//refil function when edit button clicked
const formReFill = (ob) =>{
    user = JSON.parse(JSON.stringify(ob));
    old_user =JSON.parse(JSON.stringify(ob));

    user.roles = httpGetRequest("/role/byuserid/"+user.id)
    old_user.roles = httpGetRequest("/role/byuserid/"+user.id)

    emp_without_user_account.push(user.employee_id);

    fillSelectFieldtwoproperty(select_emp,"",emp_without_user_account,"number","callingname",user.employee_id.number)

    //clear all field after refresh form
    txt_uname.value=user.user_name;
    txt_password.disabled=true;
    txt_repassword.disabled=true;
    txt_mail.value=user.email;

    if (user.status){
    Checkstatus.checked=true;
    txtstatus.innerText="User Account -> Active";
    }else{
        Checkstatus.checked=false;
        txtstatus.innerText="User Account -> In-Active";
    }


    rolelist.innerHTML="";

    for(let index in user_roll_list){
        div_role = document.createElement("div");
        div_role.classList.add("form-check");
        input_checkbox= document.createElement("input");
        input_checkbox.type="checkbox";
        input_checkbox.value = index;
        input_checkbox.classList.add("form-check-input");

        input_checkbox.onchange = function() {
            //checked
            if(this.checked){

                user.roles.push(user_roll_list[this.value])
            //unchecked
            }else{
                for (let index in user.userRoles){
                    if (user.roles[index]["name"]==user_roll_list[this.value]["name"]){
                        user.roles.splice(index,1)
                    }

                }

            }
        }

        if(user.roles.length != 0){
            let extindex = user.roles.map(e => e.name).indexOf(user_roll_list[index]['name']);

            if(extindex != -1){
                input_checkbox.checked = true
            }
            console.log(extindex);
        }

        lable = document.createElement("lable");
        lable.classList.add("form-check-label");
        lable.innerHTML = user_roll_list[index]['name'];


        div_role.appendChild(input_checkbox);
        div_role.appendChild(lable);
        rolelist.appendChild(div_role);
    }

    setStyle("1px solid green");
    txt_password.style.borderBottom="1px solid #fff";
    txt_repassword.style.borderBottom="1px solid #fff";

    disabledButton(false,true)

}

const rowDelete = (ob) =>{
    let dlt_msg ="Are you suer want to delete following User? \n"+"User name = "+ob.user_name;
    let response = window.confirm(dlt_msg);

    if(response){

        let delete_server_responce;

        $.ajax("/user",{
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

            alert("delete ok")
            refreshTable();

        }else{

            window.alert("you have following error \n" + delete_server_responce )
        }


    };
}

const rowView = () =>{

}

const getUserStatus = (ob) =>{
    let user_status="In-Active";
    if(ob.status){
        user_status = "Active";

    }
    return user_status;
}

const getempcodename = (ob) =>{
    return ob.employee_id.number+"--"+ob.employee_id.callingname;
}

//show user's roles  in table
const getUserRoles = (ob) =>{
    let userRoleList = httpGetRequest("/role/byuserid/"+ob.id);
    let userRoles = "";
    for(let index in userRoleList){
        if (userRoleList.length-1 == index)
            userRoles = userRoles + userRoleList[index].name;
        else
            userRoles = userRoles + userRoleList[index].name + ",";
    }
    return userRoles;
}

const refreshForm = () =>{
    user = new Object();
    old_user = null;

    user.roles = new Array();

    emp_without_user_account = new Array();
    emp_without_user_account = httpGetRequest("/employee/listbywithoutuseraccount");

    fillSelectFieldtwoproperty(select_emp,"",emp_without_user_account,"number","callingname")

    //clear all field after refresh form
    txt_uname.value="";
    txt_password.value="";
    txt_repassword.value="";
    txt_mail.value="";

    txt_uname.style.borderBottom = "2px solid #fff";
    txt_password.style.borderBottom = "2px solid #fff";
    txt_repassword.style.borderBottom = "2px solid #fff";
    txt_mail.style.borderBottom = "2px solid #fff";

    //need to re-enable password and retype password field after refile field update
    txt_password.disabled=false;
    txt_repassword.disabled=false;

    Checkstatus.checked=true;
    user.status=true;

    //binding roles checkbox to form

    user_roll_list = httpGetRequest("/role/all");
    rolelist.innerHTML="";

    for(let index in user_roll_list){
        div_role = document.createElement("div");
        div_role.classList.add("form-check");
        input_checkbox= document.createElement("input");
        input_checkbox.type="checkbox";
        input_checkbox.value = index;
        input_checkbox.classList.add("form-check-input");

        input_checkbox.onchange = function() {
            if(this.checked){
                //console.log("checkedd");
                // console.log(this.value);
                user.roles.push(user_roll_list[this.value])

            }else{
                for (let index in user.userRoles){
                    if (user.roles[index]["name"]==user_roll_list[this.value]["name"]){
                        uuser.roles.splice(index,1)
                    }

                }
            }
        }

        // if(user.roles.length != 0){
        //     let extindex = user.roles.map(e => e.roles).indexof(user_roll_list[index]['name']);
        //
        //     console.log(extindex);
        // }

        lable = document.createElement("lable");
        lable.classList.add("form-check-label");
        lable.innerHTML = user_roll_list[index]['name'];


        div_role.appendChild(input_checkbox);
        div_role.appendChild(lable);
        rolelist.appendChild(div_role);
    }

    disabledButton(true,false);


    setStyle("1px solid #fff");
}

const getEmployeeEmail = () =>{
    txt_mail.value = JSON.parse(select_emp.value).email;
    user.email = txt_mail.value;
    txt_mail.style.borderBottom = "1px solid green";
}

const setStyle = (style)=>{
    txt_uname.style.borderBottom=style;
    select_emp.style.borderBottom=style;
    txt_password.style.borderBottom=style;
    txt_repassword.style.borderBottom=style;
    txt_mail.style.borderBottom=style;

}

const checkError = () =>{
    let error = "";

    if (user.user_name == null){error=error+"user name not enter \n"}
    if (user.employee_id == null){error=error+"employee not selected \n"}

    //only check error in password fields are enable(in refill old_user != null)
    if(old_user == null){
        if (user.password == null){error=error+"password not enter \n"}
        if (txt_repassword.value == ""){error=error+"re-type password not enter \n"}
        if (txt_repassword.value != user.password){error=error+"password not match \n"}
    }

    if (user.email == null){error=error+"email not enter"}
    if (user.status == null){error=error+"status not \n"}
    if (user.roles.length == 0){error=error+"User roll not selected \n"}

    return error;
}

const retypePassword = () =>{
    if(txt_password.value == txt_repassword.value){
        txt_repassword.style.borderBottom ="1px solid green"
    }else{
        txt_repassword.style.borderBottom = "1px solid red"
    }
}

const buttonAddMC = () =>{
    console.log(user);
    let errors = checkError();
    if(errors == ""){
        let user_confirm = window.confirm("Are you suer to add following user \n"+
                                           "User Name:"+user.user_name)

        if(user_confirm){

            let post_serverice_responce;

            $.ajax("/user",{
                async : false,
                type:"POST",//Method
                data:JSON.stringify(user),//data that pass to backend
                contentType:"application/json",
                success:function(succsessResData,successStatus,resObj){
                    post_serverice_responce = succsessResData;
                },error:function (errorResOb,errorStatus,errorMsg){
                    post_serverice_responce = errorMsg;
                }
            })
            if(post_serverice_responce == "0"){

                alert("Add ok")
                refreshTable();
                refreshForm();

            }else{

                alert("you have following error \n" + post_serverice_responce )
            }
        }
    }else {
        alert("you have following errors \n" + errors);
    }

}

const checkUpdates = () =>{
    let updates = "";
    if(user != null && old_user != null){
        if(user.user_name != old_user.user_name){
            updates=updates+"User name has changed \n"
        }

        if(user.employee_id.number != old_user.employee_id.number){
            updates=updates+"Employee has changed \n"
        }

        if(user.email != old_user.email){
            updates=updates+"Email has changed \n"
        }

        if(user.status != old_user.status){
            updates=updates+"User status has changed \n"
        }

        if(user.roles.length != old_user.roles.length){// in here not complete
            updates=updates+"User roll has changed \n"
        }
    }
    return updates;
}

const buttonUpdateMC = () =>{

    let errors = checkError();
    if(errors == ""){
        let updates = checkUpdates();
        if(updates !=""){
            let user_confirm = window.confirm("Are you suer to update following changes.. \n"+updates)
            if(user_confirm){
                let post_serverice_responce;

                $.ajax("/user",{
                    async : false,
                    type:"PUT",//Method
                    data:JSON.stringify(user),//data that pass to backend
                    contentType:"application/json",
                    success:function(succsessResData,successStatus,resObj){
                        post_serverice_responce = succsessResData;
                    },error:function (errorResOb,errorStatus,errorMsg){
                        post_serverice_responce = errorMsg;
                    }
                })
                if(post_serverice_responce == "0"){

                    alert("Update ok")
                    refreshTable();
                    refreshForm();

                }else{

                    alert("you have following error \n" + post_serverice_responce )
                }
            }
        }else{
            alert("Nothing to Update")
        }
    }else{
        alert("you have following errors \n" + errors);
    }
}
