package com.bitproject.techbeats.casing.repository;

import com.bitproject.techbeats.casing.model.CasingColor;
import com.bitproject.techbeats.casing.model.CasingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasingColorRepository extends JpaRepository<CasingColor,Integer> {
}
