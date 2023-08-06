package com.bitproject.techbeats.invoice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class InvoicePaymentController {
    
    @GetMapping(value = "/invoicepayment")
    public ModelAndView InvoicePaymentView(){
        ModelAndView invoicePaymentUI = new ModelAndView();
        invoicePaymentUI.setViewName("invoicepayment.html");
        return invoicePaymentUI;
    }
}
