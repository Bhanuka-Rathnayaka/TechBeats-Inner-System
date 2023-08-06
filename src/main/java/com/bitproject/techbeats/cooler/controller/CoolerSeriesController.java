package com.bitproject.techbeats.cooler.controller;


import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.cooler.repository.CoolerSeriesRepository;
import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemBrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/coolerseriess")
public class CoolerSeriesController {
    @Autowired
    private CoolerSeriesRepository coolerSeriesDao;

    //create mapping for get designation all details("/seriess/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<CoolerSeries> coolerSeriesList(){
        return coolerSeriesDao.findAll();
    }

    //get mapping for get series bu given brand id(/seriess/allbybrand?bid=)
    @GetMapping(value = "/allbybrand",params = "bid",produces = "application/json")
    public List<CoolerSeries> coolerSeriesByBrand(@RequestParam("bid") Integer bid){
        return coolerSeriesDao.findByBrand(bid);

    }
}
