//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Customer Order")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

}
//Define function to refresh Table
const refreshTable = () =>{

    customerorders = new Array();
    customerorders = httpGetRequest("customerorder/all")

    let displayPropertyList = ['code','customer_id.name', 'requiredate','orderstatus_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text','object', 'text','object'];

    //calling fill data in to function
    fillTable(tbl_cusorder,customerorders, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    for (let index in customerorders){
        if (customerorders[index].orderstatus_id.name == "Complete"){
            tbl_cusorder.children[1].children[index].children[5].children[0].style.display = "none";
            tbl_cusorder.children[1].children[index].children[5].children[2].style.display = "none";
        }

        if (customerorders[index].orderstatus_id.name == "Invoice Created-Payment Pending"){
            tbl_cusorder.children[1].children[index].children[5].children[0].style.display = "none";
        }

        if (customerorders[index].orderstatus_id.name == "Cancel"){
            tbl_cusorder.children[1].children[index].children[5].children[0].style.display = "none";
            tbl_cusorder.children[1].children[index].children[5].children[2].style.display = "none";
        }
    }

    //To add jquery table
    $('#tbl_cusorder').dataTable();
}

const getItemName = (obj) =>{
    //console.log(obj)
    let orderItem = "";
    for (let index in obj.customerOrderItemList){
        if (obj.customerOrderItemList.length-1 == index)
        orderItem = orderItem + obj.customerOrderItemList[index].itemname;
        else orderItem = orderItem + obj.customerOrderItemList[index].itemname + ",";
    }
    return orderItem
}

const formReFill = (obj) =>{
    customerorder = httpGetRequest("/customerorder/getbyid?id="+obj.id);
    old_customerorder = httpGetRequest("/customerorder/getbyid?id="+obj.id);

    //fill the text field
    reqdate.value = customerorder.requiredate;
    txt_total.value =customerorder.amount;

    if (customerorder.note != undefined){
        txt_note.value =customerorder.note;
    }else{
        txt_note.value = "";
    }

    //set value in to select feild
    fillSelectField(select_cus,"",customers,"name",customerorder.customer_id.name);



    //validate color for refil field
    if (customerorder.note != undefined){
        txt_note.style.borderBottom="2px solid green"
    }else {txt_note.style.borderBottom="2px solid #fff"}

    txt_total.style.borderBottom="2px solid green"
    reqdate.style.borderBottom="2px solid green"

    //switch tab and table
    tabSwitch(cusorder_table,cusorder_form);

    disabledButton(false,true);

    refreshInnerSection();


}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to delete the following Customer Order...?',
        message: "Order Code: " + obj.code,
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

                $.ajax("/customerorder",{
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

    printOrder = new Object();
    printOrder = httpGetRequest("/customerorder/getbyid?id="+obj.id);

    td_code.innerHTML = printOrder.code;
    td_type.innerHTML =printOrder.customer_id.cusomer_type_id.name;
    td_name.innerHTML =printOrder.customer_id.name;


   /* // Create an array to store the item names
    const itemNames = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (const item of printOrder.customerOrderItemList) {
        itemNames.push(item.itemname);
    }

    // Join the item names with a separator (e.g., comma) into a single string
    const itemNamesString = itemNames.join(", ");

    // Set the content of the item name cell to the item names string
    td_item.innerHTML = itemNamesString;*/

    /*////  Supply item brand and category   ////*/

    // Create an array to store the Supply item Brand and Cateory
    let item = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (let index of printOrder.customerOrderItemList) {
        let category = index.item_category_id.name;
        let itemname = index.itemname;
        let itemprice = index.itemprice;
        let qn = index.quantity;
        let linetotal = index.linetotal;
        let itemdetails = category + " => " + itemname + " => " + itemprice + " => " + qn + " => " + linetotal;
        item.push(itemdetails);
    }

    // Join the item names with a separator (e.g., comma) into a single string
    let joinItem = item.join("<br><br>");

    // Set the content of the item name cell to the item names string
    td_item.innerHTML = joinItem;

    /*//////////////////*/

    td_amount.innerHTML =printOrder.amount
    td_rdate.innerHTML = printOrder.requiredate;
    td_user.innerHTML =printOrder.adduser_id.user_name;
    td_add_datetime.innerHTML =printOrder.adddatetime;
    td_status.innerHTML =printOrder.orderstatus_id.name;
    $('#cusorderViewModel').modal('show');
}

const cusOrderPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Order Details</h2>"
        + cusorderPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const refreshForm = () =>{
    customerorder = new Object();
    old_customerorder = null;

    //array to store customer order item object
    customerorder.customerOrderItemList = new Array();

    customers = httpGetRequest("customer/bystatus")
    statuss = httpGetRequest("customerorderstatus/all")

    fillSelectField(select_cus,"",customers,"name","");
    fillSelectField(select_orderstatuses,"",statuss,"name","Pending");
    customerorder.orderstatus_id = JSON.parse(select_orderstatuses.value);

    //disabled status field
    $('#select_orderstatuses').css('pointer-events', 'none');
    //add valid color to boarder bottm
    select_orderstatuses.style.borderBottom="2px solid #green"


    //require date validation
    let mindate = new Date();
    mindate.setDate(mindate.getDate() + 2);
    reqdate.min = getDateFormat("date",mindate);


    let maxdate = new Date();
    maxdate.setDate(maxdate.getDate() + 14);
    reqdate.max = getDateFormat("date",maxdate);


    //empty value
    txt_note.value="";
    txt_total.value="";
    //$('#txt_total').css('pointer-events', 'none');
    reqdate.value=="";

    //reset style
    select_cus.style.borderBottom="2px solid #fff"
    txt_note.style.borderBottom="2px solid #fff"
    txt_total.style.borderBottom="2px solid #fff"
    reqdate.style.borderBottom="2px solid #fff"

    $('#txt_total').css('pointer-events', 'none');

    disabledButton(true,false);

    refreshInnerSection();

}

const getitem = () =>{

    customerOrderItem.itemcode = null;
    customerOrderItem.itemname = null;
    customerOrderItem.itemprice = null;

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
        storageList = httpGetRequest("/storage/list")
        fillSelectFieldtwoproperty(select_codename,"",storageList,"code","name","");
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
        customerOrderItem.itemcode = itemObj.rcode;
        customerOrderItem.itemname = itemObj.rname;
    }

    if (JSON.parse(select_cat.value).name == "Processor"){
        customerOrderItem.itemcode = itemObj.pcode;
        customerOrderItem.itemname = itemObj.pname;
    }

    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        customerOrderItem.itemcode = itemObj.vcode;
        customerOrderItem.itemname = itemObj.vname;
    }

    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        customerOrderItem.itemcode = itemObj.pscode;
        customerOrderItem.itemname = itemObj.psname;
    }

    if (JSON.parse(select_cat.value).name == "Casing"){
        customerOrderItem.itemcode = itemObj.casing_code;
        customerOrderItem.itemname = itemObj.casing_name;
    }

    if (JSON.parse(select_cat.value).name == "Cooler"){
        customerOrderItem.itemcode = itemObj.cooler_code;
        customerOrderItem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Storage"){
        customerOrderItem.itemcode = itemObj.code;
        customerOrderItem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Laptop"){
        customerOrderItem.itemcode = itemObj.code;
        customerOrderItem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Motherboard"){
        customerOrderItem.itemcode = itemObj.code;
        customerOrderItem.itemname = itemObj.name;
    }

    customerOrderItem.warrenty = itemObj.warrenty;

    customerOrderItem.itemprice = parseFloat(itemObj.sale_price).toFixed(2);
    txt_unitprice.value = customerOrderItem.itemprice;



    if (old_customerOrderItem != null && customerOrderItem.itemprice != old_customerOrderItem.itemprice){
        txt_unitprice.style.borderBottom = "2px solid orange"
    }else {
        txt_unitprice.style.borderBottom = "2px solid green"
    }

    if (old_customerOrderItem != null && customerOrderItem.itemcode != old_customerOrderItem.itemcode){
        select_codename.style.borderBottom = "2px solid orange"
    }else {
        select_codename.style.borderBottom = "2px solid green"
    }
}

const toolTip = () =>{
    //console.log(customerOrderItem);
    if(customerOrderItem.item_category_id != null){
        $(".floating-label-content").tooltip('disable');
    }
}

const checkErrors = () =>{
    let errors = "";

    if(customerorder.customer_id == null){
        errors = errors+"Customer Not Selected..<br>";
        select_cus.style.borderBottom="2px solid red";
    }

    if(customerorder.requiredate == null){
        errors = errors+"Required Date Not Set..<br>";
        reqdate.style.borderBottom="2px solid red";
    }

    if(customerorder.amount == null){
        errors = errors+"Total Amount  Not Set..<br>";
        txt_total.style.borderBottom="2px solid red";
    }

    if(customerorder.orderstatus_id == null){
        errors = errors+"Order Status Not Selected..<br>";
        select_orderstatuses.style.borderBottom="2px solid red";
    }

    if(customerorder.customerOrderItemList.length == 0){
        errors = errors+"Order Item Not Set..<br>";

    }
    return errors;

}

const buttonAddMc = () =>{
    //console.log(customerorder);
    let errors = checkErrors();

    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Customer Order..?",
            message: "Customer: " + customerorder.customer_id.name + "<br>Total Amount: " + customerorder.amount,
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

                    $.ajax("/customerorder",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(customerorder),//data that pass to backend
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
                            title: 'Customer Order Add Successfully',
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
                        tabSwitchForm(cusorder_table,cusorder_form)

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

    if (customerorder != null && old_customerorder != null) {

        if(customerorder.customer_id.name != old_customerorder.customer_id.name) {
            updates = updates + "Customer Has Changed..<br>"
        }

        if(customerorder.requiredate != old_customerorder.requiredate) {
            updates = updates + "Required Date Has Changed..<br>"
        }

        if(customerorder.note != old_customerorder.note) {
            updates = updates + "Note Has Changed..<br>"
        }

        if(customerorder.amount != old_customerorder.amount) {
            updates = updates + "Total Amount Has Changed..<br>"
        }

        let itemUpdate = true;
        if(customerorder.customerOrderItemList.length != old_customerorder.customerOrderItemList.length) {
            updates = updates + "Order Item Is Changed..<br>"
        }else {
            for (let index in customerorder.customerOrderItemList){
                for (let oldIndex in old_customerorder.customerOrderItemList){
                    if (customerorder.customerOrderItemList[index].itemcode != old_customerorder.customerOrderItemList[oldIndex].itemcode){
                        itemUpdate = false;break
                    }
                }
            }
        }

        if (!itemUpdate){
            updates = updates + "Order Item Is Changed..<br>"
        }


    }

    return updates;
}

const buttonUpdateMC = () =>{
    console.log(customerorder)
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

                        $.ajax("/customerorder",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(customerorder),//data that pass to backend
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
                                title: 'Pre Order Update Successfully',
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
                            tabSwitchForm(cusorder_table,cusorder_form)

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

const refreshInnerSection = () =>{
    //Inner Form
    customerOrderItem = new Object();//inner object
    old_customerOrderItem = null;

    categories = httpGetRequest("itemcategory/all");
    fillSelectField(select_cat,"",categories,"name","");

    // initially disable the field
    $('#select_codename').prop('disabled', true);
    $(".floating-label-content").tooltip('enable');


    //empty field after refresh
    select_codename.value='';
    txt_unitprice.value="";
    txt_qnt.value="";

    //clear style when refresh
    select_cat.style.borderBottom="2px solid #fff"
    select_codename.style.borderBottom="2px solid #fff"
    txt_unitprice.style.borderBottom="2px solid #fff"
    txt_qnt.style.borderBottom="2px solid #fff"



    //Inner Table
    let totalAmount = 0.00;
    let displayPropertyList = ['item_category_id.name','itemname','itemprice', 'quantity','linetotal'];
    let displayPropertyDataList = ['object','text','decimal', 'text',lineTotal];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(corder_innertbl,customerorder.customerOrderItemList, displayPropertyList, displayPropertyDataList,innerFormReFill,innerRowDelete,innerRowView,true,inerLoguserPrivilageForModule);

    //hide edit and view button and get total amount
    for (let index in customerorder.customerOrderItemList){
        corder_innertbl.children[1].children[index].children[6].children[0].style.display="none";
        corder_innertbl.children[1].children[index].children[6].children[1].style.display="none";


        totalAmount = parseFloat(totalAmount) + parseFloat(customerorder.customerOrderItemList[index].linetotal)
    }

   /*for (let index in customerorder.customerOrderItemList){
       totalAmount = parseFloat(totalAmount) + parseFloat(customerorder.customerOrderItemList[index].linetotal)
   }*/

    if (totalAmount != 0.00){
       txt_total.value = parseFloat(totalAmount).toFixed(2);
       customerorder.amount = txt_total.value;

       if (old_customerorder != null && customerorder.amount != old_customerorder.amount){
           txt_total.style.borderBottom = "2px solid orange"
       }else{
           txt_total.style.borderBottom = "2px solid green"
       }
   }else {
        txt_total.value = "";
        customerorder.amount =null;
        txt_total.style.borderBottom = "2px solid #fff"
    }


}

const lineTotal = (obj) =>{
    let total = parseFloat(obj.itemprice * obj.quantity).toFixed(2)
    return total;

}

const getlineTotal = () =>{
    customerOrderItem.linetotal = lineTotal(customerOrderItem)
}

const checkErrorInner = () =>{
    let innerError = ""

    if(customerOrderItem.item_category_id == null){
        innerError = innerError+"Item Category Not Selected..<br>";
        select_cat.style.borderBottom="1px solid red";
    }

    if(customerOrderItem.itemcode == null){
        innerError = innerError+"Item Code And Name Not Selected..<br>";
        select_codename.style.borderBottom="1px solid red";
    }


    if(customerOrderItem.itemprice == null){
        innerError = innerError+"Valid Unit Price Not Enter..<br>";
        txt_unitprice.style.borderBottom="1px solid red";
    }

    if(customerOrderItem.quantity == null){
        innerError = innerError+"Valid Quantity Not Enter..<br>";
        txt_qnt.style.borderBottom="1px solid red";
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
    console.log(customerorder.customerOrderItemList);
    event.preventDefault();
    let innerErrors = checkErrorInner();

    if(innerErrors == ""){
        let orderItemNameExists = false;
        for (let index in customerorder.customerOrderItemList) {
            let orderItemName = customerorder.customerOrderItemList[index].itemname;
            console.log(orderItemName);
            if (customerOrderItem.itemname === orderItemName) {
                orderItemNameExists = true;
                break;
            }
        }

        if (orderItemNameExists) {
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

const innerFormReFill = (obj) =>{

    customerOrderItem = JSON.parse(JSON.stringify(obj));
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

    toolTip();
}

const innerRowDelete = (obj) =>{
    event.preventDefault();
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
                //customerorder.customerOrderItemList.splice(customerOrderItem);
                const indexToRemove = customerorder.customerOrderItemList.findIndex(coi => coi === obj);
                if (indexToRemove !== -1) {
                    customerorder.customerOrderItemList.splice(indexToRemove, 1);
                }
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


