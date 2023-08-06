package com.bitproject.techbeats.invoice.repossitory;

import com.bitproject.techbeats.invoice.model.InvoiceStatus;
import com.bitproject.techbeats.invoice.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod,Integer> {

}


