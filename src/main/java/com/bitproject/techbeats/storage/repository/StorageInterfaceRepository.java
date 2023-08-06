package com.bitproject.techbeats.storage.repository;

import com.bitproject.techbeats.storage.model.StorageFormfactor;
import com.bitproject.techbeats.storage.model.StorageInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageInterfaceRepository extends JpaRepository <StorageInterface,Integer>{
}
