//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {


    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Supplier Payment")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

    select_sup.addEventListener('change',event =>{
        txt_totalarease.value = parseFloat(JSON.parse(select_sup.value).balance).toFixed(2);
        txt_totalarease.style.borderBottom = "2px solid green";

        grnList = httpGetRequest("grn/listbysupplir/"+JSON.parse(select_sup.value).id);
        fillSelectField(select_grn,"",grnList,"code","")

    })

    select_grn.addEventListener('change',event=>{
        txt_total.value = parseFloat(JSON.parse(select_grn.value).finalamaount).toFixed(2);
        supPayment.grnamount = txt_total.value;
        txt_total.style.borderBottom = "2px solid green";

        txt_penbalance.value = parseFloat(JSON.parse(select_grn.value).balanceforgrn).toFixed(2);
        supPayment.balance = txt_penbalance.value;
        txt_penbalance.style.borderBottom = "2px solid green";


        /*if (supPayment.paidamount !=null){
            txt_penbalance.value = supPayment.balance;
            /!*supPayment.balance = txt_penbalance.value;*!/
            txt_penbalance.style.borderBottom = "2px solid green"

        }else {
            txt_penbalance.value = supPayment.grnamount;
            supPayment.balance = txt_penbalance.value;
            txt_penbalance.style.borderBottom = "2px solid green"

        }*/
        txt_paid.value = "";
        supPayment.paidamount=null;
        txt_paid.style.borderBottom = "2px solid #fff";

        txt_balance.value = "";
        txt_balance.style.borderBottom = "2px solid #fff"




    })

}

const refreshTable = () =>{

    supPayments = new Array();
    supPayments = httpGetRequest("supplierpayment/all")

    let displayPropertyList = ['supplier_id.name','grn_id.code','grnamount','balance'];

    //create display property type list
    let displayPropertyDataList = ['object','object','decimal','decimal'];

    //calling fill data in to function
    fillTable(tbl_suppayment,supPayments, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    //hide delete and edit button

    /* for (let index in invoices){

         if(invoices[index].invoice_status_id.name == "Complete"){
             tbl_invoice.children[1].children[index].children[9].children[0].style.display="none";
             tbl_invoice.children[1].children[index].children[9].children[2].style.display="none";
         }

         if(invoices[index].invoice_status_id.name == "Payement Pending"){
             tbl_invoice.children[1].children[index].children[9].children[0].style.display="none";
             tbl_invoice.children[1].children[index].children[9].children[2].innerHTML = "";
             tbl_invoice.children[1].children[index].children[9].children[2].innerHTML = "Add Payment";
         }

     }*/

    //To add jquery table
    $('#tbl_suppayment').dataTable();
}

const formReFill = () =>{

}

const rowDelete = () =>{

}

const rowView = () =>{

}

const refreshForm = () =>{
    supPayment = new Object();
    old_supPayment = null;

    suppliers = httpGetRequest("supplier/all");
    fillSelectField(select_sup,"",suppliers,"name","");

    payTypes = httpGetRequest("paymentmethod/all")
    fillSelectField(select_type,"",payTypes,"name","Cash")
    supPayment.payment_method_id = JSON.parse(select_type.value);

    //hide option according to method
    $('.hidecheque').hide();
    $('.hideonline').hide();

    //disable field
    $('#txt_totalarease').css('pointer-events', 'none');
    $('#txt_total').css('pointer-events', 'none');
    $('#txt_penbalance').css('pointer-events', 'none');
    $('#txt_balance').css('pointer-events', 'none');

    txt_paid.value="";
    txt_balance.value="";
    select_sup.value="";
    txt_totalarease.value="";
    select_grn.value="";
    txt_total.value="";
    txt_penbalance.value="";

    txt_paid.style.borderBottom = "1px solid #fff";
    txt_balance.style.borderBottom = "1px solid #fff";
    select_sup.style.borderBottom = "1px solid #fff";
    txt_totalarease.style.borderBottom = "1px solid #fff";
    select_grn.style.borderBottom = "1px solid #fff";
    txt_total.style.borderBottom = "1px solid #fff";
    txt_penbalance.style.borderBottom = "1px solid #fff";


}

const getBalance = () =>{

    if (txt_paid.value == ""){
        txt_balance.value ="";
        txt_balance.style.borderBottom = "2px solid #fff"
    }else {
        txt_balance.value = parseFloat(supPayment.balance - supPayment.paidamount).toFixed(2);
        txt_balance.style.borderBottom = "2px solid green"
    }

}

const hideOption = () =>{

    if (JSON.parse(select_type.value).name == "Cheque"){

        $('.hideonline').hide();
        $('.hidecheque').show();
    }

    if (JSON.parse(select_type.value).name == "Online Transfer"){
        $('.hidecheque').hide();
        $('.hideonline').show();
    }

    if (JSON.parse(select_type.value).name == "Cash" || JSON.parse(select_type.value).name == "Card"){
        $('.hidecheque').hide();
        $('.hideonline').hide();
    }
}


const checkErrors = () =>{
    let errors = "";

    if (supPayment.supplier_id == null){
        errors = errors+"Supplier Not Selected..<br>";
        select_sup.style.borderBottom="2px solid red";
    }

    if (supPayment.grn_id == null){
        errors = errors+"GRN Not Selected..<br>";
        select_grn.style.borderBottom="2px solid red";
    }

    if (supPayment.paidamount == null){
        errors = errors+"Valid Paid Amount Not Enter..<br>";
        txt_paid.style.borderBottom="2px solid red";
    }


    if (JSON.parse(select_type.value).name == "Cheque"){
        if (supPayment.chequeno == null){
            errors = errors+"Valid Cheque No Not Enter..<br>";
            txt_chequeno.style.borderBottom="2px solid red";
        }

        if (supPayment.chequedate == null){
            errors = errors+"Valid Cheque Date Not Enter..<br>";
            chequedate.style.borderBottom="2px solid red";
        }
    }

    if (JSON.parse(select_type.value).name == "Online Transfer"){
        if (supPayment.transfer_no == null){
            errors = errors+"Valid Online Transfer No Not Enter..<br>";
            txt_transferno.style.borderBottom="2px solid red";
        }

        if (supPayment.transferdatetime == null){
            errors = errors+"Valid Online Traansfer Date Not Enter..<br>";
            onlinedate.style.borderBottom="2px solid red";
        }
    }

    return errors;
}

const buttonAddMc = () =>{
    console.log(supPayment);

    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Supplier Payment..?",
            message: "Supplier: " + supPayment.supplier_id.name + "<br>GRN " + supPayment.grn_id.code,
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

                    $.ajax("/supplierpayment",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(supPayment),//data that pass to backend
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
                            title: 'Payment Add Successfully',
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

                        //tabSwitchForm(grn_table,grn_form)
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

