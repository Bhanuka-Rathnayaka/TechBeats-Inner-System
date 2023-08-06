window.addEventListener('load', refreshBrowser);

function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilage ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}


    categories = httpGetRequest("itemcategory/all");
    fillSelectField(select_cat,"",categories,"name","");
}

const generateReport = () =>{
    sellItemList = httpGetRequest("/sellitemreport/bydatetypeandcategory?cid="+JSON.parse(select_cat.value).id+"&sdate="+startdate.value+"&edate="+enddate.value);
    console.log(sellItemList);

    let displayPropertyList = ['date','itemCode','itemName','sellItemcount','itemPrice','lineTotal'];

    let displayPropertyDataList = ['text','text','text','text','text',"text"];

    //calling fill data in to function
    fillTable(tbl_sellitemreport,sellItemList, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,false,loguserPrivilage);

}

const formReFill = () =>{

}
const rowDelete = () =>{

}
const rowView = () =>{

}

const printInvoiceReport = () =>{
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'+'<script src="Resourse/Jquary/jquary.js"></script>'
        +"<h2>Sell Item Report</h2>"
        + tbl_sellitemreport.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}


