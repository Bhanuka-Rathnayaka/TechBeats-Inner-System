package com.bitproject.techbeats.customerorder.repository;

import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderStatusRepository extends JpaRepository<CustomerOrderStatus,Integer> {
}
