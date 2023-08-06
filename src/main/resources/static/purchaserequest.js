//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Purchase Request")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

    select_sup.addEventListener("change",event =>{

        categories = httpGetRequest("/itemcategory/bysupplerid/"+JSON.parse(select_sup.value).id);
        fillSelectField(select_cat,"",categories,"name","");
        prequestitem.item_category_id = null;
        select_cat.style.borderBottom = "2px solid #fff";

        $('#select_sup').css('pointer-events', 'none');


        $("#tt1").tooltip('disable');

    })

    select_cat.addEventListener("change",event =>{

        brandsByCategory = httpGetRequest("/itembrand/bycatid/"+JSON.parse(select_cat.value).id + "/bysid/" + JSON.parse(select_sup.value).id);
        fillSelectField(select_brand,"",brandsByCategory,"name","");
        prequestitem.item_brand_id = null;
        select_brand.style.borderBottom = "1px solid #fff";
        $("#tt2").tooltip('disable');

    })

}

const refreshTable = () =>{
    prequets = new Array();
    prequets = httpGetRequest("purchaserequest/all")

    let displayPropertyList = ['code','supplier_id.name', 'requireddate','amount','purchase_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text','object', 'text','decimal','object'];

    //calling fill data in to function
    fillTable(tbl_prequest,prequets, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

   for (let index in prequets){
            tbl_prequest.children[1].children[index].children[6].children[0].style.display="none";
            tbl_prequest.children[1].children[index].children[6].children[2].style.display="none";
        }


    //To add jquery table
    $('#tbl_prequest').dataTable();
}

const formReFill = (obj) =>{
    prequet = httpGetRequest("/purchaserequest/getbyid?id="+obj.id);
    old_prequest = httpGetRequest("/purchaserequest/getbyid?id="+obj.id);

    //fill the text field
    reqdate.value = prequet.requireddate;
    txt_total.value =prequet.amount;

    if (prequet.note != undefined){
        txt_note.value =prequet.note;
    }else{
        txt_note.value = "";
    }

    //set value in to select feild
    fillSelectField(select_sup,"",suppliers,"name",prequet.supplier_id.name);



    //validate color for refil field
    if (prequet.note != undefined){
        txt_note.style.borderBottom="2px solid green"
    }else {txt_note.style.borderBottom="2px solid #fff"}

    txt_total.style.borderBottom="2px solid green"
    reqdate.style.borderBottom="2px solid green"

    //switch tab and table
    tabSwitch(prequest_table,prequest_form);

    $('#select_sup').css('pointer-events', 'none');
    $("#tt1").tooltip('disable');

    refreshInnerSection();
    categories = httpGetRequest("/itemcategory/bysupplerid/"+JSON.parse(select_sup.value).id);
    fillSelectField(select_cat,"",categories,"name","");


}

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to Cancel the following Purchase Order...?',
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

                $.ajax("/purchaserequest",{
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

    prequet = httpGetRequest("/purchaserequest/getbyid?id="+obj.id);
    old_prequest = httpGetRequest("/purchaserequest/getbyid?id="+obj.id);

    td_code.innerHTML = prequet.code;
    td_name.innerHTML = prequet.supplier_id.name;
    td_rdate.innerHTML = prequet.requireddate;
    td_item.innerHTML = prequet.number;
    td_amount.innerHTML = prequet.amount;


    /*////  Supply item brand and category   ////*/

    // Create an array to store the Supply item Brand and Cateory
    let item = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (let index of prequet.purchaseRequestItemList) {
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


    td_adduser.innerHTML = prequet.adduser_id.user_name;
    td_add_datetime.innerHTML = prequet.adddatetime;

    if (prequet.updateuser_id != undefined)
        td_updateuser.innerHTML = prequet.updateuser_id.user_name;
    else
        td_updateuser.innerHTML = "-";

    if (prequet.updatedatetime != undefined)
        td_update_datetime.innerHTML = prequet.updatedatetime;
    else
        td_update_datetime.innerHTML = "-";

    if (prequet.deleteuser_id != undefined)
        td_deluser.innerHTML = prequet.deleteuser_id.user_name;
    else
        td_deluser.innerHTML = "-";

    if (prequet.deletedatetime != undefined)
        td_del_datetime.innerHTML = prequet.deletedatetime;
    else
        td_del_datetime.innerHTML = "-";


    td_status.innerHTML = prequet.purchase_status_id.name;

    $('#prViewModel').modal('show');

}

const PRPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Purchase Order Details</h2>"
        + prPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

const getItemName = (obj) =>{
    //console.log(obj)
    let orderItem = "";
    for (let index in obj.purchaseRequestItemList){
        if (obj.purchaseRequestItemList.length-1 == index)
            orderItem = orderItem + obj.purchaseRequestItemList[index].itemname;
        else orderItem = orderItem + obj.purchaseRequestItemList[index].itemname + ",";
    }
    return orderItem
}

const refreshForm = () =>{
    prequet = new Object();
    old_prequest = null;

    //array to store purchase order item object
    prequet.purchaseRequestItemList = new Array();

    suppliers = httpGetRequest("supplier/all");
    fillSelectField(select_sup,"",suppliers,"name","");

    statuss = httpGetRequest("purchaserequeststatus/all")
    fillSelectField(select_statuses,"",statuss,"name","Purchase Order Created - GRN Pending");
    prequet.purchase_status_id = JSON.parse(select_statuses.value);

    //disabled status field
    $('#select_statuses').css('pointer-events', 'none');
    $('#txt_total').css('pointer-events', 'none');

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
    reqdate.value=="";

    //reset style
    select_sup.style.borderBottom="2px solid #fff";
    txt_note.style.borderBottom="2px solid #fff";
    txt_total.style.borderBottom="2px solid #fff";
    reqdate.style.borderBottom="2px solid #fff";


    refreshInnerSection();




}

const getitem = () =>{

    prequestitem.itemcode = null;
    prequestitem.itemname = null;
    prequestitem.itemprice = null;

    select_codename.style.borderBottom = "2px solid #fff"
    txt_unitprice.style.borderBottom = "2px solid #fff"
    txt_unitprice.value = "";

    if (JSON.parse(select_cat.value).name == "Ram"){
        ramList = httpGetRequest("/rams/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",ramList,"rcode","rname","");
    }
    if (JSON.parse(select_cat.value).name == "Processor"){
        proList = httpGetRequest("/processor/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",proList,"pcode","pname","");
    }
    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        vgaList = httpGetRequest("/vga/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",vgaList,"vcode","vname","");
    }
    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        psuList = httpGetRequest("/psu/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",psuList,"pscode","psname","");
    }
    if (JSON.parse(select_cat.value).name == "Casing"){
        caseList = httpGetRequest("/casing/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",caseList,"casing_code","casing_name","");
    }
    if (JSON.parse(select_cat.value).name == "Cooler"){
        coolerList = httpGetRequest("/cooler/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"cooler_code","name","");
    }
    if (JSON.parse(select_cat.value).name == "Storage"){
        coolerList = httpGetRequest("/storage/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",coolerList,"code","name","");
    }

    if (JSON.parse(select_cat.value).name == "Motherboard"){
        mbList = httpGetRequest("/motherboard/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",mbList,"code","name","");
    }

    if (JSON.parse(select_cat.value).name == "Laptop"){
        lapList = httpGetRequest("/laptop/listbycategories/"+JSON.parse(select_brand.value).id)
        fillSelectFieldtwoproperty(select_codename,"",lapList,"code","name","");
    }
}

const itemValuBinder = () =>{

    let itemObj = JSON.parse(select_codename.value);
    if (JSON.parse(select_cat.value).name == "Ram"){
        prequestitem.itemcode = itemObj.rcode;
        prequestitem.itemname = itemObj.rname;
    }

    if (JSON.parse(select_cat.value).name == "Processor"){
        prequestitem.itemcode = itemObj.pcode;
        prequestitem.itemname = itemObj.pname;
    }

    if (JSON.parse(select_cat.value).name == "Graphic Card"){
        prequestitem.itemcode = itemObj.vcode;
        prequestitem.itemname = itemObj.vname;
    }

    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        prequestitem.itemcode = itemObj.pscode;
        prequestitem.itemname = itemObj.psname;
    }

    if (JSON.parse(select_cat.value).name == "Casing"){
        prequestitem.itemcode = itemObj.casing_code;
        prequestitem.itemname = itemObj.casing_name;
    }

    if (JSON.parse(select_cat.value).name == "Cooler"){
        prequestitem.itemcode = itemObj.cooler_code;
        prequestitem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Storage"){
        prequestitem.itemcode = itemObj.code;
        prequestitem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Motherboard"){
        prequestitem.itemcode = itemObj.code;
        prequestitem.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Laptop"){
        prequestitem.itemcode = itemObj.code;
        prequestitem.itemname = itemObj.name;
    }

    prequestitem.itemprice = parseFloat(itemObj.purchase_price).toFixed(2);
    txt_unitprice.value = prequestitem.itemprice;



    if (old_prequestitem != null && prequestitem.itemprice != old_prequestitem.itemprice){
        txt_unitprice.style.borderBottom = "2px solid orange"
    }else {
        txt_unitprice.style.borderBottom = "2px solid green"
    }

    if (old_prequestitem != null && prequestitem.itemcode != old_prequestitem.itemcode){
        select_codename.style.borderBottom = "2px solid orange"
    }else {
        select_codename.style.borderBottom = "2px solid green"
    }
}

const checkErrors = () =>{
    let errors = "";

    if(prequet.supplier_id == null){
        errors = errors+"Supplier Not Selected..<br>";
        select_sup.style.borderBottom="2px solid red";
    }

    if(prequet.requireddate == null){
        errors = errors+"Required Date Not Set..<br>";
        reqdate.style.borderBottom="2px solid red";
    }

    if(prequet.amount == null){
        errors = errors+"Total Amount  Not Set..<br>";
        txt_total.style.borderBottom="2px solid red";
    }

    if(prequet.purchase_status_id == null){
        errors = errors+"Order Status Not Selected..<br>";
        select_statuses.style.borderBottom="2px solid red";
    }

    if(prequet.purchaseRequestItemList.length == 0){
        errors = errors+"Purchase Order Item Not Set..<br>";

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
            title: "Are You Suer To Add Following Purchase Order..?",
            message: "Supplier: " + prequet.supplier_id.name + "<br>Total Amount: " + prequet.amount,
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

                    $.ajax("/purchaserequest",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(prequet),//data that pass to backend
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
                            title: 'Purchase Order Add Successfully',
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
                        tabSwitchForm(prequest_table,prequest_form)
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

    if (prequet != null && old_prequest != null) {


        if(prequet.requireddate != old_prequest.requireddate) {
            updates = updates + "Required Date Has Changed..<br>"
        }

        if(prequet.note != old_prequest.note) {
            updates = updates + "Note Has Changed..<br>"
        }

        if(prequet.amount != old_prequest.amount) {
            updates = updates + "Total Amount Has Changed..<br>"
        }

        let itemUpdate = true;
        if(prequet.purchaseRequestItemList.length != old_prequest.purchaseRequestItemList.length) {
            updates = updates + "Purchase Order Item Is Changed..<br>"
        }else {
            for (let index in prequet.purchaseRequestItemList){
                for (let oldIndex in prequet.purchaseRequestItemList){
                    if (prequet.purchaseRequestItemList[index].itemcode != old_prequest.purchaseRequestItemList[oldIndex].itemcode){
                        itemUpdate = false;break
                    }
                }
            }
        }

        if (!itemUpdate){
            updates = updates + "Purchase Order Item Is Changed..<br>"
        }


    }

    return updates;
}

const buttonUpdateMC = () =>{

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

                        $.ajax("/purchaserequest",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(prequet),//data that pass to backend
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
                            tabSwitchForm(prequest_table,prequest_form);
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
    prequestitem = new Object();
    old_prequestitem = null;

    categories = httpGetRequest("itemcategory/all");
    fillSelectField(select_cat,"",categories,"name","")

    brands = httpGetRequest("itembrand/all");
    fillSelectField(select_brand,"",brands,"name","")

    //empty field after refresh
    select_codename.value='';
    txt_unitprice.value="";
    txt_qnt.value="";

    //clear style when refresh
    select_cat.style.borderBottom="2px solid #fff";
    select_brand.style.borderBottom="2px solid #fff";
    select_codename.style.borderBottom="2px solid #fff";
    txt_unitprice.style.borderBottom="2px solid #fff";
    txt_qnt.style.borderBottom="2px solid #fff";

    // initially disable the field
   if (select_sup.value == ""){
       $('#select_cat').prop('disabled', true);
   }

    $('#select_brand').prop('disabled', true);
    $('#select_codename').prop('disabled', true);
    $('#tt2').tooltip('enable');
    $('#tt3').tooltip('enable');

    //Inner Table
    let totalAmount = 0.00;
    let displayPropertyList = ['item_brand_id.name','item_category_id.name','itemname','itemprice', 'quantity','linetotal'];
    let displayPropertyDataList = ['object','object','text','decimal', 'text',lineTotal];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(prequestinnertbl,prequet.purchaseRequestItemList, displayPropertyList, displayPropertyDataList,innerFormReFill,innerRowDelete,innerRowView,true,inerLoguserPrivilageForModule);

    //hide edit and view button and get total amount
    for (let index in prequet.purchaseRequestItemList){
        prequestinnertbl.children[1].children[index].children[7].children[0].style.display="none";
        prequestinnertbl.children[1].children[index].children[7].children[1].style.display="none";


        totalAmount = parseFloat(totalAmount) + parseFloat(prequet.purchaseRequestItemList[index].linetotal)
    }

    if (totalAmount != 0.00){
        txt_total.value = parseFloat(totalAmount).toFixed(2);
        prequet.amount = txt_total.value;

        if (old_prequest != null && prequet.amount != old_prequest.amount){
            txt_total.style.borderBottom = "2px solid orange"
        }else{
            txt_total.style.borderBottom = "2px solid green"
        }
    }else {
        txt_total.value = "";
        prequet.amount =null;
        txt_total.style.borderBottom = "2px solid #fff"
    }

    $('#txt_unitprice').css('pointer-events', 'none');





}

const lineTotal = (obj) =>{
    let total = parseFloat(obj.itemprice * obj.quantity).toFixed(2)
    return total;

}

const getlineTotal = () =>{
    prequestitem.linetotal = lineTotal(prequestitem);
}

const toolTip = () =>{
    //console.log(customerOrderItem);
    if(prequestitem.item_category_id != null && prequestitem.item_brand_id != null){
        $(".floating-label-content").tooltip('disable');
    }
}

const checkErrorInner = () =>{
    let innerError = ""

    if(prequestitem.item_category_id == null){
        innerError = innerError+"Item Category Not Selected..<br>";
        select_cat.style.borderBottom="1px solid red";
    }

    if(prequestitem.item_brand_id == null){
        innerError = innerError+"Item Brand Not Selected..<br>";
        select_brand.style.borderBottom="1px solid red";
    }

    if(prequestitem.itemcode == null){
        innerError = innerError+"Item Code And Name Not Selected..<br>";
        select_codename.style.borderBottom="1px solid red";
    }


    if(prequestitem.itemprice == null){
        innerError = innerError+"Valid Unit Price Not Enter..<br>";
        txt_unitprice.style.borderBottom="1px solid red";
    }

    if(prequestitem.quantity == null){
        innerError = innerError+"Valid Quantity Not Enter..<br>";
        txt_qnt.style.borderBottom="1px solid red";
    }

    return innerError;
}

const btnInnerAddMC = (event) =>{
    event.preventDefault();
    console.log(prequestitem.quantity);
    let innerErrors = checkErrorInner();

   if(innerErrors == ""){
        let orderItemNameExists = false;
        for (let index in prequet.purchaseRequestItemList) {
            let orderItemName = prequet.purchaseRequestItemList[index].itemname;
            if (prequestitem.itemname === orderItemName) {
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
                message: "Item Category: " + prequestitem.item_category_id.name + "<br>Item Name: " + prequestitem.itemname,
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
                        prequet.purchaseRequestItemList.push(prequestitem);
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
                 //customerorder.customerOrderItemList.splice(customerOrderItem);
                 const indexToRemove = prequet.purchaseRequestItemList.findIndex(poi => poi === obj);
                 if (indexToRemove !== -1) {
                     prequet.purchaseRequestItemList.splice(indexToRemove, 1);

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





