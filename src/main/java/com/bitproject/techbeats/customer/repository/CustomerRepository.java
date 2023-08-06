package com.bitproject.techbeats.customer.repository;

import com.bitproject.techbeats.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    @Query(value = "SELECT lpad(max(c.cus_code)+1,5,'0') FROM techbeats.customer as c;",nativeQuery = true)
    String nextCustomerNumber();

    //get customer by given mobile numbert
    @Query(value = "select c from Customer c where  c.phone=?1")
    Customer findByMobile (String mobileno);

    @Query(value = "select c from Customer c where c.customer_status_id.id=2")
    List<Customer> customerByStatus();
}
