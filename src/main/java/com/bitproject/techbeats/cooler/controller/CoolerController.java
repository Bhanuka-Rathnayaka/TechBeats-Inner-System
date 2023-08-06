package com.bitproject.techbeats.cooler.controller;
import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.cooler.repository.CoolerRepository;
import com.bitproject.techbeats.cooler.repository.CoolerStatusRepository;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/cooler")
public class CoolerController {

    @Autowired
    private CoolerRepository coolerDao;
    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private CoolerStatusRepository coolerStatusDao;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;

    //load Cooler ui
    @GetMapping
    public ModelAndView coolerView(){
        ModelAndView coolerUI = new ModelAndView();
        coolerUI.setViewName("cooler.html");
        return coolerUI;
    }

    //create mapping for get all employee
    @GetMapping(value = "/all" , produces = "application/json")
    public List<Cooler> coolersFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Cooler");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return coolerDao.findAll();
        }else{
            return null;
        }

    };

    //Cooler list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Cooler> coolerList(){

        return coolerDao.coolerListForCo();
    }

    //Cooler list for assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Cooler> coolerListAssemble(){

        return coolerDao.coolerListForAssemble();
    }

    //Cooler for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Cooler> coolerListPR(@PathVariable("bid") Integer bid){
        return coolerDao.coolerListForPR(bid);
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Cooler coolerListByCodeName(@PathVariable("code") String code,@PathVariable("name") String name){
        return coolerDao.coolerbyitemcodename(code,name);
    }

    //create delete mapping
    @DeleteMapping
    public String deleteCooler(@RequestBody Cooler cooler){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"coooler");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check cooler exist
            Cooler extcooler = coolerDao.getReferenceById(cooler.getId());

            if(extcooler != null){
                try {
                    //set auto instert value
                    extcooler.setDeletedatetime(LocalDateTime.now());
                    extcooler.setCooler_status_id(coolerStatusDao.getReferenceById(3));
                    coolerDao.save(extcooler);

                    return "0";

                }catch (Exception e){
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                return "Delete not complete : Cooler not exist";
            }

        }else {
            return "Delete not complete : You dont have permission";
        }


    }


    ////create mapping for post casing details("/casing")
    @PostMapping
    public String addCooler(@RequestBody Cooler cooler){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"coooler");
        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist cooler by cooler Name
            Cooler extCoolerByName = coolerDao.findCoolerByName(cooler.getName());
            if(extCoolerByName != null) {
                return "Cooler insert not complete:Cooler name already exist";
            }

            try{
                //set auto insert value
                cooler.setItem_category_id(itemCategoryDao.getReferenceById(6));
                cooler.setCooler_code(coolerDao.nextCoolerCode());
                cooler.setAdduser_id(logExtUser);
                cooler.setWarranty(3);

                //set add date time
                cooler.setAdddatetime(LocalDateTime.now());

                //save operate
                coolerDao.save(cooler);
                return "0";
            }catch(Exception e){
                return "Cooler insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }


    }

    //get mapping service for get cooler by given quary variable id[/cooler/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Cooler getCoolerByQPId(@RequestParam("id") Integer id){
        return coolerDao.getReferenceById(id);
    }

    ////create mapping for post casing details("/casing")
    @PutMapping
    public String putCooler(@RequestBody Cooler cooler){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"coooler");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                cooler.setUpdateuser_id(logExtUser);

                //set add date time
                cooler.setUpdatedatetime(LocalDateTime.now());

                //save operate
                coolerDao.save(cooler);
                return "0";
            }catch(Exception e){
                return "Cooler Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }
}
