package com.bitproject.techbeats.vga.controller;

import com.bitproject.techbeats.vga.modal.VgaStatus;
import com.bitproject.techbeats.vga.modal.VgaType;
import com.bitproject.techbeats.vga.repository.VgaStatusRepository;
import com.bitproject.techbeats.vga.repository.VgaTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgatype")
public class VgaTypeController {
    @Autowired
    private VgaTypeRepository vgaTypeDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaType> vgaTypeList(){
        return vgaTypeDao.findAll();
    }
}
