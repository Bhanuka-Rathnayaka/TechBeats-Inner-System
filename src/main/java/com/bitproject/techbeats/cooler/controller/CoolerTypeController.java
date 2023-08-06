package com.bitproject.techbeats.cooler.controller;


import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.cooler.model.CoolerType;
import com.bitproject.techbeats.cooler.repository.CoolerSeriesRepository;
import com.bitproject.techbeats.cooler.repository.CoolerTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/coolertype")
public class CoolerTypeController {
    @Autowired
    private CoolerTypeRepository coolerTypeDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CoolerType> coolerTypeList(){
        return coolerTypeDao.findAll();
    }
}
