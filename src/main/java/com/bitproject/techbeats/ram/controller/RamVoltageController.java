package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.RamType;
import com.bitproject.techbeats.ram.model.RamVoltage;
import com.bitproject.techbeats.ram.repositary.RamTypeRepository;
import com.bitproject.techbeats.ram.repositary.RamVoltageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramvoltage")
public class RamVoltageController {
    @Autowired
    private RamVoltageRepository ramVoltageDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamVoltage> ramvoltageList(){

        return ramVoltageDao.findAll();
    }
}
