package com.bitproject.techbeats.powersupply.controller;
import com.bitproject.techbeats.powersupply.model.PsSeries;
import com.bitproject.techbeats.powersupply.repository.PsuSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/psuseries")
public class PsuSeriesController {
    @Autowired
    private PsuSeriesRepository psuSeriesDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<PsSeries> psuSeries(){

        return psuSeriesDao.findAll();
    }
}
