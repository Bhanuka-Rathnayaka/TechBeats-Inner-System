package com.bitproject.techbeats.storage.controller;
import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.item.ItemCategoryRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.storage.repository.StorageRepository;
import com.bitproject.techbeats.storage.repository.StorageStatusRepossitory;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/storage")
public class StorageControlller {
    @Autowired
    private StorageRepository storageDao;
    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private StorageStatusRepossitory storageStatusDao;

    @Autowired
    private ItemCategoryRepository itemCategoryDao;



    //load Cooler ui
    @GetMapping
    public ModelAndView storageView(){
        ModelAndView storageUI = new ModelAndView();
        storageUI.setViewName("storage.html");
        return storageUI;
    }

    //create mapping for get all storage
    @GetMapping(value = "/all" , produces = "application/json")
    public List<Storage> storagesFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Storage");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return storageDao.findAll();
        }else{
            List<Storage> storageList = new ArrayList<>();
            return storageList;
        }

    };

    //Cooler list for category
    @GetMapping(value = "/list",produces = "application/json")
    public List<Storage> storageList(){

        return storageDao.storageListForCo();
    }

    //assemble
    @GetMapping(value = "/listforassemble",produces = "application/json")
    public List<Storage> storageListAssemble(){

        return storageDao.storageListForAssemble();
    }

    ////getBynamecode for sale price in grn
    @GetMapping(value = "/byitemcodename/{code}/{name}",produces = "application/json")
    public Storage stListByCodeName(@PathVariable("code") String code, @PathVariable("name") String name){
        return storageDao.stbyitemcodename(code,name);
    }


    //casing for purchace request
    @GetMapping(value = "/listbycategories/{bid}",produces = "application/json")
    public List<Storage> storageListPR(@PathVariable("bid") Integer bid){
        return storageDao.storageListForPR(bid);
    }

    //create delete mapping
    @DeleteMapping
    public String deleteStorage(@RequestBody Storage storage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Storage");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check cooler exist
            Storage extstorage = storageDao.getReferenceById(storage.getId());

            if(extstorage != null){
                try {
                    //set auto instert value
                    extstorage.setDeletedatetime(LocalDateTime.now());
                    extstorage.setSt_status_id(storageStatusDao.getReferenceById(3));
                    storageDao.save(extstorage);

                    return "0";

                }catch (Exception e){
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                return "Delete not complete : Storage Device not exist";
            }

        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    ////create mapping for post
    @PostMapping
    public String addStorage(@RequestBody Storage storage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Storage");
        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check exist cooler by cooler Name
            Storage extStorageByName = storageDao.findStorageByName(storage.getName());
            if(extStorageByName != null) {
                return "Storage insert not complete:Storage name already exist";
            }

            try{
                //set auto insert value
                storage.setItem_category_id(itemCategoryDao.getReferenceById(7));
                storage.setCode(storageDao.nextStorageCode());
                storage.setAdduser_id(logExtUser);
                storage.setAdddatetime(LocalDateTime.now());

                //save operate
                storageDao.save(storage);
                //rturn storage code if storage add successfully that use in photo add modal
                return storage.getCode();
            }catch(Exception e){
                return "Storage insert not complete :" + e.getMessage();
            }
        }else{
            return "Add not complete : You dont have permission";
        }


    }

    @PostMapping(value = "/changephoto")
    public String saveStoragePhoto(@RequestPart ("sorageCode") String code, @RequestPart("photoname")MultipartFile photo)throws IOException{
        try{
            //get storage by code
            Storage storage = storageDao.getStorageCode(code);

            //set directory
            String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/item_photo/storage_Photo/" + storage.getCode() + "/";

            //get upload dicrectory path
            Path photpath = Paths.get(UPLOAD_DIRECTORY);
            System.out.println(photpath);

            if (!Files.exists(photpath)){//crete folder from storage code if it not exsist
                Files.createDirectories(photpath);
            }
            try(InputStream inputStream = photo.getInputStream()){
                Path extPhotoPath = photpath.resolve(photo.getOriginalFilename());
                System.out.println(extPhotoPath);
                Files.copy(inputStream,extPhotoPath, StandardCopyOption.REPLACE_EXISTING);
            }catch (IOException ioe){
                throw new IOException("Could not save image file: "+ioe.getMessage());

            }
            storage.setPhotopath(UPLOAD_DIRECTORY+photo.getOriginalFilename());
            storageDao.save(storage);

            return "<script>window.location.replace('/storage');</script>";

        }catch (Exception e){
            return "<script>window.location.replace('/storage');</script>";
        }

    }

    //get mapping service for get storage by given quary variable id[/storage/getbyid?id=1]
    @GetMapping(value = "/getbyid" , produces = "application/json")
    public Storage getStorageByQPId(@RequestParam("id") Integer id){
        return storageDao.getReferenceById(id);
    }

    ////create mapping for post casing details("/casing")
    @PutMapping
    public String putStorage(@RequestBody Storage storage){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Storage");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                storage.setUpdateuser_id(logExtUser);

                //set add date time
                storage.setUpdatedatetime(LocalDateTime.now());

                //save operate
                storageDao.save(storage);
                return "0";
            }catch(Exception e){
                return "Storage Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }
}
