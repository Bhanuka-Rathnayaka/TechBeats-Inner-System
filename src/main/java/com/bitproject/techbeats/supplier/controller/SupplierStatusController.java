package com.bitproject.techbeats.supplier.controller;



import com.bitproject.techbeats.storage.model.StorageStatus;
import com.bitproject.techbeats.storage.repository.StorageStatusRepossitory;
import com.bitproject.techbeats.supplier.model.SupplierStatus;
import com.bitproject.techbeats.supplier.repository.SupplierStatusRepossitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierStatusController {
    @Autowired
    private SupplierStatusRepossitory supplierStatusDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<SupplierStatus> supplierStatusList(){
        return supplierStatusDao.findAll();
    }
}
