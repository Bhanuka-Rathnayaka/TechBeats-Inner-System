package com.bitproject.techbeats.invoice.repossitory;

import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.invoice.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceStatusRepository extends JpaRepository<InvoiceStatus,Integer> {

}


