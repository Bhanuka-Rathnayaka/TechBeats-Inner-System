package com.bitproject.techbeats.vga.controller;

import com.bitproject.techbeats.vga.modal.VgaCapacity;
import com.bitproject.techbeats.vga.modal.VgaSeries;
import com.bitproject.techbeats.vga.repository.VgaCapacityRepository;
import com.bitproject.techbeats.vga.repository.VgaSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgaseries")
public class VgaSeriesController {
    @Autowired
    private VgaSeriesRepository vgaSeriesDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaSeries> vgaSeriesList(){
        return vgaSeriesDao.findAll();
    }
}
