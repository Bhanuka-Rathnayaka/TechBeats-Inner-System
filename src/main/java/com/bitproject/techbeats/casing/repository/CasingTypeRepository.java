package com.bitproject.techbeats.casing.repository;

import com.bitproject.techbeats.casing.model.CasingStatus;
import com.bitproject.techbeats.casing.model.CasingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasingTypeRepository extends JpaRepository<CasingType,Integer> {
}
