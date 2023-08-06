package com.bitproject.techbeats.powersupply.controller;
import com.bitproject.techbeats.powersupply.model.PsEfficienct;
import com.bitproject.techbeats.powersupply.model.PsModular;
import com.bitproject.techbeats.powersupply.repository.PsuEfficienceRepository;
import com.bitproject.techbeats.powersupply.repository.PsuModularRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/psumodular")
public class PsuModularController {
    @Autowired
    private PsuModularRepository psuModularDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<PsModular> psuModular(){

        return psuModularDao.findAll();
    }
}
