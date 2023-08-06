package com.bitproject.techbeats.cooler.repository;

import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.cooler.model.CoolerType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoolerTypeRepository extends JpaRepository<CoolerType,Integer> {

}
