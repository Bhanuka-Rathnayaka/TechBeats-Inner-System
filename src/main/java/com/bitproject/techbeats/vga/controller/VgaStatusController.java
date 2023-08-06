package com.bitproject.techbeats.vga.controller;

import com.bitproject.techbeats.vga.modal.VgaSeries;
import com.bitproject.techbeats.vga.modal.VgaStatus;
import com.bitproject.techbeats.vga.repository.VgaSeriesRepository;
import com.bitproject.techbeats.vga.repository.VgaStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgastatus")
public class VgaStatusController {
    @Autowired
    private VgaStatusRepository vgaStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaStatus> vgaStatusList(){
        return vgaStatusDao.findAll();
    }
}
