package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.RamProductSeries;
import com.bitproject.techbeats.ram.model.RamSpeed;
import com.bitproject.techbeats.ram.repositary.RamSeriesRepository;
import com.bitproject.techbeats.ram.repositary.RamSpeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramspeed")
public class RamSpeedController {
    @Autowired
    private RamSpeedRepository ramSpeedDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamSpeed> ramSpeedList(){

        return ramSpeedDao.findAll();
    }
}
