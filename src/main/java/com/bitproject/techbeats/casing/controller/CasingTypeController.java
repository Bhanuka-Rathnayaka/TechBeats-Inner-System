package com.bitproject.techbeats.casing.controller;

import com.bitproject.techbeats.casing.model.CasingSeries;
import com.bitproject.techbeats.casing.model.CasingType;
import com.bitproject.techbeats.casing.repository.CasingSeriesRepository;
import com.bitproject.techbeats.casing.repository.CasingTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/casingtype")
public class CasingTypeController {

    @Autowired
    private CasingTypeRepository casingTypeDao;

    //create mapping for get casing all details("/psu/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CasingType> casingTypeFindAll(){

        return casingTypeDao.findAll();
    }
}
