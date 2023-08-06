package com.bitproject.techbeats.storage.repository;

import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.storage.model.StorageCapasity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageCapasityRepository extends JpaRepository <StorageCapasity,Integer>{
}
