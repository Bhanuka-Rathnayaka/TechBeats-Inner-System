package com.bitproject.techbeats.casing.repository;

import com.bitproject.techbeats.casing.model.CasingColor;
import com.bitproject.techbeats.casing.model.CasingSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasingSeriesRepository extends JpaRepository<CasingSeries,Integer> {
}
