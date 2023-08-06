package com.bitproject.techbeats.processor.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.processor.repository.ProcessorRepository;
import com.bitproject.techbeats.processor.repository.ProcessorStatusRepocitory;
import com.bitproject.techbeats.ram.model.Ram;
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
@RequestMapping(value = "/processor")
public class ProcessorController {

    @Autowired
    private ProcessorRepository processorDao;

    @Autowired
    private ProcessorStatusRepocitory proStatusDao;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    //load ui
    @GetMapping
    public ModelAndView processorView(){
       ModelAndView processorUI = new ModelAndView();
       processorUI.setViewName("processor.html");
       return processorUI;
    }

    //findall
    @GetMapping(value = "/all",produces = "application/json")
    public List<Processor> processorFindAll(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Processor");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return processorDao.findAll();
        }else {
            List<Processor> processorList = new ArrayList<>();
            return processorList;
        }

    }

    //ram list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Processor> processorList(){

        return processorDao.processorListForCo();
    }

    //casing for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Processor> proListPR(@PathVariable("bid") Integer bid){
        return processorDao.proListForPR(bid);
    }

    //pro list for assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Processor> processorListForAssemble(){

        return processorDao.processorListForAssemble();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Processor proListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return processorDao.probyitemcodename(code,name);
    }

    //get mapping service for get processor by given path variable id[/processor/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Processor getProcessorById(@PathVariable("id") Integer id){
        return processorDao.getReferenceById(id);
    }

    //create mapping for delete ram
    @DeleteMapping
    public String deleteProcessor(@RequestBody Processor processor){
        //need to check privilavge

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Processor");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check ram exist
            Processor extprocessor = processorDao.getReferenceById(processor.getId());

            if (extprocessor != null){
                try{
                    //set auto insert value
                    extprocessor.setDeletedatetime(LocalDateTime.now());
                    extprocessor.setPro_status_id(proStatusDao.getReferenceById(1));
                    processorDao.save(extprocessor);

                    //need to update avilable dependency

                    return "0";
                }catch(Exception e){
                    return "Delete not complete: "+e.getMessage();
                }
            }else{
                return "Delete not completed : Processor not availabal";
            }
        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    ////create mapping for post ram details("/employee")
    @PostMapping
    public String addProcessor(@RequestBody Processor processor){
        //need to check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Processor");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist processor by Name
            Processor extProcessorByName = processorDao.findByPname(processor.getPname());
            if(extProcessorByName != null){
                return "Add Not complete : Processor already exist";
            }

            try{
                //set auto insert value
                processor.setPcode(processorDao.nextProcessorCode());
                processor.setItem_category_id(itemCategoryDao.getReferenceById(2));

                //set add date time
                processor.setAdddatetime(LocalDateTime.now());

                //save operate
                processorDao.save(processor);
                return "0";
            }catch(Exception e){
                return "Processor insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }
    }

    //create mapping for update processor
    @PutMapping
    public String updateProcessor(@RequestBody Processor processor){
        //check privilege fpr log user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Processor");

        if (logExtUser != null && userPrivilage.get("update_permission")){

            Processor extProcessor = processorDao.getReferenceById(processor.getId());
            if(extProcessor != null){
                try{
                    processor.setUpdatedatetime(LocalDateTime.now());

                    //save operator
                    processorDao.save(processor);

                    //need update dependency module

                    return "0";
                }catch(Exception e){
                    return "Processor update not completed : "+e.getMessage();
                }
            }else{
                return "Update not complete : Processor not available";
            }

        }else{
            return "Update not complete : You dont have permission";
        }

    }
}
