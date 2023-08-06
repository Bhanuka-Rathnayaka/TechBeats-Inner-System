package com.bitproject.techbeats.storage.controller;



import com.bitproject.techbeats.storage.model.StorageFormfactor;
import com.bitproject.techbeats.storage.model.StorageInterface;
import com.bitproject.techbeats.storage.repository.StorageFormfactorRepository;
import com.bitproject.techbeats.storage.repository.StorageInterfaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/storageinterface")
public class StorageInterfaceController {
    @Autowired
    private StorageInterfaceRepository storageInterfaceDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<StorageInterface> storageInterfaceList(){
        return storageInterfaceDao.findAll();
    }
}
