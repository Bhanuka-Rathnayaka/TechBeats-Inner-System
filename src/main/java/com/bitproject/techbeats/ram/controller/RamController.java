package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.ram.repositary.RamRepository;
import com.bitproject.techbeats.ram.repositary.RamStatusRepository;
import com.bitproject.techbeats.storage.model.Storage;
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
@RequestMapping(value = "/rams")
public class RamController {

    @Autowired
    private RamRepository ramDao;

    @Autowired
    private RamStatusRepository ramStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;



    //load ram ui
    @GetMapping()
    public ModelAndView ramView(){
        ModelAndView ramUI = new ModelAndView();
        ramUI.setViewName("rams.html");
        return ramUI;
    }


    //ram list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Ram> ramList(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Ram");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return ramDao.ramListForCo();
        }else {
            List<Ram> ramList = new ArrayList<>();
            return ramList;
        }


    }

    //Ram for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Ram> ramListPR(@PathVariable("bid") Integer bid){
        return ramDao.ramListForPR(bid);
    }

    //mb list for assemble
    @GetMapping(value = "/listforassemble/{pid}/{mid}",produces = "application/json")
    public List<Ram> mbListForAssemble(@PathVariable("pid") Integer pid,@PathVariable("mid") Integer mid){
        return ramDao.ramListForAssemble(pid,mid);
    }


    //get mapping service for get ram by given path variable id[/ram/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Ram getRamById(@PathVariable("id") Integer id){
        return ramDao.getReferenceById(id);
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Ram ramListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return ramDao.rambyitemcodename(code,name);
    }


    //create mapping for get ram all details("/rams/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<Ram> ramFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Ram");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return ramDao.findAll();
        }else {
            List<Ram> ramList = new ArrayList<>();
            return ramList;
        }
    }

    //create mapping for delete ram
    @DeleteMapping
    public String deleteRam(@RequestBody Ram ram){
        //need to check privilavge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Ram");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check ram exist
            Ram extram = ramDao.getReferenceById(ram.getId());

            if (extram != null){
                try{
                    //set auto insert value
                    extram.setDeletedatetime(LocalDateTime.now());
                    extram.setRam_status_id(ramStatusDao.getReferenceById(1));
                    extram.setDelete_user_id(logExtUser);
                    ramDao.save(extram);

                    //need to update avilable dependency

                    return "0";
                }catch(Exception e){
                    return "Delete not complete: "+e.getMessage();
                }
            }else{
                return "Delete not completed : Ram not availabal";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }


    }


    ////create mapping for post ram details("/employee")
    @PostMapping
    public String addRam(@RequestBody Ram ram){
        //need to check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Ram");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist Ram by Ram Name
            Ram extRamByName = ramDao.findRamByRname(ram.getRname());
            if(extRamByName != null) {
                return "Ram insert not complete:Ram name already exist";
            }

            try{
                //set auto insert value
                ram.setRcode(ramDao.nextRamCode());

                //set add date time
                ram.setAdddatetime(LocalDateTime.now());
                ram.setAdd_user_id(logExtUser);
                ram.setItem_category_id(itemCategoryDao.getReferenceById(1));

                //save operate
                ramDao.save(ram);
                return "0";
            }catch(Exception e){
                return "Ram insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }


    //create mapping for update employee
    @PutMapping
    public String updateRam(@RequestBody Ram ram){
        //need to check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Ram");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            //need to check duplicate colum value
            //check by ram nam
            Ram extram = ramDao.getReferenceById(ram.getId());
            if(extram != null){
                try{
                    ram.setUpdatedatetime(LocalDateTime.now());
                    ram.setUpdate_user_id(logExtUser);
                    //save operator
                    ramDao.save(ram);

                    //need update dependency module

                    return "0";
                }catch(Exception e){
                    return "Ram update not completed : "+e.getMessage();
                }
            }else{
                return "Update Not Complete : Ram not available";
            }
        } else {
            return "Update not complete : You dont have permission";
        }
    }
}


