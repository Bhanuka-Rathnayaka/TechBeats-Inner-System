package com.bitproject.techbeats.purchacerequest.repository;

import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest,Integer> {



    @Query(value = "SELECT CONCAT('PO', LPAD(MAX(SUBSTRING(pr.code, 3))+1, 5, '0')) FROM techbeats.purchase_request as pr;",nativeQuery = true)
    String getNexCode();

    @Query(value = "select pr from PurchaseRequest pr where pr.supplier_id.id = ?1 and pr.purchase_status_id='1'")
    List<PurchaseRequest>findPRBYSupplier(Integer sid);



}
