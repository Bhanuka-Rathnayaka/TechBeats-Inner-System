package com.bitproject.techbeats.login.controller;

import com.bitproject.techbeats.login.model.LoggeUser;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.privilage.repository.ModuleRepository;
import com.bitproject.techbeats.privilage.repository.PrivilageRepository;
import com.bitproject.techbeats.user.Roles;
import com.bitproject.techbeats.user.RolesRepository;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.cert.CertPathValidatorResult;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class LoginCotroller {

    @Autowired
    private RolesRepository rolesDao;
    @Autowired
    private PrivilageRepository privilageDao;

    @Autowired
    private PrivilageControl privilageController;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private ModuleRepository moduleDao;

   @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @RequestMapping(value = "/dashboard",method = RequestMethod.GET)
    public ModelAndView welcome(){
        ModelAndView dashboardUI = new ModelAndView();
        dashboardUI.setViewName("index.html");
        return dashboardUI;
    }

    @GetMapping(value = "/createadmin")
    public String createAdmin(){
        User extadminuser = userDao.findUserByUsername("Admin");
        if(extadminuser == null){
            User newAdminUser = new User();

            newAdminUser.setUser_name("Admin");
             newAdminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
            newAdminUser.setEmail("admin@gmail.com");
            newAdminUser.setStatus(true);
            newAdminUser.setAdddatetime(LocalDateTime.now());

            //roles set
            Set<Roles> userrole = new HashSet<>();
            userrole.add(rolesDao.getReferenceById(1));
            newAdminUser.setRoles(userrole);

            userDao.save(newAdminUser);

        }
        return "<script>window.location.replace('/login');</script>";
    }


    @GetMapping(value = "/login")
    public ModelAndView LoginUi(){
        ModelAndView loginUi = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null || auth instanceof AnonymousAuthenticationToken){
            SecurityContextHolder.clearContext();
        }
        loginUi.setViewName("login.html");
        return loginUi;
    }

    @GetMapping(value = "/login",params = "error")
    public ModelAndView LoginErrorUi(@RequestParam("error") String error){
        ModelAndView loginUi = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       if(auth != null || auth instanceof AnonymousAuthenticationToken){
           SecurityContextHolder.clearContext();
       }
        loginUi.setViewName("login.html");
        return loginUi;
    }



    @GetMapping(value = "/accessdenied")
    public ModelAndView accessDenied(){
        ModelAndView accessdenied = new ModelAndView();
        accessdenied.setViewName("404.html");
        return accessdenied;
    }

    //hide nav bar from user
    @GetMapping(value = "/modulename/byuser/{username}")
    public List getModuleNmeByUser(@PathVariable("username") String username){
        return moduleDao.getByUser(username);
    }

    //get privilage object by logged user for given module name [/userprivilage/bymodule?modulename =employee]
    @GetMapping(value = "/userprivilage/bymodule" ,params = {"modulename"},produces = "application/json")
    public HashMap <String,Boolean> getPrivilageByModule(@RequestParam("modulename") String modulename){

        //get logged user authentication Object by security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)

        HashMap <String,Boolean> userPrivilage = new HashMap<>();//create empty hashmap object

        if (auth == null || auth instanceof AnonymousAuthenticationToken) {
            userPrivilage.put("select_permission",false);
            userPrivilage.put("insert_permission",false);
            userPrivilage.put("update_permission",false);
            userPrivilage.put("delete_permission",false);
            return userPrivilage;
        }else {

            return privilageController.getPrivilageByUserModule(auth.getName(),modulename);
//            User loguser = userDao.findUserByUsername(auth.getName());
//            if (loguser.getUser_name().equals("Admin")){
//                userPrivilage.put("select_permission",true);
//                userPrivilage.put("insert_permission",true);
//                userPrivilage.put("update_permission",true);
//                userPrivilage.put("delete_permission",true);
//                return userPrivilage;
//            }else {
//                String stringUserPrivilage =  privilageDao.getPrivilageByUserModule(loguser.getUser_name(),modulename);//1,1,1,1
//                String[] userprivilagearray = stringUserPrivilage.split(",");///[1,1,1,1]
//
//                userPrivilage.put("select_permission",userprivilagearray[0].equals("1"));
//                userPrivilage.put("insert_permission",userprivilagearray[1].equals("1"));
//                userPrivilage.put("update_permission",userprivilagearray[2].equals("1"));
//                userPrivilage.put("delete_permission",userprivilagearray[3].equals("1"));
//
//                return userPrivilage;
//            }
        }

    }


    //get logged user
    @GetMapping(value = "/loguser",produces = "application/json")
    public LoggeUser getLoggedUserDetails(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logExtUser = userDao.findUserByUsername(auth.getName());

        if(logExtUser != null && !(auth instanceof AnonymousAuthenticationToken)){
            LoggeUser loggeUser = new LoggeUser();

            String username = logExtUser.getUser_name();
            loggeUser.setUsername(username);

            String role = logExtUser.getRoles().iterator().next().getName();
            loggeUser.setRole(role);

            loggeUser.setPhotoname(logExtUser.getPhotoname());
            loggeUser.setPhotopath(logExtUser.getPhotopath());

            return loggeUser;
        }else {
            return null;
        }
    }

}



