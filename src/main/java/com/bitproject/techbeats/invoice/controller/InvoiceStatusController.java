package com.bitproject.techbeats.invoice.controller;

import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderStatusRepository;
import com.bitproject.techbeats.invoice.model.InvoiceStatus;
import com.bitproject.techbeats.invoice.repossitory.InvoiceStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/invoicestatus")
public class InvoiceStatusController {

    @Autowired
    private InvoiceStatusRepository invoiceStatusDao;

    @GetMapping(value = "all",produces = "application/json")
    public List<InvoiceStatus>invoiceStatusList(){
        return invoiceStatusDao.findAll();
    }
}
