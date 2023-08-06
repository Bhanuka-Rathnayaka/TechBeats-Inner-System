window.addEventListener('load', refreshBrowser);
function refreshBrowser() {

    //get log user privilege object for current module
    loguserPrivilage ={"delete_permission": true, "insert_permission": true, "select_permission": true, "update_permission": true}


    //Calling function refresh Employee Table
    //refreshTable();


}
const generateReport = () =>{



    invoiceReports = httpGetRequest("/invoicereport/bydatetype?sdate="+startdate.value+"&edate="+enddate.value+"&type="+select_type.value);
    let displayPropertyList = ['date','invoicecount','totalamount'];

    //create display property type list
    let displayPropertyDataList = ['text','text','text'];



    //calling fill data in to function
    fillTable(tbl_invreport,invoiceReports, displayPropertyList, displayPropertyDataList,formReFill,rowDelete,rowView,false,loguserPrivilage);

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
        +"<h2>Invoice Report</h2>"
        + tbl_invreport.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },1000)
}

/*/////*/
