package com.bitproject.techbeats.customerorderitem.controller;

import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.customerorderitem.repository.CustomerOrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerorderitem")
public class CustomerOrderItemController {

    @Autowired
    private CustomerOrderItemRepository customerOrderItemDao;

    @GetMapping(value = "/getbycoid/{coid}",produces = "application/json")
    public List<CustomerOrderItem> customerOrderItemListByCoid(@PathVariable("coid") Integer coid){
        return customerOrderItemDao.getCoiListForCO(coid);
    }

}
