package com.bitproject.techbeats.ram.repositary;
import com.bitproject.techbeats.ram.model.RamProductSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RamSeriesRepository extends JpaRepository<RamProductSeries,Integer> {
}
