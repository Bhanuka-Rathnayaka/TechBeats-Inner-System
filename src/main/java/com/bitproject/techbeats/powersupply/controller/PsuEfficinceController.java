package com.bitproject.techbeats.powersupply.controller;
import com.bitproject.techbeats.powersupply.model.PsEfficienct;
import com.bitproject.techbeats.powersupply.model.PsSeries;
import com.bitproject.techbeats.powersupply.repository.PsuEfficienceRepository;
import com.bitproject.techbeats.powersupply.repository.PsuSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/psuefficace")
public class PsuEfficinceController {
    @Autowired
    private PsuEfficienceRepository psuEfficinceDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<PsEfficienct> psuEfficince(){

        return psuEfficinceDao.findAll();
    }
}
