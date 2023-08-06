package com.bitproject.techbeats.storage.repository;

import com.bitproject.techbeats.storage.model.StorageStatus;
import com.bitproject.techbeats.storage.model.StorageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageTypeRepossitory extends JpaRepository <StorageType,Integer>{
}
