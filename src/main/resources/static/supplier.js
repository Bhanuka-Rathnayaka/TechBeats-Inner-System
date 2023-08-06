//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {


    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Storage")

    //Calling function refresh Employee Table
    refreshTable();
    refreshForm();

    select_brand.addEventListener("change",event =>{

        categoriesByBrand = httpGetRequest("/itemcategory/bybrand?bid="+ JSON.parse(select_brand.value).id);
        fillSelectField(select_cat,"",categoriesByBrand,"name","");

        supplierbrandcategory.item_category_id = null;
        select_cat.style.borderBottom = "1px solid #fff";
    })

}

const refreshTable = () =>{

    suppliers = new Array();
    suppliers = httpGetRequest("supplier/all")

    let displayPropertyList = ['sup_code','name','agent_name','supplier_status_id.name'];

    //create display property type list
    let displayPropertyDataList = ['text','text','text','object'];

    //calling fill data in to function
    fillTable(tbl_sup,suppliers, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,true,loguserPrivilageForModule);

    //hide delete and edit button
    for (let index in suppliers){

        if(suppliers[index].supplier_status_id.id == 2){
            tbl_sup.children[1].children[index].children[5].children[2].disabled=true;

        }


    }

    //To add jquery table
    $('#tbl_sup').dataTable();
}

const getItemBrandCategory = (obj) =>{
    //console.log(obj)
    let itemBrandCategory = "";
    for (let index in obj.supplierItemBrandCategoriesList){
        if (obj.supplierItemBrandCategoriesList.length-1 == index)
            itemBrandCategory += obj.supplierItemBrandCategoriesList[index].item_brand_id.name + " => " + obj.supplierItemBrandCategoriesList[index].item_category_id.name;
        else itemBrandCategory += obj.supplierItemBrandCategoriesList[index].item_brand_id.name + " => " + obj.supplierItemBrandCategoriesList[index].item_category_id.name + "<br>";
    }
    return itemBrandCategory.replace(/<br>/g, "\n");
}

const formReFill = (obj) =>{

    supplier = httpGetRequest("/supplier/getbyid/"+obj.id);
    old_supplier = httpGetRequest("supplier/getbyid/"+obj.id);

    //fill the text field
    txt_supname.value=supplier.name;
    txt_supmobile.value=supplier.number;
    txt_supmail.value=supplier.email;
    txt_supaddress.value=supplier.address;

    if (supplier.website != undefined){
        txt_supweb.value =supplier.website
    }else{
        txt_supweb.value = "";
    }

    txt_supbrn.value=supplier.brn;
    txt_supagename.value=supplier.agent_name;
    txt_supagemobile.value=supplier.agent_phone;
    txt_supagemail.value=supplier.agent_email;

    fillSelectField(select_status,"",statuss,"name",supplier.supplier_status_id.name);

    tabSwitch(supplier_table,supplier_form);

    setStyle("2px solid green")

    refreshInnerSection1();
    refreshInnerSection2();

    disabledButton(false,true);
}

const checkUpdate = () =>{
    let updates = "";

    if (supplier != null && old_supplier != null) {

        if(supplier.name != old_supplier.name) {
            updates = updates + "Supplier Name Has Changed..<br>"
        }

        if(supplier.email != old_supplier.email) {
            updates = updates + "Supplier Email Has Changed..<br>"
        }

        if(supplier.number != old_supplier.number) {
            updates = updates + "Supplier Phone Number Has Changed..<br>"
        }

        if(supplier.website != old_supplier.website) {
            updates = updates + "Supplier Website Number Has Changed..<br>"
        }

        if(supplier.agent_name != old_supplier.agent_name) {
            updates = updates + "Supplier Agent Name Number Has Changed..<br>"
        }

        if(supplier.agent_email != old_supplier.agent_email) {
            updates = updates + "Supplier Agent Mail Has Changed..<br>"
        }

        if(supplier.agent_phone != old_supplier.agent_phone) {
            updates = updates + "Supplier Agent Phone Number Has Changed..<br>"
        }
        /*Check Inner 1 Updates*/
        let itemBrandCategoryUpdate = true;
        if(supplier.supplierItemBrandCategoriesList.length != old_supplier.supplierItemBrandCategoriesList.length) {
            updates = updates + "Supplier Item Brand and Category Is Changed..<br>"

        }else {
            for (let index in supplier.supplierItemBrandCategoriesList){
                for (let oldIndex in old_supplier.supplierItemBrandCategoriesList){
                    if (supplier.supplierItemBrandCategoriesList[index].item_brand_id.id != old_supplier.supplierItemBrandCategoriesList[oldIndex].item_brand_id.id && supplier.supplierItemBrandCategoriesList[index].item_category_id.id != old_supplier.supplierItemBrandCategoriesList[oldIndex].item_category_id.id){
                        itemBrandCategoryUpdate = false;break
                    }

                }

            }
        }



        if (!itemBrandCategoryUpdate){
            updates = updates + "Supplier Item Brand and Category Is Changed..<br>"
        }
        /*Check Inner 2 updates*/
        let supplierBanks = true;
        if(supplier.supplierBanksList.length != old_supplier.supplierBanksList.length) {
            updates = updates + "Supplier Bank Is Changed..<br>"
        }else {
            for (let index in supplier.supplierBanksList){
                for (let oldIndex in old_supplier.supplierBanksList){
                    if (supplier.supplierBanksList[index].bank_id.id != old_supplier.supplierBanksList[oldIndex].bank_id.id && supplier.supplierBanksList[index].accountnumber != old_supplier.supplierBanksList[oldIndex].accountnumber){
                        supplierBanks = false;break
                    }
                }
            }
        }

        if (!supplierBanks){
            updates = updates + "Supplier Banks Is Changed..<br>"
        }
    }

    return updates;

}
const buttonUpdateMC = () =>{
    let errors = CheckErrors();
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

                        $.ajax("/supplier",{
                            async : false,
                            type:"PUT",//Method
                            data:JSON.stringify(supplier),//data that pass to backend
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
                                title: 'Supplier Update Successfully',
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
                            tabSwitchForm(supplier_table,supplier_form);
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

const rowDelete= (obj) => {

    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: 'Are you sure to Delete the following Supplier...?',
        message: "Supplier Code: " + obj.sup_code + "<br>Supplier Name: " + obj.name,
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

                $.ajax("/supplier",{
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
                        title: 'Supplier Deleted',
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

    supplier = httpGetRequest("/supplier/getbyid/"+obj.id);
    console.log(typeof supplier);
    old_supplier = httpGetRequest("supplier/getbyid/"+obj.id);

    td_code.innerHTML = supplier.sup_code;
    td_name.innerHTML = supplier.name;
    td_mail.innerHTML = supplier.email;
    td_phone.innerHTML = supplier.number;
    td_add.innerHTML = supplier.address;
    td_web.innerHTML = supplier.website;
    td_brn.innerHTML = supplier.brn;
    td_aname.innerHTML = supplier.agent_name;
    td_amobile.innerHTML = supplier.agent_phone;
    td_amail.innerHTML = supplier.agent_email;

    /*////  Supply item brand and category   ////*/

    // Create an array to store the Supply item Brand and Cateory
    let itemBranCategory = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (let index of supplier.supplierItemBrandCategoriesList) {
        let brand = index.item_brand_id.name;
        let category = index.item_category_id.name;
        let branCateory = brand + " => " + category;
        itemBranCategory.push(branCateory);
    }

    // Join the item names with a separator (e.g., comma) into a single string
    let itemBrandsCategoriesString = itemBranCategory.join("<br>");

    // Set the content of the item name cell to the item names string
    td_bandc.innerHTML = itemBrandsCategoriesString;

    /*//////////////////*/

    /*////  Suppler Bank   ////*/

    // Create an array to store the Supply item Brand and Cateory
    let supplierBank = [];

    // Iterate over the customerOrderItemList array and collect item names
    for (let index of supplier.supplierBanksList) {
        let bank = index.bank_id.name;
        let holder = index.holdername;
        let accno = index.accountnumber;
        let branch = index.branchname;
        let bankdetails = bank + " => " + holder + " - " + accno + " - " + branch;
        supplierBank.push(bankdetails);
    }

    // Join the item names with a separator (e.g., comma) into a single string
    let supplierBanksString = supplierBank.join("<br>");

    // Set the content cell to
    td_bank.innerHTML =  supplierBanksString;

    /*//////////////////*/






    td_adduser.innerHTML = supplier.adduser_id.user_name;
    td_add_datetime.innerHTML = supplier.adddatetime;

    if (supplier.updateuser_id != undefined)
        td_updateuser.innerHTML = supplier.updateuser_id.user_name;
    else
        td_updateuser.innerHTML = "-";

    if (supplier.updatedatetime != undefined)
        td_update_datetime.innerHTML = supplier.updatedatetime;
    else
        td_update_datetime.innerHTML = "-";

    if (supplier.deleteuser_id != undefined)
        td_deluser.innerHTML = supplier.deleteuser_id.user_name;
    else
        td_deluser.innerHTML = "-";

    if (supplier.deletedatetime != undefined)
        td_del_datetime.innerHTML = supplier.deletedatetime;
    else
        td_del_datetime.innerHTML = "-";


    td_status.innerHTML = supplier.supplier_status_id.name;

    $('#supplierViewModel').modal('show');

}

const refreshForm = () =>{
    supplier = new Object();
    old_supplier = null;

    //array to store supplier item brand and category object
    supplier.supplierItemBrandCategoriesList = new Array();

    //array to store supplier item brand and category object
    supplier.supplierBanksList = new Array();

    statuss = httpGetRequest("supplierstatus/all")
    fillSelectField(select_status,"",statuss,"name","Active");
    supplier.supplier_status_id = JSON.parse(select_status.value);

    //disabled status field
    $('#select_status').css('pointer-events', 'none');


    //empty text field
    txt_supname.value="";
    txt_supmobile.value="";
    txt_supmail.value="";
    txt_supaddress.value="";
    txt_supweb.value="";
    txt_supbrn.value="";
    txt_supagename.value="";
    txt_supagemobile.value="";
    txt_supagemail.value="";

    //set defaulst style
    setStyle("2px solid #fff");

    refreshInnerSection1();
    refreshInnerSection2();

    disabledButton(true,false);

}

const setStyle = (style) =>{
    txt_supname.style.borderBottom = style;
    txt_supmobile.style.borderBottom = style;
    txt_supmail.style.borderBottom = style;

    if (supplier.address != undefined){
        txt_supaddress.style.borderBottom = style;
    }else {
        txt_supaddress.style.borderBottom = "1px solid #fff";
    }


    txt_supweb.style.borderBottom = style;
    txt_supbrn.style.borderBottom = style;
    txt_supagename.style.borderBottom = style;
    txt_supagemobile.style.borderBottom = style;
    txt_supagemail.style.borderBottom = style;
}

const CheckErrors = () =>{
    let errors = "";

    if(supplier.name == null){
        errors = errors+"Please enter Supplier Name..<br>";
        txt_supname.style.borderBottom="2px solid red";
    }

    if(supplier.email == null){
        errors = errors+"Please enter Supplier Mail..<br>";
        txt_supmail.style.borderBottom="2px solid red";
    }

    if(supplier.number == null){
        errors = errors+"Please enter Supplier Mobile..<br>";
        txt_supmobile.style.borderBottom="2px solid red";
    }

    if(supplier.address == null){
        errors = errors+"Please enter Supplier Address..<br>";
        txt_supaddress.style.borderBottom="2px solid red";
    }

    if(supplier.brn == null){
        errors = errors+"Please enter Supplier BRN..<br>";
        txt_supbrn.style.borderBottom="2px solid red";
    }

    if(supplier.agent_name == null){
        errors = errors+"Please enter Supplier Agent Name..<br>";
        txt_supagename.style.borderBottom="2px solid red";
    }

    if(supplier.agent_email == null){
        errors = errors+"Please enter Supplier Agent email..<br>";
        txt_supagemail.style.borderBottom="2px solid red";
    }

    if(supplier.agent_phone == null){
        errors = errors+"Please enter Supplier Agent Phone..<br>";
        txt_supagemobile.style.borderBottom="2px solid red";
    }



    if(supplier.supplierItemBrandCategoriesList.length == 0){
        errors = errors+"Supplier Item category Brand Not Set..<br>";

    }

    if(supplier.supplierBanksList.length == 0){
        errors = errors+"Supplier Bank Details Not Set..<br>";

    }

    return errors;


}

const buttonAddMc = () =>{
    let errors = CheckErrors();


    if(errors == ""){

        //Show the confirmation box when the Add button is clicked
        iziToast.show({
            theme: 'dark',
            title: "Are You Suer To Add Following Supplier ..?",
            message: "Supplier Name: " + supplier.name,
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

                    $.ajax("/supplier",{
                        async : false,
                        type:"POST",//Method
                        data:JSON.stringify(supplier),//data that pass to backend
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
                            title: 'Supplier Add Successfully',
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
                        tabSwitchForm(supplier_table,supplier_form);
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

const refreshInnerSection1 = () => {
    //innerForm
    supplierbrandcategory = new Object();
    old_supplierbrandcategory = null;

    brands = httpGetRequest("/itembrand/all")
    fillSelectField(select_brand, "", brands, "name", "");


    categories = httpGetRequest("/itemcategory/all");
    fillSelectField(select_cat, "", categories, "name", "");

    //reset style after refresh
    select_brand.style.borderBottom = "1px solid #fff"
    select_cat.style.borderBottom = "1px solid #fff"


    //innerTable
    let displayPropertyList = ['item_brand_id.name', 'item_category_id.name'];
    let displayPropertyDataList = ['object', 'object'];
    let inerLoguserPrivilageForModule = {
        "delete_permission": true,
        "insert_permission": true,
        "select_permission": true,
        "update_permission": true
    }

    //fill data in to function
    fillTable(sup_innertbl1, supplier.supplierItemBrandCategoriesList, displayPropertyList, displayPropertyDataList, innerFormReFill1, innerRowDelete1, innerRowView1, true, inerLoguserPrivilageForModule);

    //hide edit and view button
    for (let index in supplier.supplierItemBrandCategoriesList) {
        sup_innertbl1.children[1].children[index].children[3].children[0].style.display = "none";
        sup_innertbl1.children[1].children[index].children[3].children[1].style.display = "none";

    }
}

const innerFormReFill1 = () =>{

}
const innerRowDelete1 = (obj) =>{
    event.preventDefault();
    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: "Are You Suer To Delete Following Record..?",
        message: "Item Category: " + obj.item_category_id.name + "<br>Item Brand: " + obj.item_brand_id.name,
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
                const indexToRemove = supplier.supplierItemBrandCategoriesList.findIndex(sibc => sibc === obj);
                if (indexToRemove !== -1) {
                    supplier.supplierItemBrandCategoriesList.splice(indexToRemove, 1);
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
                refreshInnerSection1();


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
const innerRowView1 = () =>{

}

const checkInnerError1 = () =>{
    let innerError = "";

    if(supplierbrandcategory.item_category_id == null){
        innerError = innerError+"Please Select Item Category..<br>";
        select_cat.style.borderBottom="2px solid red";
    }

    if(supplierbrandcategory.item_brand_id == null){
        innerError = innerError+"Please Select Item Brand..<br>";
        select_brand.style.borderBottom="2px solid red";
    }

    return innerError;

}
const btnInnerAddMC1 = (event) =>{
    event.preventDefault();

    let innerError = checkInnerError1();

    if (innerError == ""){

        let catagorybybrandExists = false;
        for (let index in supplier.supplierItemBrandCategoriesList) {
            let category = supplier.supplierItemBrandCategoriesList[index].item_category_id.name;
            let brand = supplier.supplierItemBrandCategoriesList[index].item_brand_id.name;

            if (supplierbrandcategory.item_category_id.name === category && supplierbrandcategory.item_brand_id.name ===brand) {
                catagorybybrandExists = true;
                break;
            }
        }

        if (catagorybybrandExists) {
            iziToast.error({
                title: 'Error : Item Category and Item Brand Already Exist',
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
                message: "Item Category: " + supplierbrandcategory.item_category_id.name + "<br>Item Brand: " + supplierbrandcategory.item_brand_id.name,
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
                        supplier.supplierItemBrandCategoriesList.push(supplierbrandcategory);
                        iziToast.success({
                            theme: 'dark',
                            title: 'Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 1000,
                            closeOnClick: true,

                        });
                        refreshInnerSection1();


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
    }else{
        iziToast.error({
            title: 'You Have Following Error',
            message: innerError,
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
const refreshInnerSection2 = () =>{
    //innerForm
    supplierbank = new Object();
    old_supplierbank = null;

    banks = httpGetRequest("/bank/all")
    fillSelectField(select_bank,"",banks,"name","");

    //empty field after refresh
    txt_holdername.value='';
    txt_accountnum.value="";
    txt_acountbranch.value="";


    //reset style
    txt_holdername.style.borderBottom = "1px solid #fff"
    txt_accountnum.style.borderBottom = "1px solid #fff"
    txt_acountbranch.style.borderBottom = "1px solid #fff"
    select_bank.style.borderBottom = "1px solid #fff"


    //innerTable
    let displayPropertyList = ['bank_id.name','accountnumber', 'branchname','holdername'];
    let displayPropertyDataList = ['object','text','text','text'];
    let inerLoguserPrivilageForModule ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}

    //fill data in to function
    fillTable(sup_innertbl2,supplier.supplierBanksList, displayPropertyList, displayPropertyDataList,innerFormReFill2,innerRowDelete2,innerRowView2,true,inerLoguserPrivilageForModule);

    //hide edit and view button
    for (let index in supplier.supplierBanksList) {
        sup_innertbl2.children[1].children[index].children[5].children[0].style.display = "none";
        sup_innertbl2.children[1].children[index].children[5].children[1].style.display = "none";

    }
}

const innerFormReFill2 = () =>{

}
const innerRowDelete2 = (obj) =>{
    event.preventDefault();
    //Show the confirmation box when the delete button is clicked
    iziToast.show({
        theme: 'dark',
        title: "Are You Suer To Delete Following Record..?",
        message: "Supplier Bank: " + obj.bank_id.name,
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
                const indexToRemove = supplier.supplierBanksList.findIndex(sb => sb === obj);
                if (indexToRemove !== -1) {
                    supplier.supplierBanksList.splice(indexToRemove, 1);
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
                refreshInnerSection2();


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
const innerRowView2 = () =>{

}

const checkInnerError2 = () =>{
    let innerError = "";

    if(supplierbank.bank_id == null){
        innerError = innerError+"Please Select Bank..<br>";
        select_bank.style.borderBottom="2px solid red";
    }

    if(supplierbank.holdername == null){
        innerError = innerError+"Please Enter Valid Holder Name..<br>";
        txt_holdername.style.borderBottom="2px solid red";
    }

    if(supplierbank.branchname == null){
        innerError = innerError+"Please Enter Valid Branch Name..<br>";
        txt_acountbranch.style.borderBottom="2px solid red";
    }

    if(supplierbank.accountnumber == null){
        innerError = innerError+"Please Enter Valid Branch Name..<br>";
        txt_accountnum.style.borderBottom="2px solid red";
    }

    return innerError;

}
const btnInnerAddMC2 = (event) =>{
    console.log(supplierbank)
    event.preventDefault();

    let innerError = checkInnerError2();

    if (innerError == ""){
        let supplieBank = false;
        for (let index in supplier.supplierBankList) {
            let bank = supplier.supplierBankList[index].item_category_id.name;
            let accno = supplier.supplierBankList[index].accountnumber.name;

            if (supplierbank.bank_id.name === bank && supplierbank.accountnumber ===accno) {
                supplieBank = true;
                break;
            }
        }

        if (supplieBank) {
            iziToast.error({
                title: 'Error : Supplier Bank details alread exsits',
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
                title: "Are You Suer To Add Following Record..?",
                message: "Bank: " + supplierbank.bank_id.name + "<br>Account No: " + supplierbank.accountnumber,
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
                        supplier.supplierBanksList.push(supplierbank);
                        iziToast.success({
                            theme: 'dark',
                            title: 'Successfully',
                            position: 'topRight',
                            overlay: true,
                            displayMode: 'once',
                            zindex: 999,
                            animateInside: true,
                            closeOnEscape:true,
                            timeout: 1000,
                            closeOnClick: true,

                        });
                        refreshInnerSection2();


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
    }else{
        iziToast.error({
            title: 'You Have Following Error',
            message: innerError,
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
