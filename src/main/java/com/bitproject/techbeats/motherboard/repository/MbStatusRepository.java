package com.bitproject.techbeats.motherboard.repository;

import com.bitproject.techbeats.motherboard.model.MotherboardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MbStatusRepository extends JpaRepository<MotherboardStatus,Integer> {
}
