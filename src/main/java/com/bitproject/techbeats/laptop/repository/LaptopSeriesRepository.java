package com.bitproject.techbeats.laptop.repository;

import com.bitproject.techbeats.laptop.model.Laptop;
import com.bitproject.techbeats.laptop.model.LaptopSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LaptopSeriesRepository extends JpaRepository<LaptopSeries,Integer> {

    @Query(value = "select ls from LaptopSeries ls where ls.item_brand_id.id=?1")
    List<LaptopSeries>findLaptopSeriesByBrand(Integer bid);
}
