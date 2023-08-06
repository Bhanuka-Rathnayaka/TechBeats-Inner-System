package com.bitproject.techbeats.motherboard.controller;

import com.bitproject.techbeats.motherboard.model.MotherboardSeries;
import com.bitproject.techbeats.motherboard.model.MotherboardStatus;
import com.bitproject.techbeats.motherboard.repository.MbSeriesRepository;
import com.bitproject.techbeats.motherboard.repository.MbStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/motherboardstatus")
public class MotherboardStatusController {

    @Autowired
    private MbStatusRepository mbStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<MotherboardStatus> motherboardStatusList(){
        return mbStatusDao.findAll();
    }








}
