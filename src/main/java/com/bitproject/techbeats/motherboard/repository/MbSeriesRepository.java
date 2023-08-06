package com.bitproject.techbeats.motherboard.repository;

import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.motherboard.model.MotherboardSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MbSeriesRepository extends JpaRepository<MotherboardSeries,Integer> {
    @Query(value ="select ms from MotherboardSeries ms where ms.item_brand_id.id=?1")
    List<MotherboardSeries> findByBrand(Integer bid);
}
