package com.bitproject.techbeats.customer.controller;

import com.bitproject.techbeats.casing.model.CasingColor;
import com.bitproject.techbeats.customer.model.CustomerType;
import com.bitproject.techbeats.customer.repository.CustomerTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customertype")
public class CustomerTypeController {
    @Autowired
    private CustomerTypeRepository customerTypeDao;

    //create mapping for get customer type all details("/customertype/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CustomerType> customerTypesFindAll(){

        return customerTypeDao.findAll();
    }
}
