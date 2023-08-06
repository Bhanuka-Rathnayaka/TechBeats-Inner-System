package com.bitproject.techbeats.purchacerequest.controller;

import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderStatusRepository;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestStatus;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/purchaserequeststatus")
public class PurchaseRequestStatusController {

    @Autowired
    private PurchaseRequestStatusRepository purchaseRequestStatusDao;

    @GetMapping(value = "all",produces = "application/json")
    public List<PurchaseRequestStatus>purchaseRequestStatusesList(){
        return purchaseRequestStatusDao.findAll();
    }
}
