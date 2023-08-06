package com.bitproject.techbeats.invoice.repossitory;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.invoice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {

    //add default value to number(increment only last digit)


    @Query(value = "SELECT CONCAT('IN', LPAD(MAX(CAST(SUBSTRING(c.invoicenumber, 3) AS UNSIGNED))+1, 5, '0')) FROM Invoice AS c", nativeQuery = true)
    String nextInCode();

    @Query(value = "select inc from Invoice  inc where inc.invoicenumber=?1")
    Invoice getReferenceByInvoiceCode(String code);
}


