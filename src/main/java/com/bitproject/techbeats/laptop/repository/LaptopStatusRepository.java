package com.bitproject.techbeats.laptop.repository;

import com.bitproject.techbeats.laptop.model.LaptopSeries;
import com.bitproject.techbeats.laptop.model.LaptopStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LaptopStatusRepository extends JpaRepository<LaptopStatus,Integer> {


}
