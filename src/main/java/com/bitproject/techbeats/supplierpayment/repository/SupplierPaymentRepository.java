package com.bitproject.techbeats.supplierpayment.repository;

import com.bitproject.techbeats.supplierpayment.model.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment,Integer> {
}
