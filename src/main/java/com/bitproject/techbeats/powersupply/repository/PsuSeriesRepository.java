package com.bitproject.techbeats.powersupply.repository;

import com.bitproject.techbeats.powersupply.model.PsSeries;
import com.bitproject.techbeats.powersupply.model.PsStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PsuSeriesRepository extends JpaRepository<PsSeries,Integer> {
}
