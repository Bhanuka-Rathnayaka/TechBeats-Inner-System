package com.bitproject.techbeats.powersupply.controller;
import com.bitproject.techbeats.powersupply.model.PsModular;
import com.bitproject.techbeats.powersupply.model.PsStatus;
import com.bitproject.techbeats.powersupply.repository.PsuModularRepository;
import com.bitproject.techbeats.powersupply.repository.PsuStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/psustatus")
public class PsuStatusController {
    @Autowired
    private PsuStatusRepository psuStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<PsStatus> psuStatus(){

        return psuStatusDao.findAll();
    }
}
