package com.bitproject.techbeats.vga.controller;



import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import com.bitproject.techbeats.vga.modal.Vga;
import com.bitproject.techbeats.vga.repository.VgaRepository;
import com.bitproject.techbeats.vga.repository.VgaStatusRepository;
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
@RequestMapping(value = "/vga")
public class VgaController {
    @Autowired
    private VgaRepository vgaDao;

    @Autowired
    private VgaStatusRepository vgaStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    //load ui
    @GetMapping
    public ModelAndView vgaView(){
        ModelAndView vgaUI = new ModelAndView();
        vgaUI.setViewName("vga.html");
        return vgaUI;
    }

    //findall
    @GetMapping(value = "/all",produces = "application/json")
    public List<Vga> vgaFindAll(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Vga");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return vgaDao.findAll();
        }else{
            List<Vga> vgaList = new ArrayList<>();
            return vgaList;
        }


    }

    //assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Vga> vgaforAssemble(){

        return vgaDao.vgaListForAssemble();
    }

    @GetMapping(value = "/listforassemblev4",produces = "application/json")
    public List<Vga> vgaforAssemblev4(){

        return vgaDao.vgaListForAssemblev4();
    }

    @GetMapping(value = "/listforassemblev5",produces = "application/json")
    public List<Vga> vgaforAssemblev5(){

        return vgaDao.vgaListForAssemblev5();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Vga vgaListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return vgaDao.vgabyitemcodename(code,name);
    }

    //ram list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Vga> vgaList(){

        return vgaDao.vgaListForCo();
    }

    //casing for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Vga> vgaListPR(@PathVariable("bid") Integer bid){
        return vgaDao.vgaListForPR(bid);
    }


    //create mapping for delete ram
    @DeleteMapping
    public String deleteVga(@RequestBody Vga vga){
        //need to check privilavge

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Vga");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check ram exist
            Vga extVga = vgaDao.getReferenceById(vga.getId());

            if (extVga != null){
                try{
                    //set auto insert value
                    extVga.setAdddatetime(LocalDateTime.now());
                    extVga.setVga_status_id(vgaStatusDao.getReferenceById(1));
                    vga.setWarranty(12);
                    vgaDao.save(extVga);

                    //need to update avilable dependency

                    return "0";
                }catch(Exception e){
                    return "Delete not complete: "+e.getMessage();
                }
            }else{
                return "Delete not completed : vga not availabal";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    ////create mapping for post ram details("/employee")
    @PostMapping
    public String addVga(@RequestBody Vga vga){
        //need to check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Vga");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist vga by Name
            Vga extVgaByName = vgaDao.findByVname(vga.getVname());
            if(extVgaByName != null){
                return "Add Not complete : vga already exist";
            }

            try{
                //set auto insert value
                vga.setVcode(vgaDao.nextVgaCode());

                //set add date time
                vga.setAdddatetime(LocalDateTime.now());

                //save operate
                vgaDao.save(vga);
                return "0";
            }catch(Exception e){
                return "Vga insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }



    }

    //create mapping for update vga
    @PutMapping
    public String updateVga(@RequestBody Vga vga){
        //check privilege fpr log user

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Vga");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            Vga extVga = vgaDao.getReferenceById(vga.getId());
            if(extVga != null){
                try{
                    vga.setUpdatedatetime(LocalDateTime.now());

                    //save operator
                    vgaDao.save(vga);

                    //need update dependency module

                    return "0";
                }catch(Exception e){
                    return "VGA update not completed : "+e.getMessage();
                }
            }else{
                return "Update not complete : VGA not available";
            }

        }else{
            return "Add not complete : You dont have permission";
        }



    }

    //get mapping service for get processor by given path variable id[/vga/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Vga getVgaById(@PathVariable("id") Integer id){
        return vgaDao.getReferenceById(id);
    }
}
