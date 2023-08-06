package com.bitproject.techbeats.purchacerequest.repository;

import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRequestStatusRepository extends JpaRepository<PurchaseRequestStatus,Integer> {
}
