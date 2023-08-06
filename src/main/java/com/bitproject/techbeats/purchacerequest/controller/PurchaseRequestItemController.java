package com.bitproject.techbeats.purchacerequest.controller;

import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestItem;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestItemRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/purchaserequestitem")
public class PurchaseRequestItemController {

    @Autowired
    private PurchaseRequestItemRepository purchaseRequestItemDao;

    @GetMapping(value = "/itembypo/{pid}/&itembycategory/{cid}", produces = "application/json")
    public List<PurchaseRequestItem> getItemByPrandCategory (@PathVariable("pid") Integer pid, @PathVariable("cid") Integer cid){
        return purchaseRequestItemDao.findItemBYPrandCategory(pid,cid);
    }
}
