package com.bitproject.techbeats.ram.controller;

import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.ram.model.RamStatus;
import com.bitproject.techbeats.ram.model.RamType;
import com.bitproject.techbeats.ram.repositary.RamStatusRepository;
import com.bitproject.techbeats.ram.repositary.RamTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/ramtype")
public class RamTypeController {
    @Autowired
    private RamTypeRepository ramTypeDao;

    //create mapping for get ramtypes all details("/ramtype/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<RamType> ramTypeList(){

        return ramTypeDao.findAll();
    }


    //get mapping service for get ram by given path variable id[/ramtype/bypid/1]
    @GetMapping(value = "/bypid/{id}",produces = "application/json")
    public List<RamType> ramTypeByPID(@PathVariable("id") Integer id){
        return ramTypeDao.getRamType(id);
    }



}
