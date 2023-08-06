package com.bitproject.techbeats.powersupply.repository;

import com.bitproject.techbeats.powersupply.model.PsEfficienct;
import com.bitproject.techbeats.powersupply.model.PsWattage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PsuWattageRepository extends JpaRepository<PsWattage,Integer> {
}
