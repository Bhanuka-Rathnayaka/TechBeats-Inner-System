package com.bitproject.techbeats.employee.controller;

import com.bitproject.techbeats.employee.model.CivilStatus;
import com.bitproject.techbeats.employee.model.EmployeeStatus;
import com.bitproject.techbeats.employee.repository.CivilStatusRepository;
import com.bitproject.techbeats.employee.repository.EmpStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/civilstatus")
public class CivilStatusController {

    @Autowired
    private CivilStatusRepository CivilStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List <CivilStatus> civilStatusFindAll(){
        return CivilStatusDao.findAll();
    }
}
