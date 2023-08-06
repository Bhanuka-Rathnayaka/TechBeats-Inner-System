window.addEventListener('load', refreshBrowser);

function refreshBrowser() {

    item = new Object();

    categories = httpGetRequest("itemcategory/all");
    fillSelectField(select_cat,"",categories,"name","");


}

function getitem (){


    select_cat.style.borderBottom = "2px solid green";
    select_codename.style.borderBottom = "2px solid #fff";
    txt_unitprice.value = "";
    txt_unitprice.style.borderBottom = "2px solid #fff"


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

    $(".floating-label-content").tooltip('disable');
}

function itemValuBinder() {

    let itemObj = JSON.parse(select_codename.value);
    if (JSON.parse(select_cat.value).name == "Ram"){
        item.itemcode = itemObj.rcode;
        item.itemname = itemObj.rname;

    }

    if (JSON.parse(select_cat.value).name == "Processor"){
        item.itemcode = itemObj.pcode;
        item.itemname = itemObj.pname;
    }

    if (JSON.parse(select_cat.value).name == "Graphic Car"){
        item.itemcode = itemObj.vcode;
        item.itemname = itemObj.vname;
    }

    if (JSON.parse(select_cat.value).name == "Power Supply Unit"){
        item.itemcode = itemObj.pscode;
        item.itemname = itemObj.psname;
    }

    if (JSON.parse(select_cat.value).name == "Casing"){
        item.itemcode = itemObj.casing_code;
        item.itemname = itemObj.casing_name;
    }

    if (JSON.parse(select_cat.value).name == "Cooler"){
        item.itemcode = itemObj.cooler_code;
        item.itemname = itemObj.name;
    }

    if (JSON.parse(select_cat.value).name == "Storage"){
        item.itemcode = itemObj.code;
        item.itemname = itemObj.name;
    }

    select_codename.style.borderBottom = "2px solid green";

}

function getCount(){
    let serialNoList = httpGetRequest("/serielnumber/bycategoryandcode/" + JSON.parse(select_cat.value).id + "/" + item.itemcode);
    txt_unitprice.value = serialNoList.length;
    txt_unitprice.style.borderBottom = "2px solid green"
}

