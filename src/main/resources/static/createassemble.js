//Function for browser onload event

window.addEventListener('load', refreshBrowser);

function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=Create Assemble")

    refreshTable();
    refreshForm();

}

const refreshTable = () =>{
    processors = httpGetRequest("/processor/listforassemble")
    fillSelectFieldtwoproperty(select_pro,"",processors,"pcode","pname","");
}

const getPrice = (namefieldid,pricefieldid) =>{
    if (namefieldid.value != ''){
        pricefieldid.value = parseFloat(JSON.parse(namefieldid.value).sale_price).toFixed(2);
    }
}

const getMotherboardAcccToProcessor = () =>{
    motherboards = httpGetRequest("/motherboard/listforassemble/" + JSON.parse(select_pro.value).pro_socket_id.id);
    fillSelectFieldtwoproperty(select_mb,"",motherboards,"code","name","");

}

const getRamAcccToProcessorAndMB = () =>{
    if (select_pro.value != "" && select_mb.value != ""){
        rams = httpGetRequest("/rams/listforassemble/" + JSON.parse(select_pro.value).id +"/"+JSON.parse(select_mb.value).id);
        fillSelectFieldtwoproperty(select_ram,"",rams,"rcode","rname","");

    }
}

//genarate ram row
function generateRow() {

    let existingRows = document.getElementsByClassName("ramgen");
    console.log(existingRows)
    let maxRamSlots = JSON.parse(select_mb.value).memory_slots - 1;

    let maxMeory = JSON.parse(select_mb.value).max_memory;

    if (existingRows.length > maxRamSlots) {
        // Do not add more rows if the limit (6 rows) is reached
        return;
    }
    // Clone the "ramRow" div
    let ramRow = document.getElementById("ramRow");
    let newRow = ramRow.cloneNode(true);

    // Clear the selected value of the cloned "ramRow" select element
    newRow.querySelector("#select_ram").selectedIndex = 0;
    newRow.querySelector("#ramamount").value = "";

    // Add the cloned "ramRow" div just before the "stRow" div
    let stRow = document.getElementById("stRow");
    stRow.parentNode.insertBefore(newRow, stRow);

    // Manually trigger the onchange event for the newly generated row's select element
    let selectRamElement = newRow.querySelector("#select_ram");
    let ramAmountElement = newRow.querySelector("#ramamount");
    getPrice(selectRamElement, ramAmountElement);

    // Trigger the onchange event for the select element
    let event = new Event("change");
    selectRamElement.dispatchEvent(event);
}

//genarate stoage row
function generateRow1() {

    if (select_mb.value != ""){
        let existingRows = document.getElementsByClassName("stgen");
        let maxstSlots = JSON.parse(select_mb.value).sata6gbs + JSON.parse(select_mb.value).sata3gbs + JSON.parse(select_mb.value).m2_port -1;
        console.log(maxstSlots);


        if (existingRows.length > maxstSlots) {
            // Do not add more rows if the limit (6 rows) is reached
            return;
        }
        // Clone the "ramRow" div
        let stRow = document.getElementById("stRow");
        let newRow = stRow.cloneNode(true);

        // Clear the selected value of the cloned "ramRow" select element
        newRow.querySelector("#select_storge").selectedIndex = 0;
        newRow.querySelector("#stamount").value = "";

        // Add the cloned "ramRow" div just before the "stRow" div
        let vgaRow = document.getElementById("vgaRow");
        vgaRow.parentNode.insertBefore(newRow, vgaRow);

        // Manually trigger the onchange event for the newly generated row's select element
        let selectSTElement = newRow.querySelector("#select_storge");
        let stAmountElement = newRow.querySelector("#stamount");
        getPrice(selectSTElement, stAmountElement);

        // Trigger the onchange event for the select element
        let event = new Event("change");
        selectSTElement.dispatchEvent(event);

    }


}

const getStorageAcccToMB = () =>{
    if (select_mb.value != ""){
        storages = httpGetRequest("/storage/listforassemble");
        fillSelectFieldtwoproperty(select_storge,"",storages,"code","name","");

    }
}

const getVgaAccToMB = () =>{
    if (select_mb.value != ""){
        if (JSON.parse(select_mb.value).pciex16v4 != 0 && JSON.parse(select_mb.value).pciex16v5 != 0){

            vgas = httpGetRequest("vga/listforassemble");
            fillSelectFieldtwoproperty(select_vga,"",vgas,"vcode","vname","");

        }

        if (JSON.parse(select_mb.value).pciex16v4 != 0 && JSON.parse(select_mb.value).pciex16v5 == 0){

            vgas = httpGetRequest("vga/listforassemblev4");
            fillSelectFieldtwoproperty(select_vga,"",vgas,"vcode","vname","");

        }

        if (JSON.parse(select_mb.value).pciex16v4 == 0 && JSON.parse(select_mb.value).pciex16v5 != 0){

            vgas = httpGetRequest("vga/listforassemblev5");
            fillSelectFieldtwoproperty(select_vga,"",vgas,"vcode","vname","");

        }
    }
}

const getCoolerAcctoMB = () =>{
    if (select_mb.value != ""){
        coolers = httpGetRequest("/cooler/listforassemble");
        fillSelectFieldtwoproperty(select_cooler,"",coolers,"cooler_code","name","");

    }
}

const getPSUAcctoMBAndVga = () =>{
    if (select_mb.value != "" && select_vga.value != ""){
        psu = httpGetRequest("/psu/listforassemble");
        fillSelectFieldtwoproperty(select_psu,"",psu,"pscode","psname","");

    }
}

const getCaseAcctoMB = () =>{
    if (select_mb.value != ""){
        cases = httpGetRequest("/casing/listforassemble");
        fillSelectFieldtwoproperty(select_case,"",cases,"casing_code","casing_name","");

    }
}


const refreshForm = () => {
  assemble = new Object();
  oldassemble = null;

}

const checkErrors = () => {
    let errors = "";

        if (assemble.processor_id == null) {
            errors = errors + "Processor Not Selected<br>";
            select_pro.style.borderBottom = "1px solid red";
        }

        if (assemble.motherboard_id == null) {
            errors = errors + "Motherboard Not Selected<br>";
            select_mb.style.borderBottom = "1px solid red";
        }

        if (assemble.ram_id == null) {
            errors = errors + "RAM Not Selected<br>";
            select_ram.style.borderBottom = "1px solid red";
        }

        if (assemble.vga_id == null) {
            errors = errors + "Vga Not Selected<br>";
            select_vga.style.borderBottom = "1px solid red";
        }

        if (assemble.casing_id == null) {
            errors = errors + "Casing Not Selected<br>";
            select_case.style.borderBottom = "1px solid red";
        }

        if (assemble.storage_id == null) {
            errors = errors + "Storage Not Selected<br>";
            select_storge.style.borderBottom = "1px solid red";
        }


        if (assemble.cooler_id == null) {
            errors = errors + "Cooler Not Selected<br>";
            select_cooler.style.borderBottom = "1px solid red";
        }

        if (assemble.powersupply_id == null) {
            errors = errors + "PSU Not Selected<br>";
            select_psu.style.borderBottom = "1px solid red";
        }

        return errors;
}

const getTotal =()=>{
    let priceList = document.getElementsByClassName("itemprice");
    console.log(priceList)
    let totalAmount = 0.00;
    for (let i=0; i< priceList.length ;i++){
        totalAmount = parseFloat(totalAmount) + parseFloat(priceList[i].value)
    }
    texttotalAmount.value = totalAmount
    assemble.totalamount = texttotalAmount.value;
}
const buttonAddMc = () =>{

    let errors = checkErrors();
        if(errors == ""){
            //Show the confirmation box when the Add button is clicked
            iziToast.show({
                theme: 'dark',
                title: "Are You Suer To Add Following Assemble..?",
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
                        console.log(assemble);

                        let post_server_responce;

                        $.ajax("/assemble",{
                            async : false,
                            type:"POST",//Method
                            data:JSON.stringify(assemble),//data that pass to backend
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
                                title: 'Assemble Add Successfully',
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
        }
        else{
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


