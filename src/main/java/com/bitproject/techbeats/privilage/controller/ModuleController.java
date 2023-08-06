package com.bitproject.techbeats.privilage.controller;

import com.bitproject.techbeats.privilage.model.Module;
import com.bitproject.techbeats.privilage.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleDao;

    //request mapping for get all module
    @GetMapping(value = "/all",produces = "application/json")
    public List <Module> moduleFindAll(){
        return moduleDao.findAll();
    }
}
