package com.bitproject.techbeats.laptop.controller;

import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.laptop.model.Laptop;
import com.bitproject.techbeats.laptop.repository.LaptopRepository;
import com.bitproject.techbeats.laptop.repository.LaptopStatusRepository;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
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
@RequestMapping("/laptop")
public class LaptopController {

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private LaptopRepository laptopDao;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;

    @Autowired
    private LaptopStatusRepository laptopStatusDao;

    //Set UI
    @GetMapping
    public ModelAndView LaptopView(){
        ModelAndView laptopUI = new ModelAndView();
        laptopUI.setViewName("laptop.html");
        return laptopUI;
    }

    @GetMapping(value = "/all",produces = "application/json")
    public List<Laptop> getLaptopAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Laptop");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return laptopDao.findAll();
        }else {
            List<Laptop> laptopList = new ArrayList<>();
            return laptopList;
        }

    }

    //get mapping service for get storage by given quary variable id[/storage/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Laptop getLaptopByQPId(@RequestParam("id") Integer id){
        return laptopDao.getReferenceById(id);
    }


    //ram list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Laptop> lapList(){

        return laptopDao.lapListForCo();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Laptop laptopListByCodeName(@PathVariable("code") String code,@PathVariable("name") String name){
        return laptopDao.lapbyitemcodename(code,name);
    }


    //laptop for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Laptop> lapListPR(@PathVariable("bid") Integer bid){
        return laptopDao.lapListForPR(bid);
    }

    //Delete mapping
    @DeleteMapping
    public String deleteLaptop(@RequestBody Laptop laptop){
        //Check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User logUser = userDao.findUserByUsername(auth.getName());

        HashMap<String, Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(), "Laptop");

        if (logUser != null && userPrivilage.get("delete_permission")){
            //check lap exist
            Laptop extLap = laptopDao.getReferenceById(laptop.getId());
            if (extLap != null){
                try {
                    //set auto insert value
                    laptop.setDeletedatetime(LocalDateTime.now());
                    laptop.setDeleteuser_id(logUser);
                    laptop.setLap_status_id(laptopStatusDao.getReferenceById(2));

                    laptopDao.save(laptop);

                    return "0";

                }catch (Exception e){
                    return e.getMessage();
                }
            }else{
                return "Delete not completed : Laptop not availabal";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }
    }


    @PostMapping
    public String addLaptop(@RequestBody Laptop laptop){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Laptop");
        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist cooler by Laptop Name
            /*Laptop extLapByName = laptopDao.findMotherboardByName(laptop.getName());
            if(extLapByName != null) {
                return "Laptop insert not complete:Motherboard name already exist";
            }*/

            try{
                //set auto insert value
                laptop.setItem_category_id(itemCategoryDao.getReferenceById(8));
                laptop.setCode("LAP00001");
                laptop.setAdduser_id(logExtUser);
                laptop.setAdddatetime(LocalDateTime.now());

                //save operate
                laptopDao.save(laptop);
                return "0";
            }catch(Exception e){
                return "Laptop insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }


    }

}
