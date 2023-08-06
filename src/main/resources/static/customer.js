//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Customer")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

}

//Define function to refresh Table
const refreshTable = () => {
    //console.log(loguserPrivilageForModule.insert_permission)
    //Array for store data
    customers = new Array();
    customers = httpGetRequest("customer/all")
    //create display property list
    let displayPropertyList = ['name','phone','email','customer_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text', 'text','text','object'];

    //calling fill data in to function
    fillTable(tbl_cus, customers, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in customers){
        if (customers[index].customer_status_id.name == "Removed"){
            tbl_cus.children[1].children[index].children[5].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_cus').dataTable();


}

const formReFill = (obj) =>{

    customers = httpGetRequest("/customer/getbyid/"+obj.id)
    old_customers = httpGetRequest("/customer/getbyid/"+obj.id)


    inputname.value = customers.name;
    inputemail.value = customers.email;
    input_mobile.value = customers.phone;

    if(customers.website != undefined){
        input_website.value = customers.website;
    }

    if(customers.agent_name != undefined){
        input_agename.value = customers.agent_name;
    }

    if(customers.agent_number != undefined){
        input_agemobile.value = customers.agent_number;
    }

    if(customers.agent_email != undefined){
        input_agemail.value = customers.agent_email;
    }

    fillSelectField(select_type,"",types,"name",customers.cusomer_type_id.name)

    toggleAdditionalFields();
    //disable type
    $('#select_type').css('pointer-events', 'none');
    setStyle("2px solid green");
    //setStyle("1px solid green");
    tabSwitch(cus_table,cus_form);
    disabledButton(false,true);
}
const toggleAdditionalFields = () => {
    let customerType = JSON.parse($('#select_type').val());
    console.log(customerType);

    if (customerType.name === 'Company') {
        // show the company fields
        $('#companyFields').show();
    } else {
        // hide the company fields
        $('#companyFields').hide();
    }
};

const rowDelete= (obj) => {

    let dlt_msg ="Are you sure you want to delete the following Customer...?"+"\n"+
        "Customer Code: " + obj.cus_code + "\n" +
        "Customer Name: " + obj.name;


    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Casing...?',
        message: "Customer Code: " + obj.cus_code + "<br>Customer Name: " + obj.name,
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

                $.ajax("/customer",{
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
                        title: 'Customer Deleted',
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

    printcus = new Object();
    printcus = httpGetRequest('/customer/getbyid/'+obj.id)



    td_type.innerHTML = printcus.cusomer_type_id.name;
    td_number.innerHTML = printcus.cus_code;
    td_name.innerHTML = printcus.name;
    td_phone.innerHTML = printcus.phone;
    td_mail.innerHTML = printcus.email;
    td_status.innerHTML = printcus.customer_status_id.name;
    td_adduser.innerHTML = printcus.adduser_id.user_name

    if (printcus.cusomer_type_id.id == 2) {
        $('.hideAgenet').show();
        td_agename.innerHTML = printcus.agent_name;
        td_agemail.innerHTML = printcus.agent_email;
        td_agenum.innerHTML = printcus.agent_number;
    } else {
        $('.hideAgenet').hide(); // Hide the rows if customer ID is not 1
    }
    $('#cusViewModel').modal('show')
}

const cusPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Customer Details</h2>"
        + cusPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const refreshForm = () => {


    // hide the company fields initially
    $('#companyFields').hide();

    // listen for change event on the customer type field
    $('#select_type').change(function() {
        input_agename.value = "";
        input_agemobile.value = "";
        input_agemail.value = "";
        input_website.value = "";
        input_agename.style.borderBottom = "2px solid #fff"
        input_agemobile.style.borderBottom = "2px solid #fff"
        input_agemail.style.borderBottom = "2px solid #fff"
        input_website.style.borderBottom = "2px solid #fff"
        customers.agent_name = null;
        customers.agent_email = null;
        customers.agent_number = null;
        customers.website = null;


        if(this.value && JSON.parse(this.value).name === 'Company') {
            // show the company fields
            $('#companyFields').show();

        } else {
            // hide the company fields
            $('#companyFields').hide();

        }
    });

    customers = new Object();
    old_customers = null

    types = httpGetRequest("/customertype/all")
    fillSelectField(select_type,"",types,"name","Person")
    customers.cusomer_type_id = JSON.parse(select_type.value);

    inputname.value="";
    inputemail.value="";
    input_mobile.value="";
    input_website.value="";
    input_agename.value="";
    input_agemobile.value="";
    input_agemail.value="";

    disabledButton(true,false);


    setStyle("1px solid #fff");

}

const setStyle = (style) =>{
    const customerType = JSON.parse($('#select_type').val());

    if (customerType.name === 'Company') {
        // apply style to company fields
        $('#inputname').css('border-bottom', style);
        $('#inputemail').css('border-bottom', style);
        $('#input_mobile').css('border-bottom', style);
        if (customers.website != undefined)
            $('#input_website').css('border-bottom', style);
        $('#input_agename').css('border-bottom', style);
        $('#input_agemobile').css('border-bottom', style);
        $('#input_agemail').css('border-bottom', style);
    } else {
        // apply style to person fields
        $('#inputname').css('border-bottom', style);
        $('#inputemail').css('border-bottom', style);
        $('#input_mobile').css('border-bottom', style);
    }
    /*inputname.style.borderBottom=style
    inputemail.style.borderBottom=style
    input_mobile.style.borderBottom=style
    input_website.style.borderBottom=style
    input_agename.style.borderBottom=style
    input_agemobile.style.borderBottom=style
    input_agemail.style.borderBottom=style*/
}

/*const checkErrors = () =>{
    let errors = "";

    if(customers.cusomer_type_id == null){
        errors = errors+"Customer Type Not Selected..<br>";
        select_type.style.borderBottom="1px solid red";
    }

    if(customers.name == null){
        errors = errors+"Customer Name Not Enter<br>";
        inputname.style.borderBottom="1px solid red";
    }

    if(customers.phone == null){
        errors = errors+"Customer Number Not Enter<br>";
        input_mobile.style.borderBottom="1px solid red";
    }

    if(customers.email == null){
        errors = errors+"Customer Email Not Enter<br>";
        inputemail.style.borderBottom="1px solid red";
    }

    if(customers.website == null){
        errors = errors+"Customer Website Not Enter<br>";
        input_website.style.borderBottom="1px solid red";
    }

    if(customers.agent_name == null){
        errors = errors+"Agent Name Not Enter<br>";
        input_agename.style.borderBottom="1px solid red";
    }

    if(customers.agent_number == null){
        errors = errors+"Agent Number Not Enter<br>";
        input_agemobile.style.borderBottom="1px solid red";
    }

    if(customers.agent_email == null){
        errors = errors+"Agent Email Not Enter<br>";
        input_agemail.style.borderBottom="1px solid red";
    }
    return errors;
}*/
const checkErrors = () => {
    let errors = "";
    const selectedType = select_type.options[select_type.selectedIndex].text;
    console.log(select_type.options[select_type.selectedIndex])

    if (selectedType === "Company") {
        if (customers.name == null) {
            errors = errors + "Valid customer Name Not Entered<br>";
            inputname.style.borderBottom = "1px solid red";
        }

        if (customers.phone == null) {
            errors = errors + "Valid customer Number Not Entered<br>";
            input_mobile.style.borderBottom = "1px solid red";
        }

        if (customers.email == null) {
            errors = errors + "Valid customer Email Not Entered<br>";
            inputemail.style.borderBottom = "1px solid red";
        }


        if (customers.agent_name == null) {
            errors = errors + "Agent Name Not Entered<br>";
            input_agename.style.borderBottom = "1px solid red";
        }

        if (customers.agent_number == null) {
            errors = errors + "Agent Number Not Entered<br>";
            input_agemobile.style.borderBottom = "1px solid red";
        }

        if (customers.agent_email == null) {
            errors = errors + "Agent Email Not Entered<br>";
            input_agemail.style.borderBottom = "1px solid red";
        }
    } else {
        if (customers.name == null) {
            errors = errors + "Valid customer Name Not Entered<br>";
            inputname.style.borderBottom = "1px solid red";
        }

        if (customers.phone == null) {
            errors = errors + "Valid customer Number Not Entered<br>";
            input_mobile.style.borderBottom = "1px solid red";
        }

        if (customers.email == null) {
            errors = errors + "Valid customer Email Not Entered<br>";
            inputemail.style.borderBottom = "1px solid red";
        }
    }

    return errors;
}


const buttonAddMC = () =>{
    let errors = checkErrors();
    if(errors == ""){
        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Customer..?",
            message: "Customer Name ="+customers.name,
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

                    $.ajax("/customer",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(customers),//data that pass to backend
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
                            title: 'Customer Add Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 2000,
                            closeOnClick: true,

                        });
                        refreshForm();
                        refreshTable();
                        tabSwitchForm(cus_table,cus_form)
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

const checkUpdate = () =>{
    let updates = "";
    const selectedType = select_type.options[select_type.selectedIndex].text;

    if (customers != null && old_customers != null) {
        if (selectedType === "Company") {
            if (customers.cusomer_type_id.name != old_customers.cusomer_type_id.name) {
                updates = updates + "Customer Type Has Changed..<br>"
            }

            if (customers.name != old_customers.name) {
                updates = updates + "Customer Name Has Changed..<br>"
            }

            if (customers.phone != old_customers.phone) {
                updates = updates + "Customer Phone Has Changed..<br>"
            }

            if (customers.email != old_customers.email) {
                updates = updates + "Customer email Has Changed..<br>"
            }

            if (customers.website != old_customers.website) {
                updates = updates + "Customer website Has Changed..<br>"
            }

            if (customers.agent_name != old_customers.agent_name) {
                updates = updates + "Customer agent_name Has Changed..<br>"
            }

            if (customers.agent_email != old_customers.agent_email) {
                updates = updates + "Customer agent_email Has Changed..<br>"
            }

            if (customers.agent_number != old_customers.agent_number) {
                updates = updates + "Customer agent_number Has Changed..<br>"
            }
        }else{
            if(customers.cusomer_type_id.name != old_customers.cusomer_type_id.name){
                updates = updates + "Customer Type Has Changed..<br>"
            }

            if (customers.name != old_customers.name) {
                updates = updates + "Customer Name Has Changed..<br>"
            }

            if (customers.phone != old_customers.phone) {
                updates = updates + "Customer Phone Has Changed..<br>"
            }

            if (customers.email != old_customers.email) {
                updates = updates + "Customer email Has Changed..<br>"
            }
        }
    }

    return updates;
}
const buttonUpdateMC = () =>{
    let errors = checkErrors();

    if (errors == ""){
        let updates = checkUpdate();
        if(updates != ""){
            //Show the confirmation box when the Update button is clicked
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

                        $.ajax("/customer",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(customers),//data that pass to backend
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
                                title: 'Customer Update Successfully',
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
                            tabSwitchForm(cus_table,cus_form)
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
        }else{
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
    refreshForm();
}