package com.bitproject.techbeats.laptop.controller;

import com.bitproject.techbeats.grn.model.GrnStatus;
import com.bitproject.techbeats.grn.repository.GrnStatusRepository;
import com.bitproject.techbeats.laptop.model.LaptopStatus;
import com.bitproject.techbeats.laptop.repository.LaptopStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/grnstatus")
public class GrnStatusController {

    @Autowired
    private GrnStatusRepository grnStatusDao;

    //get all status
    @GetMapping(value = "/all",produces = "application/json")
    public List<GrnStatus> getgrnStatuses(){
        return grnStatusDao.findAll();
    }
}
