package com.bitproject.techbeats.vga.controller;

import com.bitproject.techbeats.vga.modal.VgaCapacity;
import com.bitproject.techbeats.vga.modal.VgaChipset;
import com.bitproject.techbeats.vga.repository.VgaCapacityRepository;
import com.bitproject.techbeats.vga.repository.VgaChipsetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgachipset")
public class VgaChipsetController {
    @Autowired
    private VgaChipsetRepository vgaChipsetDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaChipset> vgaChipsetList(){
        return vgaChipsetDao.findAll();
    }
}
