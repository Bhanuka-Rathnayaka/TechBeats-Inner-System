//Function for browser onload event
window.addEventListener('load', refreshBrowser);

//Create function for browser onload event
function refreshBrowser() {
    //get log user privilege object for current module
    loguserPrivilageForModule = httpGetRequest("/userprivilage/bymodule?modulename=processor")

    refreshTable();
    refreshForm();


}

//define refresh table
const refreshTable = () =>{
    //array for store processor data
    processor = new Array();
    processor=httpGetRequest("/processor/all")

    //create display property list
    let display_property_list = ["pcode","pname","ramTypes","pro_status_id.name","purchase_price","sale_price"]

    //cretae display property type list
    let display_property_datatype = ["text","text",getSupportRamType,"object","text","text"]

    //calling fillTable function
    fillTable(tbl_processor,processor,display_property_list,display_property_datatype,formReFill,rowDelete,rowView,true,loguserPrivilageForModule)

    for (let index in processor){
        if (processor[index].pro_status_id.name == "Removed"){
            tbl_processor.children[1].children[index].children[7].children[2].disabled = true;
        }
    }

    //To add jquery table
    $('#tbl_processor').dataTable();
}



const formReFill = (obj) =>{

    processor = httpGetRequest('/processor/getbyid/'+obj.id)
    old_processor = httpGetRequest('/processor/getbyid/'+obj.id)

    //set value to text field
    txt_pname.value =processor.pname
    txt_purchprice.value = processor.purchase_price;
    txt_profitrate.value =processor.profit_rate;
    txt_saleprice.value = processor.sale_price;
    txt_warrenty.value = processor.warrenty;

    //set value to select field
    fillSelectField(select_brand,"",brand,"name",processor.item_brand_id.name);
    fillSelectField(select_collection,"",collection,"name",processor.pro_collection_id.name);
    fillSelectField(select_number,"",number,"name",processor.pro_number_id.name);
    fillSelectField(select_status,"",statuss,"name",processor.pro_status_id.name);
    fillSelectField(select_prosocket,"",prosockets,"name",processor.pro_socket_id.name);



    ramtypelist.innerHTML="";
    
    for(let index in porocessor_ramtype_list){
        div_ramtype = document.createElement("div");
        div_ramtype.classList.add("form-check");
        input_checkbox= document.createElement("input");
        input_checkbox.type="checkbox";
        input_checkbox.value = index;
        input_checkbox.classList.add("form-check-input");

        input_checkbox.onchange = function() {
            if(this.checked){
                //console.log("checkedd");
                // console.log(this.value);
                processor.ramTypes.push(porocessor_ramtype_list[this.value])

            }else{
                for (let index in user.userRoles){
                    if (processor.ramTypes[index]["name"]==porocessor_ramtype_list[this.value]["name"]){
                        processor.ramTypes.splice(index,1)
                    }

                }
            }
        }

        if(processor.ramTypes.length != 0){
            let extindex = processor.ramTypes.map(e => e.name).indexOf(porocessor_ramtype_list[index]['name']);

            if(extindex != -1){
                input_checkbox.checked = true
            }
        }

        lable = document.createElement("lable");
        lable.classList.add("form-check-label");
        lable.innerHTML = porocessor_ramtype_list[index]['name'];


        div_ramtype.appendChild(input_checkbox);
        div_ramtype.appendChild(lable);
        ramtypelist.appendChild(div_ramtype);
    }


    setStyle("2px solid green");

    disabledButton(false,true);
}

const rowDelete = (obj) => {
    let dlt_msg = "Are you suer want to delete following Processor? \n" +
        "Processor Code = " + obj.pcode + "\n" +
        "Processor name =" + obj.pname;

    let response = window.confirm(dlt_msg);
    if (response) {

        let delete_server_responce;

        $.ajax("/processor", {
            async: false,
            type: "DELETE",//Method
            data: JSON.stringify(obj),//data that pass to backend
            contentType: "application/json",
            success: function (succsessResData, successStatus, resObj) {
                delete_server_responce = succsessResData;
            }, error: function (errorResOb, errorStatus, errorMsg) {
                delete_server_responce = errorMsg;
            }
        })
        if (delete_server_responce == "0") {

            alert("delete ok")
            refreshTable();

        } else {

            window.alert("you have follwing error \n" + delete_server_responce)
        }

    }
}

const rowView = (obj) =>{
    printPro = new Object();
    printPro = httpGetRequest('/processor/getbyid/'+obj.id)

    td_code.innerHTML = printPro.pcode;
    td_name.innerHTML = printPro.pname;
    td_status.innerHTML = printPro.pro_status_id.name;
    td_pprice.innerHTML = printPro.purchase_price;
    td_sprice.innerHTML = printPro.sale_price;
    td_date.innerHTML = printPro.adddatetime;
    $('#proViewModel').modal('show')
}

const ramPrintModel = () => {
    let newWindow = window.open();
    newWindow.document.write(
        '<link rel="stylesheet" href="Resourse/bootstrap/css/bootstrap.min.css">'
        +"<h2>Processor Details</h2>"
        + proPrintTbl.outerHTML);
    //newWindow.print();
    setTimeout(function() {
        newWindow.print();
    },100)
}

const getSupportRamType = (obj) =>{
    let ram_type_list = httpGetRequest("/ramtype/bypid/"+obj.id);
    let ramtypes = "";
    for (let index in ram_type_list) {
        if(ram_type_list.length -1 == index) ramtypes = ramtypes + ram_type_list[index].name;
        else ramtypes = ramtypes + ram_type_list[index].name +", ";
    }
    return ramtypes;
}

const refreshForm = () =>{
    processor = new Object();
    old_processor = null;

    processor.ramTypes = new Array();

    //create array for fill select element
    brand = new Array();
    brand = httpGetRequest("/itembrand/bycategorypro");

    collection = new Array();
    collection = httpGetRequest("/processorcollection/all");

    number = new Array();
    number = httpGetRequest("/processornumber/all")

    statuss = new Array();
    statuss = httpGetRequest("/processorstatus/all")

    prosockets = httpGetRequest("/processorsocket/all")
    fillSelectField(select_prosocket,"",prosockets,"name","")


    fillSelectField(select_brand,"",brand,"name","");
    fillSelectField(select_collection,"",collection,"name","");
    fillSelectField(select_number,"",number,"name","");
    fillSelectField(select_status,"",statuss,"name","Use");
    processor.pro_status_id = JSON.parse(select_status.value);



    //binding ram type checkbox to form

    porocessor_ramtype_list = httpGetRequest("/ramtype/all")
    ramtypelist.innerHTML="";

    for(let index in porocessor_ramtype_list){
        div_ramtype = document.createElement("div");
        div_ramtype.classList.add("form-check");
        input_checkbox= document.createElement("input");
        input_checkbox.type="checkbox";
        input_checkbox.value = index;
        input_checkbox.classList.add("form-check-input");

        input_checkbox.onchange = function() {
            if(this.checked){
                //console.log("checkedd");
                // console.log(this.value);
                processor.ramTypes.push(porocessor_ramtype_list[this.value])

            }else{
                for (let index in user.userRoles){
                    if (processor.ramTypes[index]["name"]==porocessor_ramtype_list[this.value]["name"]){
                        processor.ramTypes.splice(index,1)
                    }

                }
            }
        }

        if(processor.ramTypes.length != 0){
            let extindex = processor.ramTypes.map(e => e.ramTypes).indexof(porocessor_ramtype_list[index]['name']);

            console.log(extindex);
        }

        lable = document.createElement("lable");
        lable.classList.add("form-check-label");
        lable.innerHTML = porocessor_ramtype_list[index]['name'];


        div_ramtype.appendChild(input_checkbox);
        div_ramtype.appendChild(lable);
        ramtypelist.appendChild(div_ramtype);
    }

    //need to be empty all field after add

    txt_pname.value="";
    txt_purchprice.value="";
    txt_profitrate.value="";
    txt_saleprice.value="";
    txt_warrenty.value="";

    //set style to default
    setStyle("1px solid #fff")

    //set validate color to auto select field
    select_status.style.borderBottom = "1px solid green";

    disabledButton(true,false)
}

//style set to default
function setStyle(style){
    select_brand.style.borderBottom=style;
    select_collection.style.borderBottom=style;
    select_number.style.borderBottom=style;
    select_prosocket.style.borderBottom=style;
    txt_pname.style.borderBottom=style;
    select_status.style.borderBottom=style;
    txt_purchprice.style.borderBottom=style;
    txt_profitrate.style.borderBottom=style;
    txt_saleprice.style.borderBottom=style;
    txt_warrenty.style.borderBottom=style;
    bdr.style.borderBottom=style;
}

//check errors
const checkError = () =>{
    let errors = "";

    if(processor.item_brand_id == null){
        select_brand.style.borderBottom = '2px solid red';
        errors = errors + "Processor brand Not selected...  \n";
    }

    if(processor.pro_collection_id == null){
        select_collection.style.borderBottom = '2px solid red';
        errors = errors + "Processor collection Not selected...  \n";
    }

    if(processor.pro_number_id == null){
        select_number.style.borderBottom = '2px solid red';
        errors = errors + "Processor number Not selected...  \n";
    }
    if(processor.pro_socket_id == null){
        select_prosocket.style.borderBottom = '2px solid red';
        errors = errors + "Processor Socket Not selected...  \n";
    }

    if(processor.pname == null){
        txt_pname.style.borderBottom = '2px solid red';
        errors = errors + "Processor Name not Entered...  \n";
    }



    if(processor.pro_status_id == null){
        select_status.style.borderBottom = '2px solid red';
        errors = errors + "Processor Status Not selected...  \n";
    }




    if(processor.purchase_price == null){
        txt_purchprice.style.borderBottom = '2px solid red';
        errors = errors + "purchase price not Entered...  \n";
    }

    if(processor.profit_rate == null){
        txt_profitrate.style.borderBottom = '2px solid red';
        errors = errors + "profit rate not Entered...  \n";
    }


    if(processor.sale_price == null){
        txt_saleprice.style.borderBottom = '2px solid red';
        errors = errors + "Sale price not Entered...  \n";
    }

    if(processor.warrenty == null){
        txt_warrenty.style.borderBottom = '2px solid red';
        errors = errors + "Warrenty not Entered...  \n";
    }

    return errors;
}

const buttonAddMc = () =>{
    let errors = checkError();
    if(errors == ""){
        let submit_confirmMg = "are you suer to add following Processor\n"+
            "Processor name : "+processor.pname;

        let user_responce = window.confirm(submit_confirmMg);

        if(user_responce){

            let post_serverice_responce;

            $.ajax("/processor",{
                async : false,
                type:"POST",//Method
                data:JSON.stringify(processor),//data that pass to backend
                contentType:"application/json",
                success:function(succsessResData,successStatus,resObj){
                    post_serverice_responce = succsessResData;
                },error:function (errorResOb,errorStatus,errorMsg){
                    post_serverice_responce = errorMsg;
                }
            })
            if(post_serverice_responce == "0"){

                alert("Add ok")
                refreshTable();
                refreshForm();

            }else{

                alert("you have following error \n" + post_serverice_responce)
            }
        }
    }else{
        alert("You have following errors \n"+errors)
    }
}

//update

function checkUpdate(){
    let updates = "";

    if(processor != null && old_processor!= null){
        if(processor.pname != old_processor.pname){
            updates = updates + "processor name has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.pro_brand_id.name != old_processor.pro_brand_id.name){
            updates = updates + "processor Brand has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.pro_collection_id.name != old_processor.pro_collection_id.name){
            updates = updates + "processor series has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.pro_number_id.name != old_processor.pro_number_id.name){
            updates = updates + "processor type has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.pro_socket_id.name != old_processor.pro_socket_id.name){
            updates = updates + "processor Socket has changed..\n";
        }
    }



    if(processor != null && old_processor!= null){
        if(processor.pro_status_id.name != old_processor.pro_status_id.name){
            updates = updates + "processor status has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.purchase_price != old_processor.purchase_price){
            updates = updates + "processor purchase price has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.profit_rate != old_processor.profit_rate){
            updates = updates + "processor profit rate has changed..\n";
        }
    }



    if(processor != null && old_processor!= null){
        if(processor.sale_price != old_processor.sale_price){
            updates = updates + "processor sale price has changed..\n";
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.ramTypes.length != old_processor.ramTypes.length){// in here not complete
            updates=updates+"Support RAM type has changed \n"
        }
    }

    if(processor != null && old_processor!= null){
        if(processor.warrenty != old_processor.warrenty){
            updates = updates + "processor Warrenty has changed..\n";
        }
    }



    return updates;
}
const buttonUpdateMC =() =>{

    let errors = checkError();
    if(errors == ""){
        let updates = checkUpdate()
        if(updates != ""){
            //processor confirmation
            let user_responce = window.confirm("are you suer to update following Processor changes..\n"+updates);

            if(user_responce) {

                //server responce
                let update_serverice_responce;

                $.ajax("/processor", {
                    async: false,
                    type: "PUT",//Method
                    data: JSON.stringify(processor),//data that pass to backend
                    contentType: "application/json",
                    success: function (succsessResData, successStatus, resObj) {
                        update_serverice_responce = succsessResData;
                    }, error: function (errorResOb, errorStatus, errorMsg) {
                        update_serverice_responce = errorMsg;
                    }
                })
                if (update_serverice_responce == "0") {

                    alert("update ok")

                    refreshTable();
                    refreshForm();

                } else {

                    alert("update not complete:" + update_serverice_responce)
                }
            }
        }else{
            alert("Nothing to update")
        }
    }else{
        alert("You have following errors \n"+errors)
    }

}