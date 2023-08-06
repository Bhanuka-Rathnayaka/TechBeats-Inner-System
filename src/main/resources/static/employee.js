//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Employee")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

}

//Define function to refresh Table
const refreshTable = () => {
    employees = new Array();
    employees = httpGetRequest("employee/all")
    //create display property list
    let displayPropertyList = ['fullname','nic','mobile','email','emp_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text','text','text','text','object'];

    //calling fill data in to function
    fillTable(tbl_emp, employees, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    //To add jquery table
    $('#tbl_emp').dataTable();


}

//refill when click edit button
const formReFill = (ob,rowno) => {

    employee = new Object();
    old_employee = new Object();

    $.ajax('/employee/getbyid/'+ob.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            employee = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            employee = {};
        }
    })

    $.ajax('/employee/getbyid/'+ob.id,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            old_employee = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            old_employee = {};
        }
    })

    //set value in to feild


    input_fullname.value = employee.fullname;
    input_nic.value = employee.nic;
    date.value = employee.dob;
    input_mobile.value = employee.mobile;
    txtaddress.value = employee.address

    if(employee.land != undefined){
        input_land.value = employee.land;
    }
    inputemail.value = employee.email;

    input_callname.value =employee.callingname;

    if(employee.gender == "male"){
        radio_male.checked=true
    }else {
        radio_female.checked = true
    }

    if(employee.description != undefined){
        txtdiscription.value = employee.description;
    }

    fillSelectField(select_designation,"",designation,"name",employee.designation_id.name);
    fillSelectField(select_civilstatus,"",civil_status,"name",employee.civil_status_id.name);
    fillSelectField(select_workingstatuses,"",emp_status,"name",employee.emp_status_id.name);

    setStyle("1px solid green");

    // tab_btn_tbl.classList.remove("active");
    // tab_btn_tbl.setAttribute("tab-btn-tbl","false")
    //
    // tab_btn_form.setAttribute("tab-btn-tbl","true")
    // tab_btn_form.classList.add("active");
    //
    // emp_table.classList.remove("active")
    // emp_table.classList.remove("show")
    // emp_form.classList.add("active")
    // emp_form.classList.add("show")

    tabSwitch(emp_table,emp_form);

    disabledButton(false,true);


}

//delete function
const rowDelete= (ob) => {

    let dlt_msg ="Are you suer want to delete following employee? \n"+"employee number = "+ob.number + "\n"
        + "employee name =" + ob.callingname;
    let response = window.confirm(dlt_msg);

    if(response){

        let delete_server_responce;

        $.ajax("/employee",{
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

            window.alert("you have follwing error \n" + delete_server_responce )
        }


    };



}


//view function
const rowView = (obj) =>{

    printemp = new Object();
    printemp = httpGetRequest('/employee/getbyid/'+obj.id)



    td_number.innerHTML = printemp.number;
    td_fname.innerHTML = printemp.fullname;
    td_cname.innerHTML = printemp.callingname;
    td_address.innerHTML = printemp.address;
    td_photo.innerHTML = printemp.photo;
    td_status.innerHTML = printemp.emp_status_id.name;
    $('#empViewModel').modal('show')
}

const empPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Employee Details</h2>"
        + empPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

//fill data to form and aftert refresh table, this set element in to default state
function refreshForm(){
    employee = new Object;
    old_employee = null;

    //create array for fill designation,status and civilstatus select element
    designation = new Array();
    designation = httpGetRequest('/designation/all');

    emp_status = new Array();
    emp_status = httpGetRequest("/empstatus/all")



    //create array for get civil status
    civil_status = new Array();
    civil_status = httpGetRequest("/civilstatus/all");

    //fill data from above array to 3 select feild in form

    fillSelectField(select_designation,"",designation,"name","");

    fillSelectField(select_civilstatus,"",civil_status,"name","");

    fillSelectField(select_workingstatuses,"",emp_status,"name","Working");

    employee.emp_status_id = JSON.parse(select_workingstatuses.value)

    assigndate.value = getDateFormat("date","");

    //all field need to be empty after data add
    input_fullname.value = "";
    input_callname.value = "";
    input_nic.value = "";
    date.value = "";
    radio_male.value = "";
    lable_male.style.color = "white";
    lable_female.style.color = "white";
    radio_female.value = "";
    input_mobile.value = "";
    input_land.value = "";
    inputemail.value = "";
    txtaddress.value = "";
    txtdiscription.value = "";




    //set all element in to default style
    setStyle("1px solid #fff");

    //set valid color in to selected feild
    select_workingstatuses.style.borderBottom = "1px solid green";
    assigndate.style.borderBottom = "1px solid green";


    disabledButton(true,false);

}




//after add button click set feild style to default
function setStyle (style)  {
    input_fullname.style.borderBottom = style;
    input_nic.style.borderBottom = style;
    input_mobile.style.borderBottom= style;
    inputemail.style.borderBottom = style;
    input_callname.style.borderBottom = style;
    txtaddress.style.borderBottom = style;
    date.style.borderBottom = style;
    select_designation.style.borderBottom=style;
    select_civilstatus.style.borderBottom=style;

    if(employee.land != undefined){
        input_land.style.borderBottom = style;
    }

    if(employee.discription != undefined){
        txtdiscription.style.borderBottom = style;
    }

}


//validate nic feild and genarate sex and dob
function nicFieldValidator(){
    let nic_pattern = new RegExp('^(([0-9]{9}[V|v|X|x])|([0-9]{12}))$')

    if(input_nic.value != ""){
        if(nic_pattern.test(input_nic.value)){

            if(input_nic.value.length == 10){
                empnic="19"+input_nic.value.substring(0,5)+"0"+input_nic.value.substring(5,9);


            }else{
                empnic = input_nic.value
            }

            let empBirtyear = empnic.substring(0,4);
            let empBirthday = empnic.substring(4,7);

            if(empBirthday < 500){
                radio_male.checked = true
                employee.gender = "Male";
            }else{
                radio_female.checked=true;
                employee.gender = "Female";
                empBirthday = empBirthday - 500;

            }

            let empdob = new Date(empBirtyear)

            if(parseInt(empBirtyear) % 4 == 0){
                empdob.setDate(empdob.getDate()-1 + parseInt(empBirthday))
            }else{
                empdob.setDate(empdob.getDate()-2 + parseInt(empBirthday))
            }


            date.value = getDateFormat("date",empdob);

            //update part
            employee.nic = input_nic.value
            employee.dob = date.value;

            if(old_employee != null && employee.nic != old_employee.nic){
                input_nic.style.borderBottom = "1px solid orange";
                date.style.borderBottom = "1px solid orange";
            }else{
                input_nic.style.borderBottom = "1px solid green";
                date.style.borderBottom = "1px solid green";

            }



        }else{
            employee.nic = null;
            input_nic.style.borderBottom = "1px solid red";
        }
    }else{
        employee.nic = null;
        input_nic.style.borderBottom = "1px solid red";

    }
}


//function for check errors
function checkError(){
    let errors = "";

    if (employee.fullname == null) {

        input_fullname.style.borderBottom = '2px solid red';
        errors = errors + "Full Name not Entered...  \n";
    } else {

    }

    if (employee.callingname == null) {

        input_callname.style.borderBottom = '2px solid red';
        errors = errors + "Calling Name not Entered...  \n";
    } else {

    }

    if (employee.nic == null) {

        input_nic.style.borderBottom = '2px solid red';
        errors = errors + "NIC not Entered...  \n";
    } else {

    }

    if (employee.gender == null) {

        lable_male.style.color="red";
        lable_female.style.color="red";
        errors = errors + "Gender not Entered...  \n";
    } else {

    }

    if (employee.dob == null) {

        date.style.borderBottom = '2px solid red';
        errors = errors + "DOB not Entered...  \n";
    } else {

    }



    if (employee.mobile == null) {

        input_mobile.style.borderBottom = '2px solid red';
        errors = errors + "Mobile not Entered...  \n";
    } else {

    }

    if (employee.email == null) {

        inputemail.style.borderBottom = '2px solid red';
        errors = errors + "Email not Entered...  \n";
    } else {

    }

    if (employee.address == null) {

        txtaddress.style.borderBottom = '2px solid red';
        errors = errors + "address not Entered...  \n";
    } else {

    }




    if (employee.civil_status_id == null) {

        select_civilstatus.style.borderBottom = '2px solid red';
        errors = errors + "Civil Status not Selected...  \n";
    } else {

    }

    if (employee.designation_id == null) {

        select_designation.style.borderBottom = '2px solid red';
        errors = errors + "Designation not Selected...  \n";
    } else {

    }

    if (employee.emp_status_id == null) {

        select_workingstatuses.style.borderBottom = '2px solid red';
        errors = errors + "Emp status not Selected...  \n";
    } else {

    }

    return errors;
}


function buttonAddMC(){


    //need to check if there is error
    let errors = checkError();

    if(errors == ""){
        //user confirmation
        let submit_confirmMg = "are you suer to add following employee\n";
        let user_responce = window.confirm(submit_confirmMg);

        if(user_responce){

            let post_serverice_responce;

            $.ajax("/employee",{
                async : false,
                type:"POST",//Method
                data:JSON.stringify(employee),//data that pass to backend
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
        alert("you have following errors in form \n" + errors);
    }
}

function checkUpdate(){
    let updates = "";

    if(employee != null && old_employee!= null){
        if(employee.fullname != old_employee.fullname){
            updates = updates + "employee full name is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.callingname != old_employee.callingname){
            updates = updates + "employee calling name is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.nic != old_employee.nic){
            updates = updates + "employee nic is changed..\n";
        }
    }
    if(employee != null && old_employee!= null){
        if(employee.dob != old_employee.dob){
            updates = updates + "employee dob is changed..\n";
        }
    }
    if(employee != null && old_employee!= null){
        if(employee.gender != old_employee.gender){
            updates = updates + "employee gender is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.mobile != old_employee.mobile){
            updates = updates + "employee mobile is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.land != old_employee.land){
            updates = updates + "employee land is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.description != old_employee.description){
            updates = updates + "employee description is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.address != old_employee.address){
            updates = updates + "employee address is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.email != old_employee.email){
            updates = updates + "employee email is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.photo != old_employee.photo){
            updates = updates + "employee photo is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.civil_status_id.name != old_employee.civil_status_id.name){
            updates = updates + "employee civil status is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.designation_id.name != old_employee.designation_id.name){
            updates = updates + "employee Designation is changed..\n";
        }
    }

    if(employee != null && old_employee!= null){
        if(employee.emp_status_id.name != old_employee.emp_status_id.name){
            updates = updates + "employee Employee Status is changed..\n";
        }
    }





    return updates;
}

function buttonUpdateMC(){
    //need to check if there is error
    let errors = checkError();

    if(errors == ""){

        //check updates
        let updates = checkUpdate();
        if(updates != ""){

            //user confirmation
            let user_responce = window.confirm("are you suer to update following employee changes..\n"+updates);

            if(user_responce) {

                //server responce
                let update_serverice_responce;

                $.ajax("/employee", {
                    async: false,
                    type: "PUT",//Method
                    data: JSON.stringify(employee),//data that pass to backend
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
        }else {
            alert("nothing to update");
        }
    }else {
        alert("you have following errors in form \n" + errors);
    }
}
