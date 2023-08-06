package com.bitproject.techbeats.storage.controller;



import com.bitproject.techbeats.storage.model.StorageCapasity;
import com.bitproject.techbeats.storage.model.StorageStatus;
import com.bitproject.techbeats.storage.repository.StorageCapasityRepository;
import com.bitproject.techbeats.storage.repository.StorageStatusRepossitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/storagecapasity")
public class StorageCapasityController {
    @Autowired
    private StorageCapasityRepository storageCapasityDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<StorageCapasity> storageCapasityList(){
        return storageCapasityDao.findAll();
    }
}
