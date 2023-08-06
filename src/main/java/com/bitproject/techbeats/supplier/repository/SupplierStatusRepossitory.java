package com.bitproject.techbeats.supplier.repository;

import com.bitproject.techbeats.storage.model.StorageStatus;
import com.bitproject.techbeats.supplier.model.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierStatusRepossitory extends JpaRepository <SupplierStatus,Integer>{
}
