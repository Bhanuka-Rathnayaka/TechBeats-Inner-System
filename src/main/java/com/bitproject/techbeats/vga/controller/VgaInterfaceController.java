package com.bitproject.techbeats.vga.controller;

import com.bitproject.techbeats.vga.modal.VgaCapacity;
import com.bitproject.techbeats.vga.modal.VgaInterface;
import com.bitproject.techbeats.vga.repository.VgaCapacityRepository;
import com.bitproject.techbeats.vga.repository.VgaInterfaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vgainterface")
public class VgaInterfaceController {
    @Autowired
    private VgaInterfaceRepository vgaInterfaceDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<VgaInterface> vgaInterfaceList(){
        return vgaInterfaceDao.findAll();
    }
}
