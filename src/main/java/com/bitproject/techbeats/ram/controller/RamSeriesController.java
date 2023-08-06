package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.RamLatency;
import com.bitproject.techbeats.ram.model.RamProductSeries;
import com.bitproject.techbeats.ram.repositary.RamLatencyRepository;
import com.bitproject.techbeats.ram.repositary.RamSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramseries")
public class RamSeriesController {
    @Autowired
    private RamSeriesRepository ramSeriesDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamProductSeries> ramSeriesList(){

        return ramSeriesDao.findAll();
    }
}

