package com.bitproject.techbeats.purchacerequest.repository;

import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRequestItemRepository extends JpaRepository<PurchaseRequestItem,Integer> {

    @Query(value = "select pri from PurchaseRequestItem pri where pri.purchase_request_id.id in (select pr.id from PurchaseRequest pr where pr.id =?1 and pri.item_category_id.id=?2)")
    List<PurchaseRequestItem> findItemBYPrandCategory(Integer pid,Integer sid);
}
