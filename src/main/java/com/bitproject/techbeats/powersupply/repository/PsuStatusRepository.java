package com.bitproject.techbeats.powersupply.repository;

import com.bitproject.techbeats.powersupply.model.PsStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PsuStatusRepository extends JpaRepository<PsStatus,Integer> {
}
