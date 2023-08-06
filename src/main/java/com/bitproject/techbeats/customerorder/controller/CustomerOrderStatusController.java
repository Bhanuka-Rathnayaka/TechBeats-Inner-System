package com.bitproject.techbeats.customerorder.controller;

import com.bitproject.techbeats.customer.repository.CustomerStatusRepository;
import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderRepository;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerorderstatus")
public class CustomerOrderStatusController {

    @Autowired
    private CustomerOrderStatusRepository customerOrderStatusDao;

    @GetMapping(value = "all",produces = "application/json")
    public List<CustomerOrderStatus>customerOrderStatusesList(){
        return customerOrderStatusDao.findAll();
    }
}
