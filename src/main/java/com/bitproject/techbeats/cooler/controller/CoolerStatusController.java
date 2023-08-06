package com.bitproject.techbeats.cooler.controller;


import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.cooler.model.CoolerStatus;
import com.bitproject.techbeats.cooler.repository.CoolerSeriesRepository;
import com.bitproject.techbeats.cooler.repository.CoolerStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/coolerstatus")
public class CoolerStatusController {
    @Autowired
    private CoolerStatusRepository coolerStatusDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CoolerStatus> coolerStatusList(){
        return coolerStatusDao.findAll();
    }
}
