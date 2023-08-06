package com.bitproject.techbeats.storage.controller;



import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.storage.model.StorageFormfactor;
import com.bitproject.techbeats.storage.model.StorageType;
import com.bitproject.techbeats.storage.repository.StorageFormfactorRepository;
import com.bitproject.techbeats.storage.repository.StorageTypeRepossitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/storageformfactor")
public class StorageFormFactorController {
    @Autowired
    private StorageFormfactorRepository storageFormfactorDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<StorageFormfactor> storageFormFactorList(){
        return storageFormfactorDao.findAll();
    }

    //get mapping for get formfactor by given type id(storageformfactor/allbytype?tid=)
    @GetMapping(value = "/allbytype",params = "tid",produces = "application/json")
    public List<StorageFormfactor> storageFormfactorsByType(@RequestParam("tid") Integer tid){
        return storageFormfactorDao.findByType(tid);

    }
}
