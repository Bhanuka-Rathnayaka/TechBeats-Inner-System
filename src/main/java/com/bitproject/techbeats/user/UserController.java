package com.bitproject.techbeats.user;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.supplierpayment.model.SupplierPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "user")
public class UserController {
    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    //loadui
    @GetMapping()
    public ModelAndView userView(){
        ModelAndView userUi = new ModelAndView();
        userUi.setViewName("user.html");
        return userUi;
    }

    //create mapping for get user all details("/user/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<User> userList(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageDao.getPrivilageByUserModule(auth.getName(),"User");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return userDao.findAll();
        }else{
            List<User> userList = new ArrayList<>();
            return userList;
        }


    }

    //Delete user mapping
    @DeleteMapping
    public String deleteUser(@RequestBody User user){
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageDao.getPrivilageByUserModule(auth.getName(),"User");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check exist
            User ext_user = userDao.getReferenceById(user.getId());
            if(ext_user != null){
                try {
                    //set auto insert value
                    ext_user.setDeletedatetime(LocalDateTime.now());
                    ext_user.setStatus(false);
                    userDao.save(ext_user);
                    return "0";

                }catch (Exception e){
                    return "Delete Not Complete: "+e.getMessage();
                }
            }else {
                return "Delete Not Complete:User Not Exist";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }



    }

    @PostMapping
    public String postUser (@RequestBody User user){///(get data in url but post put delete come from body)
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loguser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userprivilage = privilageDao.getPrivilageByUserModule(auth.getName(),"user");

        if (loguser != null && userprivilage.get("insert_permission")){
            //check duplicate
            User extUserByEmp = userDao.getUserByEmployee(user.getEmployee_id().getId());
            if(extUserByEmp != null){
                return "Save not complete : Employee have user account";
            }

            try{
                user.setAdddatetime(LocalDateTime.now());
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                user.setPhotoname("abc.png");
                user.setPhotopath("Resourse/Images/");

                //save operator
                userDao.save(user);

                //need update dependency module

                return "0";
            }catch(Exception e){
                return "User Add not completed : "+e.getMessage();
            }
        }else {
            return "User Add Not Complete : You Don't Have Privilege";
        }



    }

    @PutMapping
    public String putUser (@RequestBody User user){
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageDao.getPrivilageByUserModule(auth.getName(),"User");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            //check duplicate
            User extuser = userDao.getReferenceById(user.getId());
            if(extuser != null){
                try{
                    user.setUpdatedatetime(LocalDateTime.now());
                    user.setPassword(extuser.getPassword());
                    //save operator
                    userDao.save(user);

                    //need update dependency module

                    return "0";
                }catch(Exception e){
                    return "User Update not completed : "+e.getMessage();
                }

            }else{
                return "Update not complete : User not exsist";
            }


        }else {
            return "Update not complete : You dont have permission";
        }


    }
}


