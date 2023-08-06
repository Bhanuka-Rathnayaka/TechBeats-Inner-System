package com.bitproject.techbeats.powersupply.repository;

import com.bitproject.techbeats.powersupply.model.PsEfficienct;
import com.bitproject.techbeats.powersupply.model.PsSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PsuEfficienceRepository extends JpaRepository<PsEfficienct,Integer> {
}
