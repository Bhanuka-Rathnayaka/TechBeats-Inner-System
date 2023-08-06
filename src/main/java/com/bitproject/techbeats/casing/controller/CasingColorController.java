package com.bitproject.techbeats.casing.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.casing.model.CasingColor;
import com.bitproject.techbeats.casing.repository.CasingColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/casingcolor")
public class CasingColorController {

    @Autowired
    private CasingColorRepository casingColorDao;

    //create mapping for get casing all details("/psu/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CasingColor> casingColorFindAll(){

        return casingColorDao.findAll();
    }
}
