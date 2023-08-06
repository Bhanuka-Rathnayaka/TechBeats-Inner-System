package com.bitproject.techbeats.motherboard.repository;

import com.bitproject.techbeats.motherboard.model.MotherboardFormfactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MbFormfactorRepository extends JpaRepository<MotherboardFormfactor,Integer> {
}
