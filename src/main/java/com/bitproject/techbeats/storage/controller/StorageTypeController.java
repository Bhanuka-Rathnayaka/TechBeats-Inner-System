package com.bitproject.techbeats.storage.controller;



import com.bitproject.techbeats.storage.model.StorageStatus;
import com.bitproject.techbeats.storage.model.StorageType;
import com.bitproject.techbeats.storage.repository.StorageStatusRepossitory;
import com.bitproject.techbeats.storage.repository.StorageTypeRepossitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/storagetype")
public class StorageTypeController {
    @Autowired
    private StorageTypeRepossitory storageTypeDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<StorageType> storageTypeList(){
        return storageTypeDao.findAll();
    }
}
