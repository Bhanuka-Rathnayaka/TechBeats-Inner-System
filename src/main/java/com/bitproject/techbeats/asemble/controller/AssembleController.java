package com.bitproject.techbeats.asemble.controller;

import com.bitproject.techbeats.asemble.model.Assemble;
import com.bitproject.techbeats.asemble.reoisitory.AssembleRepository;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
public class AssembleController {

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private AssembleRepository assembleDao;

    @GetMapping(value = "/assemble")
    public ModelAndView addAssemble(){
        ModelAndView addAssembleUI = new ModelAndView();
        addAssembleUI.setViewName("createassemble.html");
        return addAssembleUI;
    }

    //create mapping for get all employee
    @GetMapping(value = "/assemble/all/{minprice}/{maxprice}" , produces = "application/json")
    public List<Assemble> assmbleFindAllWithMinMax(@PathVariable("minprice") String minprice,@PathVariable("maxprice") String maxprice){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Assemble");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return assembleDao.findAll(BigDecimal.valueOf(Double.valueOf(minprice)),BigDecimal.valueOf(Double.valueOf(maxprice)));
        }else{
            return null;
        }

    }

    @GetMapping(value = "/assemble/all" , produces = "application/json")
    public List<Assemble> assmbleFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Assemble");

        if (logExtUser != null && userPrivilage.get("select_permission")){

                return assembleDao.findAll();
        }else{
            return null;
        }

    }


    ////create mapping for post casing details("/casing")
    @PostMapping(value = "/assemble")
    public String addCooler(@RequestBody Assemble assemble){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Assemble");

        if (logExtUser != null && userPrivilage.get("insert_permission")){

            try{
                assemble.setAssemblecode("PC0001");
                //save operate
                assembleDao.save(assemble);
                return "0";
            }catch(Exception e){
                return "Assemble Add not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }


    }

}
