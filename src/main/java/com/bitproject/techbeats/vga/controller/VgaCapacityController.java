package com.bitproject.techbeats.vga.controller;


import com.bitproject.techbeats.vga.modal.VgaCapacity;

import com.bitproject.techbeats.vga.repository.VgaCapacityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgacapacity")
public class VgaCapacityController {
    @Autowired
    private VgaCapacityRepository vgaCapacityDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaCapacity> vgaCapacityList(){
        return vgaCapacityDao.findAll();
    }
}
