package com.bitproject.techbeats.customerorderitem.repository;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerOrderItemRepository extends JpaRepository<CustomerOrderItem,Integer> {

    @Query(value = "select coi from CustomerOrderItem as coi where coi.customerorder_id.id=?1")
    List<CustomerOrderItem>getCoiListForCO(Integer coid);

}


