package com.bitproject.techbeats.casing.controller;

import com.bitproject.techbeats.casing.model.CasingStatus;
import com.bitproject.techbeats.casing.model.CasingType;
import com.bitproject.techbeats.casing.repository.CasingStatusRepository;
import com.bitproject.techbeats.casing.repository.CasingTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/casingstatus")
public class CasingStatusController {

    @Autowired
    private CasingStatusRepository casingStatusDao;

    //create mapping for get casing all details("/psu/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CasingStatus> casingStatusFindAll(){

        return casingStatusDao.findAll();
    }
}
