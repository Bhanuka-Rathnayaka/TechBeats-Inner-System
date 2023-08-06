package com.bitproject.techbeats.powersupply.repository;

import com.bitproject.techbeats.powersupply.model.PsModular;
import com.bitproject.techbeats.powersupply.model.PsSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PsuModularRepository extends JpaRepository<PsModular,Integer> {
}
