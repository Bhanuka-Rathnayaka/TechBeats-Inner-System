package com.bitproject.techbeats.invoice.controller;

import com.bitproject.techbeats.invoice.model.InvoiceStatus;
import com.bitproject.techbeats.invoice.model.PaymentMethod;
import com.bitproject.techbeats.invoice.repossitory.InvoiceStatusRepository;
import com.bitproject.techbeats.invoice.repossitory.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentmethod")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodRepository paymentMethodDao;

    @GetMapping(value = "all",produces = "application/json")
    public List<PaymentMethod>paymentMethodList(){
        return paymentMethodDao.findAll();
    }
}
