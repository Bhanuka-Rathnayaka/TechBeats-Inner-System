package com.bitproject.techbeats.motherboard.controller;

import com.bitproject.techbeats.motherboard.model.MotherboardChipset;
import com.bitproject.techbeats.motherboard.model.MotherboardSeries;
import com.bitproject.techbeats.motherboard.repository.MbChipsetRepository;
import com.bitproject.techbeats.motherboard.repository.MbSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/motherboardchipset")
public class MotherboardChipsetController {

    @Autowired
    private MbChipsetRepository mbChipsetRepository;

    @GetMapping(value = "/all",produces = "application/json")
    public List<MotherboardChipset> motherboardChipsetList(){
        return mbChipsetRepository.findAll();
    }







}
