package com.bitproject.techbeats.motherboard.controller;

import com.bitproject.techbeats.motherboard.model.MotherboardChipset;
import com.bitproject.techbeats.motherboard.model.MotherboardFormfactor;
import com.bitproject.techbeats.motherboard.repository.MbChipsetRepository;
import com.bitproject.techbeats.motherboard.repository.MbFormfactorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/motherboardformfactor")
public class MotherboardFormfactorController {

    @Autowired
    private MbFormfactorRepository mbFormfactorDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<MotherboardFormfactor> motherboardFormfactorList(){
        return mbFormfactorDao.findAll();
    }







}
