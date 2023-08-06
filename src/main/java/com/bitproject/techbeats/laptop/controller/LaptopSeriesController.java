package com.bitproject.techbeats.laptop.controller;

import com.bitproject.techbeats.laptop.model.LaptopSeries;
import com.bitproject.techbeats.laptop.repository.LaptopSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/laptopseries")
public class LaptopSeriesController {

    @Autowired
    private LaptopSeriesRepository laptopSeriesDao;

    @GetMapping(value = "/allbybrand", params = "bid",produces = "application/json")
    public List<LaptopSeries> laptopSeriesByBrand(@RequestParam ("bid") Integer bid){
        return laptopSeriesDao.findLaptopSeriesByBrand(bid);

    }
}
