package com.bitproject.techbeats.powersupply.controller;
import com.bitproject.techbeats.powersupply.model.PsStatus;
import com.bitproject.techbeats.powersupply.model.PsWattage;
import com.bitproject.techbeats.powersupply.repository.PsuStatusRepository;
import com.bitproject.techbeats.powersupply.repository.PsuWattageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/psuwattage")
public class PsuWattageController {
    @Autowired
    private PsuWattageRepository psuWattageDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<PsWattage> psuWattage(){

        return psuWattageDao.findAll();
    }
}
