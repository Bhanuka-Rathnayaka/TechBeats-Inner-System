package com.bitproject.techbeats.cooler.repository;

import com.bitproject.techbeats.cooler.model.CoolerSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CoolerSeriesRepository extends JpaRepository<CoolerSeries,Integer> {
    //quary for get cooler series for given brand id
    @Query(value ="select cs from CoolerSeries cs where cs.item_brand_id.id=?1")
    List<CoolerSeries>findByBrand(Integer bid);

}
