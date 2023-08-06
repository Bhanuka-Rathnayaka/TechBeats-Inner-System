package com.bitproject.techbeats.storage.repository;

import com.bitproject.techbeats.storage.model.StorageInterface;
import com.bitproject.techbeats.storage.model.StorageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageStatusRepossitory extends JpaRepository <StorageStatus,Integer>{
}
