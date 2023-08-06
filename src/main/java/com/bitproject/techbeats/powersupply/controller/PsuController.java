package com.bitproject.techbeats.powersupply.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.powersupply.repository.PsuRepository;
import com.bitproject.techbeats.powersupply.repository.PsuStatusRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.SpringVersion;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/psu")
public class PsuController {

    @Autowired
    private PsuRepository psuDao;

    @Autowired
    private PsuStatusRepository psuStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;

    //load ram ui
    @GetMapping()
    public ModelAndView psuView(){
        ModelAndView psuUI = new ModelAndView();
        psuUI.setViewName("powersupply.html");
        return psuUI;
    }

    //create mapping for get ram all details("/psu/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<Powersupply> psuFindAll(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Power Supply Unit");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return psuDao.findAll();
        }else {
            List<Powersupply> powersupplyList = new ArrayList<>();
            return powersupplyList;
        }


    }

    //PSU list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Powersupply> psuList(){

        return psuDao.psuListForCo();
    }

    //PSU list for assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Powersupply> psuListAssemble(){

        return psuDao.psuListForAssemble();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Powersupply psuListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return psuDao.psubyitemcodename(code,name);
    }

    //casing for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Powersupply> psuListPR(@PathVariable("bid") Integer bid){
        return psuDao.psuListForPR(bid);
    }

    //get mapping service for get employee by given quary variable id[/employee/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Powersupply getPsuByQPId(@RequestParam("id") Integer id){
        return psuDao.getReferenceById(id);
    }

    //create mapping for delete PSU
    @DeleteMapping
    public String deletePsu(@RequestBody Powersupply psu){
        //need to check privilavge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Power Supply Unit");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check ram exist
            Powersupply extpsu = psuDao.getReferenceById(psu.getId());

            if (extpsu != null){
                try{
                    //set auto insert value
                    extpsu.setDeletedatetime(LocalDateTime.now());
                    extpsu.setPsstatus_id(psuStatusDao.getReferenceById(3));
                    psuDao.save(extpsu);

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

    ////create mapping for post PSU details("/psu")
    @PostMapping
    public String addPsu(@RequestBody Powersupply psu){
        //need to check privilage

        //need to check privilavge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Power Supply Unit");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist Ram by Ram Name
            Powersupply extPsuByName = psuDao.findPsuByPsname(psu.getPsname());
            if(extPsuByName != null) {
                return "PSU insert not complete:PSU name already exist";
            }

            try{
                //set auto insert value
                psu.setPscode(psuDao.nextPsuCode());
                psu.setAdduser_id(userDao.getReferenceById(10));
                psu.setWarranty(3);
                psu.setItem_category_id(itemCategoryDao.getReferenceById(4));


                //set add date time
                psu.setAdddatetime(LocalDateTime.now());

                //save operate
                psuDao.save(psu);
                return "0";
            }catch(Exception e){
                return "PSU insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }

    }

    //create mapping for update employee
    @PutMapping
    public String updatePsu(@RequestBody Powersupply psu){
        //need to check privilage
        //need to check privilavge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Power Supply Unit");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            //check exist PSU
            Powersupply extPsu = psuDao.getReferenceById(psu.getId());
            if(extPsu != null) {
                try{

                    //set add date time
                    psu.setUpdatedatetime(LocalDateTime.now());

                    //save operate
                    psuDao.save(psu);
                    return "0";
                }catch(Exception e){
                    return "PSU insert not complete :" + e.getMessage();
                }
            }else{
                return "Update Not Complete : PSU not available";
            }
        }else{
            return "Update not complete : You dont have permission";
        }

    }
}
