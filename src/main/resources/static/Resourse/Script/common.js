const httpGetRequest = (url) => {
    let responce_data = new Array();
    $.ajax(url,{
        async:false,
        dataType:'json',
        success: function (data,status,xhr){
            responce_data = data;
        },
        error:function(rxhrdata,errorstatus,errorMessage){
            responce_data = [];
        }
    })

    return responce_data;
}



//field validator
const textFieldValidator = (feildid, pattern, object, property,oldObject) => {


    let ob = window[object];
    //console.log(ob);
    let old_ob =window[oldObject];
    //console.log(oldObject);

    if (feildid.value != "") {
        const namepattern = new RegExp(pattern);

        if (namepattern.test(feildid.value)) {
            ob[property] = feildid.value;

            //console.log(ob[property]);
            //console.log(old_ob[property]);
            
            if (old_ob != null && ob[property] != old_ob[property] ) {
              //update
              feildid.style.borderBottom = '2px solid orange';
            }else{
                feildid.style.borderBottom = '2px solid green';
            }
           
        } else {
            ob[property] = null;
           
            feildid.style.borderBottom = '2px solid red';
        }
    } else {
        ob[property] = null;
        if (feildid.required) {
          
            feildid.style.borderBottom='2px solid red';
        } else {
           
            feildid.style.borderBottom = '1px solid #fff';
        }

    }
}

//radio validator
const radioFieldValidator = (feildid, pattern, object, property,labalId1,labalId2,oldObject,boderid) => {
    let ob = window[object];
    let old_ob = window[oldObject];
    if (feildid.checked) {
        ob[property] = feildid.value;
        //labalId1.style.color = 'green';
       // labalId2.style.color = 'white';



        if (old_ob != null && ob[property] != old_ob[property]) {
            //labalId1.style.color = 'orange';
            //labalId2.style.color = 'white';
            boderid.style.borderBottom = "1px solid orange";
            console.log(ob);
            console.log(old_ob);


        } else {
            //labalId1.style.color = 'green';
            //labalId2.style.color = 'white';
            boderid.style.borderBottom = "1px solid green";
            console.log(ob);
            console.log(old_ob);
        }
    }else {
        ob[property] = null;
        //labalId1.style.color = 'red';
        //labalId2.style.color = 'red';
        boderid.style.borderBottom = "1px solid red";

    }
}

//function for bind and validate date feild value
const dateFeildValidate = (feildid, pattern, object, property,oldObject) => {
    let ob = window[object];
    let old_ob = window[oldObject];
    
    if (feildid.value != "") {
        ob[property] = feildid.value;

        if(old_ob != null && ob[property] != old_ob[property]){
            feildid.style.borderBottom = '2px solid orange';
        }else{feildid.style.borderBottom = '2px solid green';}


        
    } else {
        ob[property] = null;
        if(feildid.required){
            feildid.style.borderBottom = '2px solid red';
        }else{
            
            feildid.style.borderBottom = '2px solid rgb(118, 118, 118)';
        }
        
       
        
    }
}


//select validator
/*const selectValidater = (feildid,pattern, object, property,oldObject) => {

    let ob = window[object];
    let old_ob = window[oldObject];
    
    if (feildid.value != "") {
        ob[property] = JSON.parse(feildid.value);


        if(old_ob != null && old_ob[property] != null && ob[property]['id'] != old_ob[property]['id']){
                feildid.style.borderBottom = '2px solid orange';

        }else if(old_ob[property]['id'] == null && ob[property]['id'] != null){
                feildid.style.borderBottom = '2px solid orange';
        }
        else{feildid.style.borderBottom = '2px solid green';}
    } else {
        ob[property] = null;
        if(feildid.required){
            feildid.style.borderBottom = '2px solid red';
        }else{
            feildid.style.borderBottom = '1px solid #fff';
        }
    }
}*/
/*const selectValidater = (fieldId, pattern, object, property, oldObject) => {
    let ob = window[object];
    let oldOb = window[oldObject];

    if (fieldId.value != "") {
        ob[property] = JSON.parse(fieldId.value);

        if (oldOb != null && oldOb[property] != null && oldOb[property]['id'] != ob[property]['id']) {
            fieldId.style.borderBottom = '2px solid orange';
        } else {
            fieldId.style.borderBottom = '2px solid green';
        }
    } else {
        ob[property] = null;
        if (fieldId.required) {
            fieldId.style.borderBottom = '2px solid red';
        } else {
            fieldId.style.borderBottom = '1px solid #fff';
        }
    }
}*/
const selectValidater = (fieldId, pattern, object, property, oldObject) => {
    let ob = window[object];
    let oldOb = window[oldObject];

    if (fieldId.value != "") {
        ob[property] = JSON.parse(fieldId.value);

        if (oldOb != null && oldOb[property] != null && oldOb[property]['id'] != ob[property]['id']) {
            fieldId.style.borderBottom = '2px solid orange';
        } /*else if (oldOb == null && ob[property]['id']) {
            console.log("111")
            fieldId.style.borderBottom = '2px solid green';
        }*/else if(oldOb != null && oldOb[property] == null && ob[property]['id']){

            fieldId.style.borderBottom = '2px solid orange';
        } else {

            fieldId.style.borderBottom = '2px solid green';
        }
    } else {
        ob[property] = null;
        if (fieldId.required) {
            fieldId.style.borderBottom = '2px solid red';
        } else {
            fieldId.style.borderBottom = '1px solid #fff';
        }
    }
}

const selectValidater1 = (fieldId, pattern, object, property, oldObject,getProp) => {
    let ob = window[object];
    let oldOb = window[oldObject];

    if (fieldId.value != "") {
        ob[property] = JSON.parse(fieldId.value)[getProp];

        if (oldOb != null && oldOb[property] != null && oldOb[property]['id'] != ob[property]['id']) {
            fieldId.style.borderBottom = '2px solid orange';
        } /*else if (oldOb == null && ob[property]['id']) {
            console.log("111")
            fieldId.style.borderBottom = '2px solid green';
        }*/else if(oldOb != null && oldOb[property] == null && ob[property]['id']){

            fieldId.style.borderBottom = '2px solid orange';
        } else {

            fieldId.style.borderBottom = '2px solid green';
        }
    } else {
        ob[property] = null;
        if (fieldId.required) {
            fieldId.style.borderBottom = '2px solid red';
        } else {
            fieldId.style.borderBottom = '1px solid #fff';
        }
    }
}




//Check validator
const checkBoxValidator = (fieldid,pattern,object,property,oldobject,lblid,trueMsg,falseMsg) => {
    let ob = window[object];
    let oldob = window[oldobject];

    if (fieldid.checked) {
        ob[property] = true;
        if(trueMsg != ""){
            lblid.innerText = "";
            lblid.innerText = trueMsg;
            if (oldob != null && ob[property] != oldob[property]) {
                // lblid.style.color = "orange";
            } else {
                // lblid.style.color = "green";
            }
        }


    } else {
        ob[property] = false;
        if(falseMsg != ""){
            lblid.innerText = "";
            lblid.innerText = falseMsg;
            if (oldob != null && ob[property] != oldob[property]) {
                // lblid.style.color = "orange";
            } else {
                // lblid.style.color = "green";
            }
        }

    }
}



//get current date function
const getDateFormat = (format, givenDate) =>{
    

    let today;

    if(givenDate != ""){
        today = new Date(givenDate);
    }else{
        today = new Date();//auto load current date
    }

    let month =today.getMonth() + 1 ;//return 0-11
    let date = today.getDate();//return 1-31

    if(month <10) month="0"+month;
    if(date < 10) date = "0"+date;
    let full_date = today.getFullYear()+"-"+month+"-"+date;
    let current_month = today.getFullYear()+"-"+month;
    let current_year = today.getFullYear();

    if(format == "date")return full_date;
    if(format == "month")return current_month;
    if(format == "year")return current_year;

}

//Form Section

//fill data in to form select field 

function fillSelectField(feildid,displayMg,dataList,displayProperty,selectedValue,visibality = false){

    feildid.innerHTML="";
    //placeholder

        element = document.createElement('option');
        element.value="";
        element.selected = "selected";
        element.disabled = 'disabled';
        element.innerText = displayMg;
        feildid.appendChild(element);



    //option
    for(index in dataList){
        element2 = document.createElement('option');


       //convert object in to string
        element2.value=JSON.stringify(dataList[index]);

        //element2.innerText=dataList[index][displayProperty];
        element2.innerText=getDataFromObject(dataList[index],displayProperty)

        if(getDataFromObject(dataList[index],displayProperty) == selectedValue){
            element2.selected = true;
            feildid.style.borderBottom="2px solid green"
        }

        feildid.appendChild(element2);
    }

     if(visibality)
        feildid.disabled = true;
    else
        feildid.disabled = false;



}

const fillSelectFieldtwoproperty = (feildid,displayMg,dataList,displayProperty1,displayProperty2,selectedvalue,visibality = false) =>{

    feildid.innerHTML = "";
    //placeholder
    element = document.createElement('option');
    element.selected=true;
    element.disabled=true
    element.value="";
    element.innerText=displayMg
    feildid.appendChild(element);

    //option
    for(index in dataList){
        element2 = document.createElement('option');
        //element2.value=designation[index];

        //convert object in to string
        element2.value=JSON.stringify(dataList[index]);

        element2.innerText=dataList[index][displayProperty1]+"==>"+dataList[index][displayProperty2]
        if(selectedvalue == dataList[index][displayProperty1]){
            element2.selected="selected";
        }

        feildid.appendChild(element2);


    }

    if(visibality)
        feildid.disabled = true;
    else
        feildid.disabled = false;



}

const fileFieldValidater = (fileFieldid, pattern, object, property, oldoject,
                            imgphoto, photonameField, photonameProperty) => {
    let ob = window[object];
    let oldob = window[oldoject];


    let filereader = new FileReader();
    filereader.onload = function () {
        imgphoto.src = filereader.result;
        if (photonameField != ""){
            photonameField.innerText = fileFieldid.files[0]['name'];
            photonameField.href = fileFieldid.value;

        }
        ob[property] = btoa(filereader.result);
        ob[photonameProperty] = photonameField.innerText;
        return;
    }
    filereader.readAsDataURL(fileFieldid.files[0]);
}




//Table Section

const fillTable = (tableid,dataList,propertyList,dataTypeList,modifyFunction,deleteFunction,viewFunction,buttonvisibility=true,userprivilage) => {

    //get tbody element
    tbody = tableid.children[1];
    //console.log(tbody);
    tbody.innerHTML="";//after delete a record table must clear else it refresh and data duplicate
    
    for(index in dataList){
        
        //create tr element
        tr = document.createElement("tr");
        
        //create td element
        td_index= document.createElement("td");
        td_index.innerText=parseInt(index)+1;
        tr.appendChild(td_index);

        //

        for(pro in propertyList){
           td=document.createElement("td"); 
           let data =dataList[index][propertyList[pro]];
           // console.log(emp_datatypeList[pro]);
           
           if(dataTypeList[pro] == "text"){
                if(data == null){
                    td.innerText="-";
                }else {td.innerText=data};
           }

           else if(dataTypeList[pro] == "yearbydate"){
                if(data == null){
                    td.innerText="-";
                }else {td.innerText=new Date(data).getFullYear()};
           }

           else if(dataTypeList[pro] == "decimal"){
               if(data == null) {
                   td.innerText = "-";
               }else {
                   td.innerText=parseFloat(data).toFixed(2)
               }
           }

            else if(dataTypeList[pro] == "image"){
                
                img=document.createElement("img"); 
                img.style.width = "30px";
                img.style.height = "30px"

                if(data == null){
                    img.src = "Resourse/Images/download.png";
                }else {img.src=data};

                td.appendChild(img);
            }

            else if(dataTypeList[pro] == "object"){
                td.innerText = getDataFromObject(dataList[index],propertyList[pro]);  
               
            }

            else{
                td.innerText = dataTypeList[pro](dataList[index]);
                //console.log(dataList[index]);
            }
           
           
          
           tr.appendChild(td);
        }
       
        //create td for add modify button
        td_modify= document.createElement("td");
            
            //create button

            //create edit button
            edit_button = document.createElement("button");
          /*  edit_button.innerHTML='Edit';*/
            edit_button.innerHTML = "<i class='fas fa-edit'></i>";
            edit_button.classList.add("btn")
            edit_button.classList.add("btn-size")
            edit_button.classList.add("btn-outline-warning")

            edit_button.onclick = function (){
                //alert("Edit")
                let z = this.parentNode.parentNode.firstChild.innerHTML;
                //console.log(z);
                modifyFunction(dataList[parseInt(z)-1],parseInt(z)-1);
            };

            if (!userprivilage.update_permission){
                edit_button.disabled = true;
                edit_button.style.pointerEvents = "all";
                edit_button.style.cursor = "not-allowed"

            }else{
                edit_button.disabled = false;
                edit_button.style.pointerEvents = "all";
                edit_button.style.cursor = "pointer"
            }
            
            //create view button
            view_button = document.createElement("button");
            view_button.classList.add("btn")
            view_button.classList.add("btn-size")
            view_button.classList.add("btn-outline-info")
            view_button.style.margin="0 5px"
            /*view_button.innerHTML='View';*/
            view_button.innerHTML = "<i class='fa-solid fa-eye'></i>";


        view_button.onclick = function(event){
                //alert("View");

                let z = this.parentNode.parentNode.firstChild.innerHTML;
                //console.log(z);
                viewFunction(dataList[parseInt(z)-1],parseInt(z)-1);
            }
            
            //create delete button
            dlt_button = document.createElement("button")
            dlt_button.classList.add("btn")
            dlt_button.classList.add("btn-size")
            dlt_button.classList.add("btn-outline-danger")
            dlt_button.classList.add("delete-btn")
            /*dlt_button.innerHTML="Delete";*/
            dlt_button.innerHTML = "<i class='fas fa-trash-can'></i>";

            dlt_button.onclick = function(){
                //alert("Delete");
                let z = this.parentNode.parentNode.firstChild.innerHTML;
                deleteFunction(dataList[parseInt(z)-1],parseInt(z)-1);
            }

            if (!userprivilage.delete_permission){
                dlt_button.disabled = true;
                dlt_button.style.pointerEvents = "all";
                dlt_button.style.cursor = "not-allowed"

            }else{
                dlt_button.disabled = false;
                dlt_button.style.pointerEvents = "all";
                dlt_button.style.cursor = "pointer"
            }
        
            td_modify.appendChild(edit_button);
            td_modify.appendChild(view_button);
            td_modify.appendChild(dlt_button);
        
        
        
        if(buttonvisibility)
        tr.appendChild(td_modify);
        
        tbody.appendChild(tr);
    
    
    
    }
}

//clear select table row color
const clearTableStyle = (tableid) => {
    for (let index = 0; index <tableid.children[1].children.length; index++) {
        tableid.children[1].children[index].style.backgroundColor = "white"; 
    }
}

//get data from object using given propertypath
const  getDataFromObject = (obj,propertyPath) => {
    //console.log(obj);
    //console.log(propertyPath);

    let get = (modal,proPath) => {
        let proPaths = proPath.split(".")
        //console.log(modal[proPaths[0]]);
        //console.log(proPaths);
        

         if(proPaths.length > 1 && typeof modal[proPaths[0]] === "object"){
            //console.log(proPaths[1]);
           return get(modal[proPaths[0]],proPaths.splice(1).join('.'))
        }else{
            //console.log(modal[proPaths[0]]);
            return modal[proPaths[0]]
        }
    }
    
   let s = get(obj,propertyPath);
   return s;
}

function disabledButton(addbutton,updbutton) {

    if(addbutton && loguserPrivilageForModule.insert_permission){

        addbtn.disabled = false;
        $('#addbtn').css("pointer-events","all")
        $('#addbtn').css("cursor","pointer")

    }else{


        addbtn.disabled = true;
        $('#addbtn').css("pointer-events","all")
        $('#addbtn').css("cursor","not-allowed")
        $("#addbtn").removeClass("glow-on-hover");
        $("#addbtn").addClass("dissablebtn");


    }

    if(updbutton && loguserPrivilageForModule.update_permission){
        console.log("aaa")
        updatebtn.disabled = false;
        $('#updatebtn').css("pointer-events","all")
        $('#updatebtn').css("cursor","pointer")
        $("#updatebtn").addClass("glow-on-hover");


    }else {

        console.log("bbb")
        updatebtn.disabled = true;
        $('#updatebtn').css("pointer-events","all")
        $('#updatebtn').css("cursor","not-allowed")
        $("#updatebtn").removeClass("glow-on-hover");
        $("#updatebtn").addClass("dissablebtn");

    }

}

const tabSwitch = (tblid,formid) =>{
    tab_btn_tbl.classList.remove("active");
    tab_btn_tbl.setAttribute("tab-btn-tbl","false")

    tab_btn_form.classList.add("active");
    tab_btn_form.setAttribute("tab-btn-tbl","true")

    tblid.classList.remove("active")
    tblid.classList.remove("show")

    formid.classList.add("active")
    formid.classList.add("show")

}

const tabSwitchForm = (tblid,formid) =>{
    tab_btn_form.classList.remove("active");
    tab_btn_form.setAttribute("tab-btn-tbl","false")

    tab_btn_tbl.classList.add("active");
    tab_btn_tbl.setAttribute("tab-btn-tbl","true")

    formid.classList.remove("active")
    formid.classList.remove("show")

    tblid.classList.add("active")
    tblid.classList.add("show")

}


