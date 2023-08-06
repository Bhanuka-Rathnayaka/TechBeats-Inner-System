//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {


    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Grn")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

    $('[data-bs-toggle="tooltip"]').tooltip();

    select_sup.addEventListener("change",event =>{

        porders = httpGetRequest("/purchaserequest/bysupplerid/"+JSON.parse(select_sup.value).id);
        fillSelectField(select_porder,"",porders,"code","");
        grn.purchase_request_id = null;
        select_sup.style.borderBottom = "2px solid green";
        select_porder.style.borderBottom = "2px solid #fff";



        /*$("#tt1").tooltip('disable');*/

    })

    select_porder.addEventListener("change",event =>{

        categories = httpGetRequest("/itemcategory/bypoid/"+JSON.parse(select_porder.value).id);
        fillSelectField(select_cat,"",categories,"name","");
        $('#grnItemViewBtn').prop('disabled', false);


        $('#select_sup').css('pointer-events','none')
        $('#select_porder').css('pointer-events','none')
        $("#ttspan").tooltip('disable');

    })


}

const refreshTable = () =>{

    grns = new Array();
    grns = httpGetRequest("grn/all")

    let displayPropertyList = ['purchase_request_id.supplier_id.name','purchase_request_id.code','recivedate','finalamaount','grn_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['object','object','text','decimal','object'];

    //calling fill data in to function
    fillTable(tbl_grn,grns, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

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
    $('#tbl_grn').dataTable();
}

const formReFill = (obj) =>{
    grn = httpGetRequest("/grn/getbyid?id="+obj.id);
    old_grn = httpGetRequest("/grn/getbyid?id="+obj.id);

    //fill the text field
    resivedate.value = grn.recivedate;
    txt_total.value =grn.totalamount;
    txt_taxrate.value =grn.taxrate;
    //txt_amountwithtax.value =grn.amount;
    txt_discount.value =grn.discountrate;
    txt_netamount.value =parseFloat(grn.finalamaount).toFixed(2);


    if (grn.note != undefined){
        txt_note.value =grn.note;
    }else{
        txt_note.value = "";
    }

    suppliers = httpGetRequest("supplier/all");
    fillSelectField(select_sup,"",suppliers,"name",grn.purchase_request_id.supplier_id.name);

    porders = httpGetRequest("/purchaserequest/all")
    fillSelectField(select_porder,"",porders,"code",grn.purchase_request_id.code);

    categories = httpGetRequest("/itemcategory/bypoid/"+JSON.parse(select_porder.value).id);
    fillSelectField(select_cat,"",categories,"name","")

    statuss = httpGetRequest("/grnstatus/all")
    fillSelectField(select_status,"",statuss,"name",grn.grn_status_id.name)

    $('#select_sup').css('pointer-events','none')
    $('#select_porder').css('pointer-events','none')
    $('#grnItemViewBtn').prop('disabled', false);
    $("#ttspan").tooltip('disable');





    //validate color for refil field
    if (grn.note != undefined){
        txt_note.style.borderBottom="2px solid green";
    }else {txt_note.style.borderBottom="2px solid #fff"}

    resivedate.style.borderBottom = "2px solid green"
    txt_total.style.borderBottom ="2px solid green"
    txt_taxrate.style.borderBottom ="2px solid green"
    //txt_amountwithtax.style.borderBottom ="2px solid green"
    txt_discount.style.borderBottom ="2px solid green"
    txt_netamount.style.borderBottom ="2px solid green"

    //switch tab and table
    tabSwitch(grn_table,grn_form);

    genarateTaxAmount();

    refreshInnerSection();



}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to Cancel the following GRN...?',
        message: "GRN Code: " + obj.code,
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

                $.ajax("/grn",{
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
                        title: 'Order Canceled',
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
const rowView = (obj) =>{

    grn = httpGetRequest("/grn/getbyid?id="+obj.id);
    old_grn = httpGetRequest("/grn/getbyid?id="+obj.id);

    td_grncode.innerHTML = grn.code;
    td_supname.innerHTML = grn.purchase_request_id.supplier_id.name;
    td_code.innerHTML = grn.purchase_request_id.code;
    td_rdate.innerHTML = grn.recivedate;
    td_amount.innerHTML = grn.totalamount;
    td_taxrate.innerHTML = grn.taxrate;
    td_discount.innerHTML = grn.discountrate;
    td_net.innerHTML = grn.finalamaount;


    /*////  Supply item brand and category   ////*/

    // Create an array to store the Supply item Brand and Cateory
    let item = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (let index of grn.grnItemList) {
        let category = index.item_category_id.name;
        let itemname = index.itemname;
        let itemprice = index.itemprice;
        let qn = index.quantity;
        let linetotal = index.linetotal;
        let itemdetails = category + " => " + itemname + " => " + itemprice + " => " + qn + " => " + linetotal;
        item.push(itemdetails);
    }

    // Join the item names with a separator (e.g., comma) into a single string
    let joinItem = item.join("<br>");

    // Set the content of the item name cell to the item names string
    td_item.innerHTML = joinItem;

    /*//////////////////*/


    td_adduser.innerHTML = grn.adduser_id.user_name;
    td_add_datetime.innerHTML = grn.adddatetime;

    if (grn.updateuser_id != undefined)
        td_updateuser.innerHTML = grn.updateuser_id.user_name;
    else
        td_updateuser.innerHTML = "-";

    if (grn.updatedatetime != undefined)
        td_update_datetime.innerHTML = grn.updatedatetime;
    else
        td_update_datetime.innerHTML = "-";

    if (grn.deleteuser_id != undefined)
        td_deluser.innerHTML = grn.deleteuser_id.user_name;
    else
        td_deluser.innerHTML = "-";

    if (grn.deletedatetime != undefined)
        td_del_datetime.innerHTML = grn.deletedatetime;
    else
        td_del_datetime.innerHTML = "-";


    td_status.innerHTML = grn.grn_status_id.name;

    $('#grnViewModel').modal('show');

}

const grnPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>GRN Details</h2>"
        + grnPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}
const refreshForm = () =>{
    grn = new Object();
    old_grn = null;

    //array to store invoice item object
    grn.grnItemList = new Array();

    grn.serielList = new Array();

    suppliers = httpGetRequest("supplier/all");
    fillSelectField(select_sup,"",suppliers,"name","");

    statuss = httpGetRequest("/grnstatus/all")
    fillSelectField(select_status,"",statuss,"name","GRN Create - Payment Pending")
    grn.grn_status_id = JSON.parse(select_status.value)


    $('#grnItemViewBtn').prop('disabled', true);
    $('#innerdiv').collapse('hide');
    $('#txt_total').css('pointer-events', 'none');
    $('#txt_amountwithtax').css('pointer-events', 'none');
    $('#txt_netamount').css('pointer-events', 'none');

    //emty value
    select_sup.value = "";
    select_porder.value = "";
    resivedate.value = "";
    txt_taxrate.value = "";
    txt_amountwithtax.value = "";
    txt_discount.value = "";
    txt_netamount.value = "";

    select_sup.style.borderBottom = "2px solid #fff"
    select_porder.style.borderBottom = "2px solid #fff"
    resivedate.style.borderBottom = "2px solid #fff"
    txt_taxrate.style.borderBottom = "2px solid #fff"
    txt_amountwithtax.style.borderBottom = "2px solid #fff"
    txt_discount.style.borderBottom = "2px solid #fff"
    txt_netamount.style.borderBottom = "2px solid #fff"

    $('#select_sup').css('pointer-events','all')
    $('#select_porder').css('pointer-events','all')

    //recived date validate
    //require date validation
    let mindate = new Date();
    mindate.setDate(mindate.getDate()-7);
    resivedate.min = getDateFormat("date",mindate);


    let maxdate = new Date();
    maxdate.setDate(maxdate.getDate());
    resivedate.max = getDateFormat("date",maxdate);



    refreshInnerSection()


}

const getitem = () =>{

    if (select_porder.value != "" && select_cat.value != ""){

        select_codename.value = "";
        txt_unitprice.value = "";
        txt_qn.value = "";
        txt_linetotal .value = "";

        grnitem.itemcode = null;
        grnitem.itemprice = null;
        grnitem.linetotal = null;
        grnitem.quantity = null;


        select_codename.style.borderBottom = "2px solid #fff"
        txt_unitprice.style.borderBottom = "2px solid #fff"
        txt_qn.style.borderBottom = "2px solid #fff"
        txt_linetotal.style.borderBottom = "2px solid #fff"

        itemList  = httpGetRequest("/purchaserequestitem/itembypo/"+JSON.parse(select_porder.value).id+"/&itembycategory/"+JSON.parse(select_cat.value).id)
        fillSelectFieldtwoproperty(select_codename,"",itemList,"itemcode","itemname","");


    }


}

const itemBinder = () =>{


    let itemObj = JSON.parse(select_codename.value);
    console.log(itemObj)

    grnitem.itemcode = itemObj.itemcode;
    grnitem.itemname = itemObj.itemname;
    select_codename.style.borderBottom = "2px solid green";

    txt_unitprice.value =parseFloat(itemObj.itemprice).toFixed(2);
    grnitem.itemprice = txt_unitprice.value;
    txt_unitprice.style.borderBottom = "2px solid green";

    txt_qn.value = itemObj.quantity
    grnitem.quantity =  txt_qn.value
    txt_qn.style.borderBottom = "2px solid green";

    txt_linetotal.value = parseFloat(itemObj.linetotal).toFixed(2)
    grnitem.linetotal = txt_linetotal.value
    txt_linetotal.style.borderBottom = "2px solid green";


}

const toolTip = () =>{
    //console.log(customerOrderItem);
    if(grnitem.item_category_id != null){
        $(".floating-label-content").tooltip('disable');
    }
}

const genarateTaxAmount = () =>{
    if (txt_total.value != "" && txt_taxrate.value != ""){
        let taxAmount = parseFloat((txt_total.value * txt_taxrate.value) / 100).toFixed(2);


        let totalPrice = parseFloat(txt_total.value);
        let netAmount = totalPrice + parseFloat(taxAmount);
        txt_amountwithtax.value = netAmount.toFixed(2);
        txt_amountwithtax.style.borderBottom = "2px solid green"


       if (old_grn != null && grn.totalamount != old_grn.totalamount || old_grn != null && grn.taxrate != old_grn.taxrate){
           txt_amountwithtax.style.borderBottom = "2px solid orange"
        }else{
           txt_amountwithtax.style.borderBottom = "2px solid green"
        }
    }else {
        txt_amountwithtax.value="";
        txt_amountwithtax.style.borderBottom = "1px solid #fff"
    }
}
const genarateNetAmount = () =>{
    if (txt_amountwithtax.value != "" && txt_discount.value != ""){


        let discountAmount = parseFloat((txt_amountwithtax.value * txt_discount.value) / 100).toFixed(2);


        let totalPrice = parseFloat(txt_amountwithtax.value);
        let netAmount = totalPrice - parseFloat(discountAmount);
        txt_netamount.value = netAmount.toFixed(2);
        grn.finalamaount = txt_netamount.value;

        if (old_grn != null && grn.finalamaount != old_grn.lastprice){
            txt_netamount.style.borderBottom = "2px solid orange"
        }else{
            txt_netamount.style.borderBottom = "2px solid green"
        }

    } else {
        txt_netamount.value="";
        grn.finalamaount = null;
        txt_netamount.style.borderBottom = "1px solid #fff"
    }


}

const checkErrors = () =>{
    let errors = "";

    if(select_sup.value == ""){
        errors = errors+"Supplier Not Selected..<br>";
        select_sup.style.borderBottom="2px solid red";
    }

    if(grn.purchase_request_id == null){
        errors = errors+"Purchase Order NOt Selected..<br>";
        select_porder.style.borderBottom="2px solid red";
    }

    if(grn.recivedate == null){
        errors = errors+"Recived Date Not Set..<br>";
        resivedate.style.borderBottom="2px solid red";
    }

    if(grn.grnItemList.length == 0){
        errors = errors+"Item Not Set..<br>";

    }

    if(grn.taxrate == null){
        errors = errors+"Valid Tax Rate Not Enter..<br>";
        txt_taxrate.style.borderBottom="2px solid red";
    }

    if(grn.discountrate == null){
        errors = errors+"Valid Discount Rate Not Enter..<br>";
        txt_discount.style.borderBottom="2px solid red";
    }

    return errors;

}
const buttonAddMc = () =>{
    console.log(grn);
    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following GRN..?",
            message: "Supplier: " + JSON.parse(select_sup.value).name + "<br>Purchase Order Code: " + grn.purchase_request_id.code,
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

                    $.ajax("/grn",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(grn),//data that pass to backend
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
                            title: 'GRN Add Successfully',
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
                        tabSwitchForm(grn_table,grn_form)
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

    if (grn != null && old_grn != null) {


        if(grn.recivedate != old_grn.recivedate) {
            updates = updates + "Recivede Date Has Been Changed..<br>"
        }

        if(grn.note != old_grn.note) {
            updates = updates + "Note Has Been Changed..<br>"
        }

        if(grn.totalamount != old_grn.totalamount) {
            updates = updates + "Total Amount Has Been Changed..<br>"
        }

        if(grn.taxrate != old_grn.taxrate) {
            updates = updates + "Tax Rate Has Been Changed..<br>"
        }


        if(grn.discountrate != old_grn.discountrate) {
            updates = updates + "Discount Rate Has Been Changed..<br>"
        }

        if(grn.finalamaount != old_grn.finalamaount) {
            updates = updates + "Final Amount Has Been Changed..<br>"
        }

        if(grn.grn_status_id.name != old_grn.grn_status_id.name) {
            updates = updates + "GRN Status Has Been Changed..<br>"
        }

        let itemUpdate = true;
        if(grn.grnItemList.length != old_grn.grnItemList.length) {
            updates = updates + "Item Has Been Changed..<br>"
        }else {
            for (let index in grn.grnItemList){
                for (let oldIndex in grn.grnItemList){
                    if (grn.grnItemList[index].itemcode != old_grn.grnItemList[oldIndex].itemcode){
                        itemUpdate = false;break
                    }
                }
            }
        }

        if (!itemUpdate){
            updates = updates + "Item Has Been Changed..<br>"
        }


    }

    return updates;
}

const buttonUpdateMC = () =>{
    console.log(grn)

    let errors = checkErrors();
    if (errors == ""){
        let updates = checkUpdates();
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

                        $.ajax("/grn",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(grn),//data that pass to backend
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
                                title: 'Purchase Request Update Successfully',
                                position: 'topRight',
                                overlay: true,
                                displayMode: 'once',
                                zindex: 999,
                                animateInside: true,
                                closeOnEscape:true,
                                timeout: 2000,
                                closeOnClick: true,

                            });
                            tabSwitchForm(grn_table,grn_form);
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
const refreshInnerSection = () =>{
    grnitem = new Object();
    old_grnItem = null;

    //empty field after refresh
    select_cat.value='';
    select_codename.value='';
    txt_linetotal.value='';
    txt_unitprice.value="";
    txt_qn.value="";

    //clear style when refresh
    select_cat.style.borderBottom="2px solid #fff"
    select_codename.style.borderBottom="2px solid #fff"
    txt_unitprice.style.borderBottom="2px solid #fff"
    txt_qn.style.borderBottom="2px solid #fff"
    txt_linetotal.style.borderBottom="2px solid #fff"




    //Inner Table
    let totalAmount = 0.00;
    let displayPropertyList = ['item_category_id.name','itemname','itemprice', 'quantity','linetotal'];
    let displayPropertyDataList = ['object','text','decimal', 'text',lineTotal];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(grn_innertbl,grn.grnItemList, displayPropertyList, displayPropertyDataList,innerFormReFill,innerRowDelete,innerRowView,true,inerLoguserPrivilageForModule);

    //hide edit and view button and get total amount
    for (let index in grn.grnItemList){
     grn_innertbl.children[1].children[index].children[6].children[0].style.display="none";
     grn_innertbl.children[1].children[index].children[6].children[1].style.display="none";


        totalAmount = parseFloat(totalAmount) + parseFloat(grn.grnItemList[index].linetotal)
    }


    if (totalAmount != 0.00){
        txt_total.value = parseFloat(totalAmount).toFixed(2);
        grn.totalamount = txt_total.value;

        if (old_grn != null && grn.totalamount != old_grn.totalamount){
            txt_total.style.borderBottom = "2px solid orange"
        }else{
            txt_total.style.borderBottom = "2px solid green"
        }
    }else {
        txt_total.value = "";
        grn.totalamount =null;
        txt_total.style.borderBottom = "2px solid #fff"
    }

}

const lineTotal = (obj) =>{
    let total = parseFloat(obj.itemprice * obj.quantity).toFixed(2)
    return total;

}
const getlineTotal = () =>{


    if (txt_unitprice.value != "" && txt_qn.value != ""){

        /*txt_linetotal.value  = lineTotal(grnitem);*/

                let totalprice = parseFloat(txt_unitprice.value * txt_qn.value).toFixed(2)
                txt_linetotal.value = totalprice
                grnitem.linetotal =  txt_linetotal.value
                txt_linetotal.style.borderBottom = "1px solid green";
                console.log("wo")



    }else {
        txt_linetotal.value="";
        grnitem.linetotal = null;
        txt_linetotal.style.borderBottom = "1px solid #fff";
    }

    /*if (txt_unitprice.value != "" && txt_qn.value != ""){
        pattern =  new RegExp("^(?!0\d)(?!-)(?=\d{4,})(?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d{2})?$")

        if (pattern.test(txt_unitprice.value)){
            console.log("aaa")
            txt_linetotal.value  = lineTotal(grnitem);
            grnitem.linetotal =  txt_linetotal.value

        }
    }else {
        txt_linetotal.value="";
        grnitem.linetotal = null;
        txt_linetotal.style.borderBottom = "1px solid #fff"
    }
*/
}
const viewSerielNumModel = (event) =>{
    event.preventDefault();

    tbody = tbl_seriel.children[1];

    tbody.innerHTML="";

    for (let i=0;i<grnitem.quantity;i++){

        const row = document.createElement('tr');

        // Create cells for each column in the table
        const id = document.createElement('td');
        const itemCodeCell = document.createElement('td');
        const itemNameCell = document.createElement('td');
        const serialNumberValueCell = document.createElement('td');

        serialNumberInput = document.createElement('input');
        serialNumberInput.type = "text";
        serialNumberInput.classList.add("form-control");
        serialNumberInput.classList.add("serialno");



        // Set the content of the cells
        id.innerText = i + 1;
        itemCodeCell.innerText = grnitem.itemcode;
        itemNameCell.innerText = grnitem.itemname;
        serialNumberInput.onkeyup = function (){

            let pattern = new RegExp("^[A-Za-z0-9]{5,20}$")
            if (pattern.test(this.value)){
                this.style.borderBottom = "2px solid green"
            }else
                this.style.borderBottom = "2px solid red"
        }


        serialNumberValueCell.appendChild(serialNumberInput);


        // Append the cells to the row
        row.appendChild(id);
        row.appendChild(itemCodeCell);
        row.appendChild(itemNameCell);
        row.appendChild(serialNumberValueCell);

        // Append the row to the table body
        tbody.appendChild(row)
    }

    $('#addSerielModel').modal('show');

}
const addSerialNumber = () =>{

    let variable_list = document.getElementsByClassName("serialno");
    console.log(variable_list.length)

    for (let i=0;i<variable_list.length;i++){
        serielNO = new Object();

        serielNO.item_category_id = grnitem.item_category_id;
         serielNO.item_code = grnitem.itemcode;
         serielNO.item_name = grnitem.itemname;
         serielNO.serialno = variable_list[i].value;
         serielNO.status = true;

        if (grnitem.item_category_id.name == "Ram"){
            ramList = httpGetRequest("/rams/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(ramList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);
        }
        if (grnitem.item_category_id.name == "Processor"){
            proList = httpGetRequest("/processor/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(proList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }
        if (grnitem.item_category_id.name == "Graphic Card"){
            vgaList = httpGetRequest("/vga/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(vgaList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }
        if (grnitem.item_category_id.name == "Power Supply Unit"){
            psuList = httpGetRequest("/psu/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(psuList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }
        if (grnitem.item_category_id.name == "Casing"){
            caseList = httpGetRequest("/casing/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(caseList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }
        if (grnitem.item_category_id.name == "Cooler"){
            coolerList = httpGetRequest("/cooler/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);
            console.log(coolerList);
            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(coolerList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }
        if (grnitem.item_category_id.name == "Storage"){
            storageList = httpGetRequest("/storage/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(storageList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }

        if (grnitem.item_category_id.name == "Motherboard"){
            mbList = httpGetRequest("/motherboard/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(mbList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }

        if (grnitem.item_category_id.name == "Laptop"){
            lapList = httpGetRequest("/laptop/byitemcodename/"+grnitem.itemcode+"/"+grnitem.itemname);

            serielNO.sale_price= parseFloat(grnitem.itemprice) + (parseFloat(grnitem.itemprice)*parseFloat(lapList.profit_rate)/100)
            serielNO.purchase_price = parseFloat(grnitem.itemprice);

        }

        console.log(serielNO)

         grn.serielList.push(serielNO);

    }
    $('#addSerielModel').modal('hide');
}
const innerFormReFill = () =>{

}
const innerRowDelete = (obj) => {
    event.preventDefault();
    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: "Are You Suer To Delete Following Purchase Order Item..?",
        message: "Item Name: " + obj.itemname,
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
                const indexToRemove = grn.grnItemList.findIndex(gri => gri === obj);
                if (indexToRemove !== -1) {
                    grn.grnItemList.splice(indexToRemove, 1);

                }
                refreshPayment();
                /* iziToast.success({
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

                 });*/
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
const checkErrorInner = () =>{
    let innerError = ""

    if(grnitem.item_category_id == null){
        innerError = innerError+"Item Category Not Selected..<br>";
        select_cat.style.borderBottom="1px solid red";
    }

    if(grnitem.itemcode == null){
        innerError = innerError+"Item Code And Name Not Selected..<br>";
        select_codename.style.borderBottom="1px solid red";
    }


    if(grnitem.itemprice == null){
        innerError = innerError+"Valid Unit Price Not Enter..<br>";
        txt_unitprice.style.borderBottom="1px solid red";
    }

    if(grnitem.quantity == null){
        innerError = innerError+"Valid Quantity Not Enter..<br>";
        txt_qn.style.borderBottom="1px solid red";
    }



    if(grnitem.linetotal == null){
        innerError = innerError+"Valid Line total Not Enter..<br>";
        txt_linetotal.style.borderBottom="1px solid red";
    }

    return innerError;
}

const refreshPayment = () =>{
    //empty value exsist
    txt_taxrate.value = "";
    txt_discount.value = "";
    txt_amountwithtax.value = "";
    txt_netamount.value = "";
    txt_taxrate.style.borderBottom = "2px solid #fff"
    txt_amountwithtax.style.borderBottom = "2px solid #fff"
    txt_discount.style.borderBottom = "2px solid #fff"
    txt_netamount.style.borderBottom = "2px solid #fff"

    grn.taxrate = null;
    grn.discountrate = null;
    grn.finalamaount = null;



}

const btnInnerAddMC = (event) =>{

    event.preventDefault();
    let innerErrors = checkErrorInner();

    if(innerErrors == ""){
        let purchaseOrderItemNameExists = false;
        for (let index in grn.grnItemList) {
            let PurchaseorderItemName = grn.grnItemList[index].itemname;
            if (grnitem.itemname === PurchaseorderItemName) {
                purchaseOrderItemNameExists = true;
                break;
            }
        }

        if (purchaseOrderItemNameExists) {
            iziToast.error({
                title: 'Error : Item Already Exist ',
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
                title: "Are You Suer To Add Following Customer Order Item..?",
                message: "Item Category: " + grnitem.item_category_id.name + "<br>Item Name: " + grnitem.itemname,
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
                        grn.grnItemList.push(grnitem);
                        //reset payment info
                        refreshPayment();
                        // dissabled total amount tooltip
                        $("#total_tooltip").tooltip('disable');

                        iziToast.success({
                            theme: 'dark',
                            title: 'Order Item Add Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 1000,
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
}