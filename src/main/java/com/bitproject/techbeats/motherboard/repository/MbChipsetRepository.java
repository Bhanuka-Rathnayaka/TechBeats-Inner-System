package com.bitproject.techbeats.motherboard.repository;

import com.bitproject.techbeats.motherboard.model.MotherboardChipset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MbChipsetRepository extends JpaRepository<MotherboardChipset,Integer> {
}
