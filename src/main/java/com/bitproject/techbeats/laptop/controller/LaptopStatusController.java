package com.bitproject.techbeats.laptop.controller;

import com.bitproject.techbeats.laptop.model.LaptopStatus;
import com.bitproject.techbeats.laptop.repository.LaptopStatusRepository;
import org.apache.catalina.LifecycleState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/laptopstatus")
public class LaptopStatusController {

    @Autowired
    private LaptopStatusRepository laptopStatusDao;

    //get all status
    @GetMapping(value = "/all",produces = "application/json")
    public List<LaptopStatus> getlaptopStatuses(){
        return laptopStatusDao.findAll();
    }
}
