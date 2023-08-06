package com.bitproject.techbeats.casing.repository;

import com.bitproject.techbeats.casing.model.CasingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasingStatusRepository extends JpaRepository<CasingStatus,Integer> {
}
