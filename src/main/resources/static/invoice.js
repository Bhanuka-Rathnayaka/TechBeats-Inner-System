//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {


    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Invoice")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

}

//Define function to refresh Table
const refreshTable = () =>{

    invoices = new Array();
    invoices = httpGetRequest("invoice/all")

    let displayPropertyList = ['invoicenumber','customer_id.name','lastprice','date','invoice_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text',getCustomerName,'decimal','text','object'];

    //calling fill data in to function
    fillTable(tbl_invoice,invoices, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    //hide delete and edit button
    for (let index in invoices){

        if(invoices[index].invoice_status_id.name == "Complete"){
            tbl_invoice.children[1].children[index].children[6].children[0].style.display="none";
            tbl_invoice.children[1].children[index].children[6].children[2].style.display="none";
        }

        if(invoices[index].invoice_status_id.name == "Payement Pending"){
            tbl_invoice.children[1].children[index].children[6].children[0].style.display="none";
            tbl_invoice.children[1].children[index].children[6].children[2].innerHTML = "";
            tbl_invoice.children[1].children[index].children[6].children[2].innerHTML = "Add Payment";
        }

        if(invoices[index].invoice_status_id.name == "Order Cancel"){
            tbl_invoice.children[1].children[index].children[6].children[0].style.display="none";
            tbl_invoice.children[1].children[index].children[6].children[2].style.display="none";
        }

    }

    //To add jquery table
    $('#tbl_invoice').dataTable();
}

const getItemName = (obj) =>{
    //console.log(obj)
    let orderItem = "";
    for (let index in obj.invoiceItemList){
        if (obj.invoiceItemList.length-1 == index)
        orderItem = orderItem + obj.invoiceItemList[index].itemname;
        else orderItem = orderItem + obj.invoiceItemList[index].itemname + ",";
    }
    return orderItem
}

const getCustomerName = (obj) =>{
    if (obj.customer_id == null ){
        return obj.cus_name;
    }else {
        return obj.customer_id.name;
    }
}

const formReFill = () =>{

}

//invoice payment
const rowDelete = (obj) =>{

    invoicecPayment = new Object();
    invoicecPayment = httpGetRequest("/invoice/getbyid/"+obj.id)


    //bind value related to current obj
    txt_cusorder.value = obj.customerorder_id.code;
    txt_cusorder.style.borderBottom = "2px solid green";
    txt_invoicecode.value = obj.invoicenumber;
    txt_invoicecode.style.borderBottom = "2px solid green";
    txt_total1.value = parseFloat(obj.lastprice).toFixed(2);
    txt_total1.style.borderBottom = "2px solid green";

    fillSelectField(select_payment1,"",payments,"name","Cash");
    invoiceItem.payment_method_id=JSON.parse(select_payment1.value);//Auto select value set



    $('#invoicePaymentModel').modal('show')
}

const refreshPayment = () =>{
    txt_paid1.value = "";
    txt_balance1.value = "";
    invoicecPayment.paidamount = null;
    invoicecPayment.balance = null;
    txt_paid1.style.borderBottom = "1px solid #fff";
    txt_balance1.style.borderBottom = "1px solid #fff";

}

const getPaidAmountFromCard1 = ()=>{


    if (invoicecPayment.lastprice != null){
        let paymentMethod = JSON.parse(select_payment1.value).name;

        if (paymentMethod == "Card"){

            txt_paid1.value = parseFloat(invoicecPayment.lastprice).toFixed(2);
            invoicecPayment.paidamount = txt_paid1.value;
            let netAmount = parseFloat(invoicecPayment.lastprice);
            let paidAmount = parseFloat(txt_paid1.value);
            txt_balance1.value = (paidAmount-netAmount).toFixed(2)
            invoicecPayment.balance = txt_balance1.value;
            txt_paid1.style.borderBottom = "2px solid green";
            txt_balance1.style.borderBottom = "2px solid green";



        }else if(paymentMethod == "Cash"){
            txt_paid1.value = "";
            txt_balance1.value = "";
            txt_paid1.style.borderBottom = "1px solid #fff";
            txt_balance1.style.borderBottom = "1px solid #fff";

        }
    }

}

const getbalanceAmount1 = ()=>{
    let netAmount = parseFloat(invoicecPayment.lastprice);
    let paidAmount = parseFloat(txt_paid1.value);


    if (paidAmount >= netAmount){
        invoicecPayment.paidamount = txt_paid1.value;
        txt_balance1.value = (paidAmount-netAmount).toFixed(2)
        invoicecPayment.balance = txt_balance1.value;
        txt_paid1.style.borderBottom = "2px solid green";
        txt_balance1.style.borderBottom = "2px solid green";
    }else{
        txt_paid1.style.borderBottom = "2px solid red";
        txt_balance1.value = "";
        invoicecPayment.balance = null;
        txt_balance1.style.borderBottom = "2px solid #fff";
    }
}

const paymentPrintModel = () =>{
    console.log(invoicecPayment);
    console.log("////")
    console.log(invoice);
}

const checkUpdatePaymentError = () =>{



}

const updateInvoicePayment = () =>{
    console.log(invoicecPayment)
    let paymentError = "";
    if(invoicecPayment.paidamount == null){
        paymentError = paymentError+"Please enter Paid Amount..<br>";
        txt_paid1.style.borderBottom="2px solid red";
    }

    if (paymentError == ""){
        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Payment..?",
            message: "invoice Number ="+invoicecPayment.invoicenumber,
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

                    $.ajax("/invoice",{
                        async : false,
                        type:"PUT",//Method
                        data:JSON.stringify(invoicecPayment),//data that pass to backend
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
                            timeout: 1000,
                            closeOnClick: true,

                        });
                        $('#invoicePaymentModel').modal('hide');
                        refreshTable();



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
            message: paymentError,
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

//invoice print
const rowView = (obj) =>{

    printInvoice = new Object();
    printInvoice = httpGetRequest("/invoice/getbyid/"+obj.id)

    if (printInvoice.customerorder_id != null){
        txtCustomerNameView.value = printInvoice.customer_id.name;
        txtMobileView.value = printInvoice.customer_id.phone;
    }else {
        txtCustomerNameView.value = printInvoice.cus_name;
        txtMobileView.value = printInvoice.cus_mobile;
    }


    dteDOAssignmentView.value = printInvoice.date;
    txtInvoiceCodeView.value = printInvoice.invoicenumber;
    txtPaymentTypeView.value = printInvoice.payment_method_id.name;
    txtGrandTotalView.value = parseFloat(printInvoice.totalamount).toFixed(2);
    txtDiscountView.value = parseFloat(printInvoice.discountrate).toFixed(2);
    txtLastPriceView.value = parseFloat(printInvoice.lastprice).toFixed(2);

    if (printInvoice.paidamount != null){
        txtPaidAmountView.value = parseFloat(printInvoice.paidamount).toFixed(2);
        txtBalanceView.value = parseFloat(printInvoice.balance).toFixed(2);

    }else {
        txtPaidAmountView.value = "";
        txtBalanceView.value = "";
    }



    txtAssignByView.value = printInvoice.adduser_id.user_name;

    //view inner table
    let displayPropertyList = ['item_category_id.name','itemname','itemprice','serialnumber.serialno','warrenty'];
    let displayPropertyDataList = ['object','text','decimal','object','text'];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(tblInnerView,printInvoice.invoiceItemList, displayPropertyList, displayPropertyDataList,tt1,tt2,tt3,false,inerLoguserPrivilageForModule);





    $('#myModal').modal('show')
}

const rowViewAfterInvoiceAdd = (code) =>{

    printInvoice = new Object();
    printInvoice = httpGetRequest("/invoice/getbyInvoicenumber/"+code)

    if (printInvoice.customerorder_id != null){
        txtCustomerNameView.value = printInvoice.customer_id.name;
        txtMobileView.value = printInvoice.customer_id.phone;
    }else {
        txtCustomerNameView.value = printInvoice.cus_name;
        txtMobileView.value = printInvoice.cus_mobile;
    }


    dteDOAssignmentView.value = printInvoice.date;
    txtInvoiceCodeView.value = printInvoice.invoicenumber;
    txtPaymentTypeView.value = printInvoice.payment_method_id.name;
    txtGrandTotalView.value = parseFloat(printInvoice.totalamount).toFixed(2);
    txtDiscountView.value = parseFloat(printInvoice.discountrate).toFixed(2);
    txtLastPriceView.value = parseFloat(printInvoice.lastprice).toFixed(2);

    if (printInvoice.paidamount != null){
        txtPaidAmountView.value = parseFloat(printInvoice.paidamount).toFixed(2);
        txtBalanceView.value = parseFloat(printInvoice.balance).toFixed(2);

    }else {
        txtPaidAmountView.value = "";
        txtBalanceView.value = "";
    }

    //view inner table
    let displayPropertyList = ['item_category_id.name','itemname','itemprice','serialnumber.serialno','warrenty'];
    let displayPropertyDataList = ['object','text','decimal','object','text'];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(tblInnerView,printInvoice.invoiceItemList, displayPropertyList, displayPropertyDataList,tt1,tt2,tt3,false,inerLoguserPrivilageForModule);





    $('#myModal').modal('show')
}

const printInvoiceForm = () =>{
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+
        ' <link rel="stylesheet" href="css/style.default.css" id="theme-stylesheet">'+
        ' <link rel="stylesheet" href="Resourse/CSS/style.css">'+
        ' <link rel="stylesheet" href="Resourse/CSS/customerorder.css">'+
        '  <link rel="stylesheet" href="Resourse/CSS/ram_css.css">'+
        ' <link rel="stylesheet" href="Resourse/CSS/invoice.css">'+
        '<script src="Resourse/Jquary/jquary.js"></script>' +
        "<h2>Invoice</h2>"
        + myModal.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const refreshForm = () =>{
    invoice = new Object();
    old_invoice = null;

    //array to store invoice item object
    invoice.invoiceItemList = new Array();

    cusorders = httpGetRequest("customerorder/bystatus")
    fillSelectField(select_cusorder,"",cusorders,"code","");

    statuss = httpGetRequest("invoicestatus/all")
    fillSelectField(select_status,"",statuss,"name","Complete");
    invoice.invoice_status_id = JSON.parse(select_status.value);

    payments = httpGetRequest("paymentmethod/all")
    fillSelectField(select_payment,"",payments,"name","Cash");
    invoice.payment_method_id = JSON.parse(select_payment.value);

    if (select_cusorder.value == null){

        invoice.payment_method_id=JSON.parse(select_payment.value);//Auto select value set
    }



    //empty value
    txt_cusmobile.value="";
    select_cusorder.value="";
    txt_cusname.value="";
    txt_cusmail.value="";
    txt_note.value="";
    txt_total.value="";
    txt_discount.value="";
    txt_netamount.value="";
    txt_paid.value="";
    txt_balance.value="";
    //$('#txt_total').css('pointer-events', 'none');


    //reset style
    txt_cusmobile.style.borderBottom="2px solid #fff"
    select_cusorder.style.borderBottom="2px solid #fff"
    txt_cusname.style.borderBottom="2px solid #fff"
    txt_cusmail.style.borderBottom="2px solid #fff"
    txt_note.style.borderBottom="2px solid #fff"
    txt_total.style.borderBottom="2px solid #fff"
    txt_discount.style.borderBottom="2px solid #fff"
    txt_netamount.style.borderBottom="2px solid #fff"
    txt_paid.style.borderBottom="2px solid #fff"
    txt_balance.style.borderBottom="2px solid #fff"


    disabledButton(true,false)
    refreshInnerSection();

    //disabled field
    $('#txt_total').css('pointer-events','none')
     $('#txt_netamount').css('pointer-events','none')

    // initially tooltip
    $("#total_tooltip").tooltip('enable');
    $("#net_tooltip").tooltip('enable');

}

const getitem = () =>{

    invoiceItem.itemcode = null;
    invoiceItem.itemname = null;
    invoiceItem.itemprice = null;
    invoiceItem.warrenty = null;
    txt_warrenty.value = "";


    txt_warrenty.style.borderBottom = "2px solid #fff";
    select_codename.style.borderBottom = "2px solid #fff"
    txt_unitprice.style.borderBottom = "2px solid #fff"
    txt_unitprice.value = "";

    if (JSON.parse(select_cat.value).name == "Ram"){
        ramList = httpGetRequest("/rams/list")
        fillSelectFieldtwoproperty(select_codename,"",ramList,"rcode","rname","");
    }
    if (JSON.parse(select_cat.value).name == "Processor"){
        proList = httpGetRequest("/processor/list")
        fillSelectFieldtwoproperty(select_codename,"",proList,"pcode","pname","");
    }
    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        vgaList = httpGetRequest("/vga/list")
        fillSelectFieldtwoproperty(select_codename,"",vgaList,"vcode","vname","");
    }
    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        psuList = httpGetRequest("/psu/list")
        fillSelectFieldtwoproperty(select_codename,"",psuList,"pscode","psname","");
    }
    if (JSON.parse(select_cat.value).name == "Casing"){
        caseList = httpGetRequest("/casing/list")
        fillSelectFieldtwoproperty(select_codename,"",caseList,"casing_code","casing_name","");
    }
    if (JSON.parse(select_cat.value).name == "Cooler"){
        coolerList = httpGetRequest("/cooler/list")
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"cooler_code","name","");
    }
    if (JSON.parse(select_cat.value).name == "Storage"){
        coolerList = httpGetRequest("/storage/list")
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"code","name","");
    }

    if (JSON.parse(select_cat.value).name == "Motherboard"){
        mbList = httpGetRequest("/motherboard/list")
        fillSelectFieldtwoproperty(select_codename,"",mbList,"code","name","");
    }

    if (JSON.parse(select_cat.value).name == "Laptop"){
        lapList = httpGetRequest("/laptop/list")
        fillSelectFieldtwoproperty(select_codename,"",lapList,"code","name","");
    }
}

const itemValuBinder = () =>{

    let itemObj = JSON.parse(select_codename.value);
    if (JSON.parse(select_cat.value).name == "Ram"){
        invoiceItem.itemcode = itemObj.rcode;
        invoiceItem.itemname = itemObj.rname;
        invoiceItem.warrenty = itemObj.warrenty;
    }

    if (JSON.parse(select_cat.value).name == "Processor"){
        invoiceItem.itemcode = itemObj.pcode;
        invoiceItem.itemname = itemObj.pname;
        invoiceItem.warrenty = itemObj.warrenty;
    }

    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        invoiceItem.itemcode = itemObj.vcode;
        invoiceItem.itemname = itemObj.vname;
        invoiceItem.warrenty = itemObj.warranty;
    }

    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        invoiceItem.itemcode = itemObj.pscode;
        invoiceItem.itemname = itemObj.psname;
        invoiceItem.warrenty = itemObj.warranty;
    }

    if (JSON.parse(select_cat.value).name == "Casing"){
        invoiceItem.itemcode = itemObj.casing_code;
        invoiceItem.itemname = itemObj.casing_name;
        invoiceItem.warrenty = itemObj.warrenty;
    }

    if (JSON.parse(select_cat.value).name == "Cooler"){
        invoiceItem.itemcode = itemObj.cooler_code;
        invoiceItem.itemname = itemObj.name;
        invoiceItem.warrenty = itemObj.warranty;
    }

    if (JSON.parse(select_cat.value).name == "Storage"){
        invoiceItem.itemcode = itemObj.code;
        invoiceItem.itemname = itemObj.name;
        invoiceItem.warrenty = itemObj.warrenty;
    }

    if (JSON.parse(select_cat.value).name == "Laptop"){
        invoiceItem.itemcode = itemObj.code;
        invoiceItem.itemname = itemObj.name;
        invoiceItem.warrenty = itemObj.warrenty;
    }

    if (JSON.parse(select_cat.value).name == "Motherboard"){
        invoiceItem.itemcode = itemObj.code;
        invoiceItem.itemname = itemObj.name;
        invoiceItem.warrenty = itemObj.warrenty;
    }


    txt_warrenty.value = invoiceItem.warrenty;
    txt_warrenty.style.borderBottom = "2px solid green";

    /*if (old_invoiceItem != null && invoiceItem.itemprice != old_invoiceItem.itemprice){
        txt_unitprice.style.borderBottom = "2px solid orange"
    }else {
        txt_unitprice.style.borderBottom = "2px solid green"
    }*/

    if (old_invoiceItem != null && invoiceItem.itemcode != old_invoiceItem.itemcode){
        select_codename.style.borderBottom = "2px solid orange"
    }else {
        select_codename.style.borderBottom = "2px solid green"
    }
}

const getItemSalePrice = () =>{
    txt_unitprice.value = parseFloat(JSON.parse(select_serial.value).sale_price).toFixed();
    invoiceItem.itemprice = txt_unitprice.value;
    txt_unitprice.style.borderBottom = "2px solid green";


}

const toolTip = () =>{
    //console.log(customerOrderItem);
    if(invoiceItem.item_category_id != null){
        $(".floating-label-content").tooltip('disable');
    }
}

const getCustomerByMobile = () =>{
    let pattern = RegExp("^[0][7][01245678][0-9]{7}$");
    if (pattern.test(txt_cusmobile.value)){
        let extCustomer = httpGetRequest("/customer/bymobile/"+txt_cusmobile.value);

        if (extCustomer.length == 0 ){
            txt_cusmobile.style.borderBottom="2px solid red";
        }else {
            console.log(extCustomer);

            txt_cusname.value = extCustomer.name;
            txt_cusmail.value = extCustomer.email;
            txt_cusmobile.style.borderBottom="2px solid green";

            txt_cusname.style.borderBottom="2px solid green";
            txt_cusmail.style.borderBottom="2px solid green";

            invoice.customer_id = extCustomer
        }
    }else {
        txt_cusmobile.style.borderBottom = "2px solid red";
    }
}

const getCustomerByOrder = () =>{
    let extCustomer =JSON.parse(select_cusorder.value).customer_id;

    txt_cusname.value = extCustomer.name;
    txt_cusmail.value = extCustomer.email;
    txt_cusmobile.value = extCustomer.phone;
    txt_cusmobile.style.borderBottom="2px solid green";
    txt_cusname.style.borderBottom="2px solid green";
    txt_cusmail.style.borderBottom="2px solid green";


    $('#hideform').hide();
    $('.hidePayment').hide();

    //disabled field acc to cusorder
    $('#txt_cusname').css('pointer-events', 'none');
    $('#txt_cusmobile').css('pointer-events', 'none');
    $('#txt_cusmail').css('pointer-events', 'none');


    invoice.customer_id = extCustomer;

}

/*const getCustomerOrderItemDetails = () =>{

    //console.log(JSON.parse(select_cusorder.value).id);
    invoice.invoiceItemList = new Array();
    let orderItemList = httpGetRequest("/customerorderitem/getbycoid/"+JSON.parse(select_cusorder.value).id);

    for(let index in orderItemList){
        orderItemList[index].id = null;

        let serialNoList = httpGetRequest("/serielnumber/bycategoryandcode/"+orderItemList[index].item_category_id.id+"/"+orderItemList[index].itemcode);

       if(serialNoList.length >= orderItemList[index].quantity){
           console.log(orderItemList[index])
           for (let i = 0; i<orderItemList[index].quantity; i++){
               orderItemList[index].serialnumber = serialNoList[i];
               invoice.invoiceItemList.push(orderItemList[index])

           }
       }else {
           alert("Item not Available")
       }



    }


    refreshInnerSection();

}*/

const getCustomerOrderItemDetails = () => {
    invoice.invoiceItemList = []; // Initialize invoiceItemList as an empty array
    //get order item list related customer order
    let orderItemList = httpGetRequest("/customerorderitem/getbycoid/" + JSON.parse(select_cusorder.value).id)


    let showNotAvailable = "";

    for (let index in orderItemList) {
        orderItemList[index].id = null;
        //get related seriel number list in current customer order object acording to item category and item code
        let serialNoList = httpGetRequest("/serielnumber/bycategoryandcode/" +
            + orderItemList[index].item_category_id.id + "/" + orderItemList[index].itemcode);


        if (serialNoList.length >= orderItemList[index].quantity) {

            for (let i = 0; i < orderItemList[index].quantity; i++) {
                let itemCopy = { ...orderItemList[index] }; // Create a copy of the order item
                itemCopy.serialnumber = serialNoList[i].serialno;
                invoice.invoiceItemList.push(itemCopy);


            }
            refreshInnerSection();
        } else {
            if (serialNoList.length != 0) {
                let qn = orderItemList[index].quantity;
                let slen = serialNoList.length;
                let availableSerialleangth = qn-slen;
                showNotAvailable += "Item Not Enough For "+ orderItemList[index].itemname + " -> " + availableSerialleangth +"\n";
                for (let i = 0; i < serialNoList.length; i++) {
                    let itemCopy = {...orderItemList[index]}; // Create a copy of the order item
                    itemCopy.serialnumber = serialNoList[i].serialno;
                    invoice.invoiceItemList.push(itemCopy);

                }
                refreshInnerSection();
            }else
                showNotAvailable += "Item Not Enough For "+ orderItemList[index].itemname + " -> " + parseInt(orderItemList[index].quantity)+"\n";
        }
        fillSelectField(select_status,"",statuss,"name","Payement Pending");
        invoice.invoice_status_id = JSON.parse(select_status.value);
        $('#select_status').css('pointer-events', 'none');


    }

    if (showNotAvailable != ""){
         iziToast.info({
                theme: 'dark',
                title: 'Item not available for order',
                message:showNotAvailable,
                layout:2,
                position: 'topRight',
                overlay: true,
                displayMode: 'once',
                zindex: 999,
                animateInside: true,
                closeOnEscape:true,
                timeout: 2000,
                closeOnClick: true,

            });

            refreshInnerSection();
    }

};

const genarateNetAmount = () =>{
    let pattern = new RegExp("^(100(\\.00?)?|(0*?[0-9]\\d?)(\\.\\d{1,2})?)$");
    if (pattern.test(txt_discount.value))
        if (txt_total.value != "" && txt_discount.value != ""){

            let discountAmount = parseFloat((txt_total.value * txt_discount.value) / 100).toFixed(2);


            let totalPrice = parseFloat(txt_total.value);
            let netAmount = totalPrice - parseFloat(discountAmount);
            txt_netamount.value = netAmount.toFixed(2);
            invoice.lastprice = txt_netamount.value;

            if (old_invoice != null && invoice.lastprice != old_invoice.lastprice){
                txt_netamount.style.borderBottom = "2px solid orange"
            }else{
                txt_netamount.style.borderBottom = "2px solid green"
            }
        }else {
            txt_netamount.value="";
            invoice.lastprice = null;
            txt_netamount.style.borderBottom = "1px solid #fff"
        }
    else {
        txt_netamount.value="";
        invoice.lastprice = null;
        txt_netamount.style.borderBottom = "1px solid #fff"
    }
}

const getbalanceAmount = ()=>{
    let netAmount = parseFloat(txt_netamount.value);
    let paidAmount = parseFloat(txt_paid.value);

    if (paidAmount >= netAmount){
        invoice.paidamount = txt_paid.value;
        txt_balance.value = (paidAmount-netAmount).toFixed(2)
        invoice.balance = txt_balance.value;
        addbtn.disabled = false;
        txt_paid.style.borderBottom = "2px solid green";
        txt_balance.style.borderBottom = "2px solid green";
    }else{
        txt_paid.style.borderBottom = "2px solid red";
        txt_balance.value = "";
        invoice.balance = null;
        txt_balance.style.borderBottom = "2px solid #fff";
        addbtn.disabled = true;
    }
}

const getPaidAmountFromCard = ()=>{

    if (invoice.lastprice != null){
        let paymentMethod = JSON.parse(select_payment.value).name;

        if (paymentMethod == "Card"){

            txt_paid.value = parseFloat(txt_netamount.value).toFixed(2);
            invoice.paidamount = txt_paid.value;
            let netAmount = parseFloat(txt_netamount.value);
            let paidAmount = parseFloat(txt_paid.value);
            txt_balance.value = (paidAmount-netAmount).toFixed(2)
            invoice.balance = txt_balance.value;
            addbtn.disabled = false;
            txt_paid.style.borderBottom = "2px solid green";
            txt_balance.style.borderBottom = "2px solid green";



        }else if(paymentMethod == "Cash"){
            txt_paid.value = "";
            txt_balance.value = "";
            txt_paid.style.borderBottom = "1px solid #fff";
            txt_balance.style.borderBottom = "1px solid #fff";

        }
    }

}

const clearPayment = () =>{
    txt_discount.value="";
    invoice.discountrate = null;
    txt_paid.value="";
    invoice.paidamount = null;
    txt_netamount.value="";
    invoice.lastprice=null;
    txt_balance.value="";
    invoice.balance=null;

    txt_discount.style.borderBottom="2px solid #fff"
    txt_netamount.style.borderBottom="2px solid #fff"
    txt_paid.style.borderBottom="2px solid #fff"
    txt_balance.style.borderBottom="2px solid #fff"
}

const checkErrors = () =>{
    let errors = "";

    if (select_cusorder.value !== ""){

        if(invoice.discountrate == null){
            errors = errors+"Please enter discount amount..<br>";
            txt_discount.style.borderBottom="2px solid red";
        }

        if(invoice.invoiceItemList.length == 0){
            errors = errors+"Order Item Not Set..<br>";

        }


    }else {
        if(invoice.cus_name == null){
            errors = errors+"Please enter Customer Name..<br>";
            txt_cusname.style.borderBottom="2px solid red";
        }

        if(invoice.cus_mobile == null){
            errors = errors+"Please enter Customer Phone Number..<br>";
            txt_cusmobile.style.borderBottom="2px solid red";
        }

        if(invoice.cus_mail == null){
            errors = errors+"Please enter Customer Email..<br>";
            txt_cusmail.style.borderBottom="2px solid red";
        }

        if(invoice.invoiceItemList.length == 0){
            errors = errors+"Order Item Not Set..<br>";

        }

        if(invoice.discountrate == null){
            errors = errors+"Please enter discount amount..<br>";
            txt_discount.style.borderBottom="2px solid red";
        }

        if(invoice.paidamount == null){
            errors = errors+"Please enter paid amount..<br>";
            txt_paid.style.borderBottom="2px solid red";
        }



    }


    return errors;

}

const buttonAddMc = () =>{
    let errors = checkErrors();
    console.log(invoice);

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Invoice ..?",
            message: "Invoice Amount: " + invoice.lastprice,
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

                    $.ajax("/invoice",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(invoice),//data that pass to backend
                        contentType:"application/json",
                        success:function(succsessResData,successStatus,resObj){
                            post_server_responce = succsessResData;
                        },error:function (errorResOb,errorStatus,errorMsg){
                            post_server_responce = errorMsg;
                        }
                    })
                    let pattern = new RegExp("^[A-za-z0-9]{7}$")
                    if(pattern.test(post_server_responce)){

                        iziToast.success({
                            theme: 'dark',
                            title: 'Invoice Add Successfully',
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
                        tabSwitchForm(invoice_table,invoice_form)
                        rowViewAfterInvoiceAdd(post_server_responce)
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

const buttonClearMC = () =>{
    refreshTable();
    refreshForm();
}

const getSerialList = () =>{
    invoiceItem.serialnumber = null;
    select_serial.style.borderBottom = "2px solid #fff";
    if(select_cat.value != ""  && select_codename.value!= "" ){
       serialNoList = httpGetRequest("/serielnumber/bycategoryandcode/" + JSON.parse(select_cat.value).id + "/" + invoiceItem.itemcode);
        console.log(invoiceItem.itemcode)
        fillSelectField(select_serial,"",serialNoList,'serialno','');

        //invoiceItem.serialnumber = select_serial.value;
        //select_serial.style.borderBottom = "2px solid green"


    }
}

const refreshInnerSection = () =>{
    //Inner Form
    invoiceItem = new Object();//inner object
    old_invoiceItem = null;

    categories = httpGetRequest("itemcategory/all");
    fillSelectField(select_cat,"",categories,"name","");



    // initially disable the field
    $('#select_codename').prop('disabled', true);
    $(".floating-label-content").tooltip('enable');
    $('#txt_unitprice').css('pointer-events', 'none');


    //empty field after refresh
    select_codename.value='';
    txt_unitprice.value="";
    select_serial.value="";
    txt_warrenty.value="";


    //clear style when refresh
    select_cat.style.borderBottom="2px solid #fff"
    select_codename.style.borderBottom="2px solid #fff"
    txt_unitprice.style.borderBottom="2px solid #fff"
    select_serial.style.borderBottom="2px solid #fff"
    txt_warrenty.style.borderBottom="2px solid #fff"




    //Inner Table
    let totalAmount = 0.00;
    let displayPropertyList = ['item_category_id.name','itemname','itemprice','serialnumber.serialno','warrenty'];
    let displayPropertyDataList = ['object','text','decimal','object','text'];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(corder_innertbl,invoice.invoiceItemList, displayPropertyList, displayPropertyDataList,innerFormReFill,innerRowDelete,innerRowView,true,inerLoguserPrivilageForModule);

    for (let index in invoice.invoiceItemList){
        corder_innertbl.children[1].children[index].children[6].children[0].style.display="none";
        corder_innertbl.children[1].children[index].children[6].children[1].style.display="none";

        totalAmount = parseFloat(totalAmount) + parseFloat(invoice.invoiceItemList[index].itemprice)
    }


    if (totalAmount != 0.00){
       txt_total.value = parseFloat(totalAmount).toFixed(2);
        txt_total.style.borderBottom = "2px solid green"
        invoice.totalamount = txt_total.value;

      /* if (old_invoice != null && invoice.amount != old_invoice.amount){
           txt_total.style.borderBottom = "2px solid orange"
       }else{
           txt_total.style.borderBottom = "2px solid green"
       }*/
   }


}


const checkErrorInner = () =>{
    let innerError = ""

    if(invoiceItem.item_category_id == null){
        innerError = innerError+"Item Category Not Selected..<br>";
        select_cat.style.borderBottom="1px solid red";
    }

    if(invoiceItem.itemcode == null){
        innerError = innerError+"Item Code And Name Not Selected..<br>";
        select_codename.style.borderBottom="1px solid red";
    }


    if(invoiceItem.itemprice == null){
        innerError = innerError+"Valid Unit Price Not Enter..<br>";
        txt_unitprice.style.borderBottom="1px solid red";
    }
    if(invoiceItem.warrenty == null){
        innerError = innerError+"Valid Warrenty Not Enter..<br>";
        txt_warrenty.style.borderBottom="1px solid red";
    }

    if(invoiceItem.serialnumber == null){
        innerError = innerError+"Item Seriel Number Not Selected..<br>";
        select_serial.style.borderBottom="1px solid red";
    }

    return innerError;
}


/*const btnInnerAddMC = (event) =>{
    console.log(customerOrderItem);
    console.log(customerorder.customerOrderItemList)
    event.preventDefault();
    let innerErrors = checkErrorInner();

    if(innerErrors == ""){

        if (customerorder.customerOrderItemList != ""){
            let orderItemCode = "";
            for (let index in customerorder.customerOrderItemList){
                orderItemCode = customerorder.customerOrderItemList[index].itemcode;
                return orderItemCode;
                if (customerOrderItem.itemcode != orderItemCode){
                    console.log("ok")
                }else {
                    console.log("error")
                }
            }
        }


        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Customer Order Item..?",
            message: "Item Category: " + customerOrderItem.item_category_id.name + "<br>Item Name: " + customerOrderItem.itemname,
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
                    customerorder.customerOrderItemList.push(customerOrderItem);
                    iziToast.success({
                        theme: 'dark',
                        title: 'Order Item Add Successfully',
                        position: 'topRight',
                        overlay: true,
                        displayMode: 'once',
                        zindex: 999,
                        animateInside: true,
                        closeOnEscape:true,
                        timeout: 2000,
                        closeOnClick: true,

                    });
                    refreshInnerSection();

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
            message: innerErrors,
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
}*/

const btnInnerAddMC = (event) =>{
    event.preventDefault();

    let innerErrors = checkErrorInner();

    if(innerErrors == ""){
        let invoiceItemNameExists = false;
        for (let index in invoice.invoiceItemList) {
            let invoiceItemName = invoice.invoiceItemList[index].serialnumber;
            if (invoiceItem.serialnumber === invoiceItemName) {
                invoiceItemNameExists = true;
                break;
            }
        }

        if (invoiceItemNameExists) {
            iziToast.error({
                title: 'Error : Item With This Serial Number Already Exist ',
                position: 'topRight',
                overlay: true,
                closeOnEscape: false,
                close: true,
                layout: 1,
                displayMode: 'once',
                zindex: 999,
                animateInside: true,
                buttons: [
                    ['<button><b>OK</b></button>', function (instance, toast) {
                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    }, true]
                ]
            });
        } else {
            //Show the confirmation box when the Add button is clicked
            iziToast.show({
                theme: 'dark',
                title: "Are You Suer To Add Following  Invoice Item..?",
                message: "Item Category: " + invoiceItem.item_category_id.name + "<br>Item Name: " + invoiceItem.itemname,
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
                        invoice.invoiceItemList.push(invoiceItem);
                        iziToast.success({
                            theme: 'dark',
                            title: 'Invoice Item Add Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 1000,
                            closeOnClick: true,

                        });
                        clearPayment();
                        refreshInnerSection();



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
    } else {
        iziToast.error({
            title: 'You Have Following Error',
            message: innerErrors,
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

       /* if (invoiceItem.serialnumber != null){
            invoice.invoiceItemList.push(invoiceItem);
            // dissabled total amount tooltip
            $("#total_tooltip").tooltip('disable');
            refreshInnerSection();
        }*/

}


const innerFormReFill = (obj) =>{

    /*customerOrderItem = JSON.parse(JSON.stringify(obj));
    old_customerOrderItem = JSON.parse(JSON.stringify(obj));


    fillSelectField(select_cat,"",categories,"name",customerOrderItem.item_category_id.name);

    if(JSON.parse(select_cat.value).name == "Ram"){
        ramList = httpGetRequest("/rams/list")
        fillSelectFieldtwoproperty(select_codename,"",ramList,"rcode","rname",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Processor"){
        proList = httpGetRequest("/processor/list")
        fillSelectFieldtwoproperty(select_codename,"",proList,"pcode","pname",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        vgaList = httpGetRequest("/vga/list")
        fillSelectFieldtwoproperty(select_codename,"",vgaList,"vcode","vname",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        psuList = httpGetRequest("/psu/list")
        fillSelectFieldtwoproperty(select_codename,"",psuList,"pscode","psname",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Casing"){
        caseList = httpGetRequest("/casing/list")
        fillSelectFieldtwoproperty(select_codename,"",caseList,"casing_code","casing_name",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Cooler"){
        coolerList = httpGetRequest("/cooler/list")
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"cooler_code","name",customerOrderItem.itemcode);
    }
    if (JSON.parse(select_cat.value).name == "Storage"){
        coolerList = httpGetRequest("/storage/list")
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"code","name",customerOrderItem.itemcode);
    }

    txt_unitprice.value =customerOrderItem.itemprice;
    txt_qnt.value =customerOrderItem.quantity;

    select_cat.style.borderBottom="2px solid green"
    select_codename.style.borderBottom="2px solid green"
    txt_unitprice.style.borderBottom="2px solid green"
    txt_qnt.style.borderBottom="2px solid green"

    toolTip();*/
}

const innerRowDelete = (obj,rowindex) =>{
    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: "Are You Suer To Delete Following Customer Order Item..?",
        message: "Item Category: " + obj.item_category_id.name + "<br>Item Name: " + obj.itemname,
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
                invoice.invoiceItemList.splice(rowindex,1);
                iziToast.success({
                    theme: 'dark',
                    title: 'Customer Order Item remove Successfully',
                    position: 'topRight',
                    overlay: true,
                    displayMode: 'once',
                    zindex: 999,
                    animateInside: true,
                    closeOnEscape:true,
                    timeout: 2000,
                    closeOnClick: true,

                });
                clearPayment();
                refreshInnerSection();


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

const innerRowView = () =>{

}

const tt1 = () =>{

}
const tt2 = () =>{

}
const tt3 = () =>{

}


