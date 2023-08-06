package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.RamSpeed;
import com.bitproject.techbeats.ram.model.RamStatus;
import com.bitproject.techbeats.ram.repositary.RamSpeedRepository;
import com.bitproject.techbeats.ram.repositary.RamStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramstatus")
public class RamStatusController {
    @Autowired
    private RamStatusRepository ramStatusDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamStatus> ramStatusList(){

        return ramStatusDao.findAll();
    }
}
