function logoutMC(){
    let userconfirm = window.confirm("are you suer want to log out...? \n");
    if(userconfirm){
        window.location.replace("/logout")
    }else {
        window.location.replace("/dashboard")
    }
}

window.addEventListener("load",ex => {
    let loggeduser = httpGetRequest("/loguser")
    if (loggeduser != null){
        uname.innerText = loggeduser.username;
        role.innerText = loggeduser.role;
        logimage.src = loggeduser.photopath + loggeduser.photoname;

        let moduleList = httpGetRequest("/modulename/byuser/"+loggeduser.username)

        for (let index in moduleList){
            document.getElementById(moduleList[index]).remove();
        }

    }else {
        window.location.replace("/login")
    }

})