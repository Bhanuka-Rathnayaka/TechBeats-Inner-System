package com.bitproject.techbeats.motherboard.controller;

import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.laptop.model.Laptop;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.motherboard.model.MotherboardStatus;
import com.bitproject.techbeats.motherboard.repository.MbStatusRepository;
import com.bitproject.techbeats.motherboard.repository.MothrboardRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import com.bitproject.techbeats.vga.modal.Vga;
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
@RequestMapping("/motherboard")
public class MotherboardController {

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private MothrboardRepository mothrboardDao;

    @Autowired
    private MbStatusRepository mbStatusDao;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;


    //Load UI
    @GetMapping
    public ModelAndView motherboardView(){
        ModelAndView motherboardUI = new ModelAndView();
        motherboardUI.setViewName("motherboard.html");
        return motherboardUI;
    }

    //get all
    @GetMapping(value = "/all",produces = "application/json")
    public List <Motherboard> motherboardFindAll (){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Motherboard");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return mothrboardDao.findAll();
        }else{
            List<Motherboard> motherboardList = new ArrayList<>();
            return motherboardList;
        }

    }

    //create delete mapping
    @DeleteMapping
    public String deleteMotherboard(@RequestBody Motherboard motherboard){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Motherboard");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check motherboard exist
            Motherboard extMotherboard = mothrboardDao.getReferenceById(motherboard.getId());

            if(extMotherboard != null){
                try {
                    //set auto instert value
                    extMotherboard.setDeletedatetime(LocalDateTime.now());
                    extMotherboard.setMb_status_id(mbStatusDao.getReferenceById(2));
                    mothrboardDao.save(extMotherboard);

                    return "0";

                }catch (Exception e){
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                return "Delete not complete : Motherboard  not exist";
            }

        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    @PostMapping
    public String addMotherboard(@RequestBody Motherboard motherboard){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Motherboard");
        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist cooler by cooler Name
            Motherboard extMotherboardByName = mothrboardDao.findMotherboardByName(motherboard.getName());
            if(extMotherboardByName != null) {
                return "Motherboard insert not complete:Motherboard name already exist";
            }

            try{
                //set auto insert value
                motherboard.setItem_category_id(itemCategoryDao.getReferenceById(8));
                motherboard.setCode(mothrboardDao.nextMBCode());
                motherboard.setAdduser_id(logExtUser);
                motherboard.setAdddatetime(LocalDateTime.now());

                //save operate
                mothrboardDao.save(motherboard);
                return "0";
            }catch(Exception e){
                return "Motherboard insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }


    }

    //mb list for assemble
    @GetMapping(value = "/listforassemble/{pid}",produces = "application/json")
    public List<Motherboard> mbListForAssemble(@PathVariable("pid") Integer pid){
        return mothrboardDao.mbListForAssemble(pid);
    }


    //get mapping service for get storage by given quary variable id[/storage/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Motherboard getMotherboardByQPId(@RequestParam("id") Integer id){
        return mothrboardDao.getReferenceById(id);
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Motherboard mbListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return mothrboardDao.mbbyitemcodename(code,name);
    }

    //mb for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Motherboard> mbistPR(@PathVariable("bid") Integer bid){
        return mothrboardDao.mbListForPR(bid);
    }

    //mb list for co
    @GetMapping(value = "/list",produces = "application/json")
    public List<Motherboard> mbList(){

        return mothrboardDao.mbListForCo();
    }


    ////create mapping for post casing details("/casing")
    @PutMapping
    public String putStorage(@RequestBody Motherboard motherboard){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Motherboard");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                motherboard.setUpdateuser_id(logExtUser);

                //set add date time
                motherboard.setUpdatedatetime(LocalDateTime.now());

                //save operate
                mothrboardDao.save(motherboard);
                return "0";
            }catch(Exception e){
                return "Motherboard Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }


}
