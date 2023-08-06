package com.bitproject.techbeats.customerorder.repository;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Integer> {

    //add default value to number(increment only last digit)
    //@Query(value = "select lpad(max(c.code)+1,5,'0') from CustomerOrder as c;",nativeQuery = true)
    //String nextCoCode();

    @Query(value = "SELECT CONCAT(YEAR(CURRENT_DATE()), 'CO', LPAD(MAX(SUBSTRING(c.code, 7))+1, 5, '0')) FROM CustomerOrder AS c", nativeQuery = true)
    String nextCoCode();

    @Query(value = "select new CustomerOrder (co.id,co.code,co.customer_id) from CustomerOrder co where co.orderstatus_id.id=2 and co.requiredate >= ?1")
    List<CustomerOrder>corderListForInvoice(LocalDate now);

    @Query(value = "select new CustomerOrder (count (co.id)) from CustomerOrder co where co.orderstatus_id.id=2")
    CustomerOrder getPendingCOCount();
}


