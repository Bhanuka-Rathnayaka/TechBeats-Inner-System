package com.bitproject.techbeats.employee.controller;

import com.bitproject.techbeats.employee.model.Designation;
import com.bitproject.techbeats.employee.repository.DesignationRepository;
import com.bitproject.techbeats.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/designation")
public class DesignationController {

    @Autowired
    private DesignationRepository designationDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List <Designation> designationsFindAll(){
        return designationDao.findAll();
    }
}
