package com.bitproject.techbeats.casing.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.casing.repository.CasingRepository;
import com.bitproject.techbeats.casing.repository.CasingStatusRepository;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/casing")
public class CasingController {

    @Autowired
    private CasingRepository casingDao;

    @Autowired
    private CasingStatusRepository casingStatusDao;

    @Autowired
    private UserRepository userDao;
    @Autowired

    private PrivilageControl privilageControl;


    @Autowired
    private ItemCategoryRepository itemCategoryDao;


    //load casing ui
    @GetMapping()
    public ModelAndView casingView(){
        ModelAndView casingUI = new ModelAndView();
        casingUI.setViewName("casing.html");
        return casingUI;
    }

    //create mapping for get casing all details("/psu/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<Casing> casingFindAll(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Casing");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return casingDao.findAll();
        }else{
            return null;
        }

    }

    //case list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Casing> caseList(){
        return casingDao.caseListForCo();
    }

    //case list for assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Casing> caseListAssemble(){
        return casingDao.caseListForAssemble();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Casing casingListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return casingDao.casingbyitemcodename(code,name);
    }

    //casing for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Casing> caseListPR(@PathVariable("bid") Integer bid){
        return casingDao.caseListForPR(bid);
    }


    //create mapping for delete casing
    @DeleteMapping
    public String deleteCasing(@RequestBody Casing casing){
        //need to check privilavge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Casing");

        if (logExtUser != null && userPrivilage.get("delete_permission")){

            //check ram exist
            Casing extcase = casingDao.getReferenceById(casing.getId());

            if (extcase != null){
                try{
                    //set auto insert value
                    extcase.setDeletedatetime(LocalDateTime.now());
                    extcase.setStatus_id(casingStatusDao.getReferenceById(3));
                    casingDao.save(extcase);

                    //need to update avilable dependency

                    return "0";
                }catch(Exception e){
                    return "Delete not complete: "+e.getMessage();
                }
            }else{
                return "Delete not completed : PSU not available";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    ////create mapping for post casing details("/casing")
    @PostMapping
    public String addCase(@RequestBody Casing casing){
        //need to check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Casing");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist case by case Name
            Casing extCaseByName = casingDao.findCasingByCasingName(casing.getCasing_name());
            if(extCaseByName != null) {
                return "Casing insert not complete:Casing name already exist";
            }

            try{
                //set auto insert value
                casing.setCasing_code(casingDao.nextCasingCode());
                casing.setAdduser_id(userDao.getReferenceById(10));
                casing.setItem_category_id(itemCategoryDao.getReferenceById(5));
                casing.setWarrenty(6);

                //set add date time
                casing.setAdddatetime(LocalDateTime.now());

                //save operate
                casingDao.save(casing);
                return "0";
            }catch(Exception e){
                return "Casing insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }

    }

    //get mapping service for get casing by given quary variable id[/casing/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Casing getCaseByQPId(@RequestParam("id") Integer id){
        return casingDao.getReferenceById(id);
    }

    ////create mapping for post PSU details("/casing")
    @PutMapping
    public String putCase(@RequestBody Casing casing){
        //need to check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Casing");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            //check exist CAsing
            Casing extcase = casingDao.getReferenceById(casing.getId());
            if(extcase != null) {

                try{
                    //set auto insert value
                    casing.setUpdateuser_id(userDao.getReferenceById(10));
                    casing.setUpdatedatetime(LocalDateTime.now());

                    //save operate
                    casingDao.save(casing);
                    return "0";
                }catch(Exception e){
                    return "Casing Update not complete :" + e.getMessage();
                }
            }else {
                return "Casing Update not complete:Casing Not Available";
            }
        }else {
            return "Update not complete : You dont have permission";
        }

    }
}
