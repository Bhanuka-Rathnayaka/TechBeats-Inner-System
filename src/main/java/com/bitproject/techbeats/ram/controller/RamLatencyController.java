package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.RamColor;
import com.bitproject.techbeats.ram.model.RamLatency;
import com.bitproject.techbeats.ram.repositary.RamColorRepository;
import com.bitproject.techbeats.ram.repositary.RamLatencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramlatency")
public class RamLatencyController {
    @Autowired
    private RamLatencyRepository ramLatencyDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamLatency> ramLatencyList(){

        return ramLatencyDao.findAll();
    }
}
