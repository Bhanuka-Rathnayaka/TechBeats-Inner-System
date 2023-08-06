package com.bitproject.techbeats.customer.repository;

import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customer.model.CustomerStatus;
import org.springframework.data.jpa.mapping.JpaPersistentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerStatusRepository extends JpaRepository<CustomerStatus,Integer> {
}
