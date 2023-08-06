package com.bitproject.techbeats.ram.controller;
import com.bitproject.techbeats.ram.model.RamCapacity;
import com.bitproject.techbeats.ram.repositary.RamCapacityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramcapacity")
public class RamCapacityController {
    @Autowired
    private RamCapacityRepository ramCapacityDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamCapacity> ramCapacityList(){
        return ramCapacityDao.findAll();
    }
}
