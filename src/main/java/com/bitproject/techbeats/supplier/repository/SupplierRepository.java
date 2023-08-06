package com.bitproject.techbeats.supplier.repository;

import com.bitproject.techbeats.supplier.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierRepository extends JpaRepository<Supplier,Integer> {
//next code
    @Query(value = "SELECT CONCAT('SUP', LPAD(MAX(SUBSTRING(sup.sup_code, 4))+1, 5, '0')) FROM techbeats.supplier as sup;",nativeQuery = true)
    String nextSupCode();

}
