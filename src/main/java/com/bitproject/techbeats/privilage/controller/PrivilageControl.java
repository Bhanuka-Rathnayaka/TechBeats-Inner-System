package com.bitproject.techbeats.privilage.controller;

import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.privilage.model.Privilage;
import com.bitproject.techbeats.privilage.repository.PrivilageRepository;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/privilage")
public class PrivilageControl {

    @Autowired
    private PrivilageRepository privilageDao;

    @Autowired
    private UserRepository userDao;



    //loadui
    @GetMapping()
    public ModelAndView privilageView() {
        ModelAndView privilageUi = new ModelAndView();
        privilageUi.setViewName("privilage.html");
        return privilageUi;
    }

    ////create mapping for get all privilage
    @GetMapping(value = "/all", produces = "application/json")
    public List<Privilage> privilageFindAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = getPrivilageByUserModule(auth.getName(),"Privilege");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return privilageDao.findAll();
        }else {
            List<Privilage> privilageList = new ArrayList<>();
            return privilageList;
        }

    }

    ////delete mapping
    @DeleteMapping
    public String deletePrivilage (@RequestBody Privilage privilage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = getPrivilageByUserModule(auth.getName(),"Privilege");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            Privilage extprivilage = privilageDao.getReferenceById(privilage.getId());

            if(extprivilage != null){
                try{
                    ////set auto insert value
                    extprivilage.setDeletedatetime(LocalDateTime.now());
                    extprivilage.setSelect_permission(false);
                    extprivilage.setInsert_permission(false);
                    extprivilage.setUpdate_permission(false);
                    extprivilage.setDelete_permission(false);

                    privilageDao.save(extprivilage);

                    return "0";

                }catch(Exception e){
                    return "Delete Not Complete : "+e.getMessage();
                }
            }else {
                return "Delete not complete : Privilege not exist";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }

    }

    ////post mapping
    @PostMapping
    public  String postPrivilage (@RequestBody Privilage privilage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = getPrivilageByUserModule(auth.getName(),"Privilege");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check duplicate
            Privilage extprivilage = privilageDao.getByRoleandModule(privilage.getRole_id().getId(),privilage.getModule_id().getId());

            if (extprivilage!=null){
                return "Insert Not Complete:Already exsist";
            }

            try {
                privilage.setAdduser_id(userDao.getReferenceById(10));
                privilage.setAdddatetime(LocalDateTime.now());
                privilageDao.save(privilage);
                return "0";
            }catch (Exception e){
                return "Privilege Add Not Complete : "+e.getMessage();
            }

        }else{
            return "Add not complete : You dont have permission";
        }

    }

    //get mapping service for get employee by given quary variable id[/privilage/getbyid?id=1]
    @GetMapping(value = "/getbyid",produces = "application/json")
    public Privilage getPrivilageByQpID(@RequestParam("id") Integer id){
        return privilageDao.getReferenceById(id);
    }

    ////PUT mapping
    @PutMapping
    public String updatePrivilage (@RequestBody Privilage privilage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = getPrivilageByUserModule(auth.getName(),"Privilege");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            Privilage extprivilage = privilageDao.getReferenceById(privilage.getId());
            if (extprivilage != null){
                try {

                    privilage.setUpdatedatetime(LocalDateTime.now());
                    privilageDao.save(privilage);
                    return "0";
                }catch (Exception e){
                    return "Privilege Update Not Complete : "+e.getMessage();
                }
            }else {
                return "Privilage Update Not Complete : Privilage not exist";
            }
        }else {
            return "Update not complete : You dont have permission";
        }
    }

    //////////////////////
    public HashMap <String,Boolean> getPrivilageByUserModule(String username,String modulename){
        HashMap<String,Boolean> userPrivilage = new HashMap<>();

        User loguser = userDao.findUserByUsername(username);

        if (loguser.getUser_name().equals("Admin")){
            userPrivilage.put("select_permission",true);
            userPrivilage.put("insert_permission",true);
            userPrivilage.put("update_permission",true);
            userPrivilage.put("delete_permission",true);
            return userPrivilage;
        } else {
            String stringUserPrivilage =  privilageDao.getPrivilageByUserModule(loguser.getUser_name(),modulename);//1,1,1,1
            String[] userprivilagearray = stringUserPrivilage.split(",");///[1,1,1,1]

            userPrivilage.put("select_permission",userprivilagearray[0].equals("1"));
            userPrivilage.put("insert_permission",userprivilagearray[1].equals("1"));
            userPrivilage.put("update_permission",userprivilagearray[2].equals("1"));
            userPrivilage.put("delete_permission",userprivilagearray[3].equals("1"));

            return userPrivilage;

        }

    }

}
