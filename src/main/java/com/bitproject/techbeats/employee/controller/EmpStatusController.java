package com.bitproject.techbeats.employee.controller;

import com.bitproject.techbeats.employee.model.Designation;
import com.bitproject.techbeats.employee.model.EmployeeStatus;
import com.bitproject.techbeats.employee.repository.DesignationRepository;
import com.bitproject.techbeats.employee.repository.EmpStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/empstatus")
public class EmpStatusController {

    @Autowired
    private EmpStatusRepository empStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List <EmployeeStatus> empStatusFindAll(){
        return empStatusDao.findAll();
    }
}
