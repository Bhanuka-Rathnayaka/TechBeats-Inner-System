package com.bitproject.techbeats.customer.repository;

import com.bitproject.techbeats.customer.model.CustomerStatus;
import com.bitproject.techbeats.customer.model.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerTypeRepository extends JpaRepository<CustomerType,Integer> {
}
