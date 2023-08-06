package com.bitproject.techbeats.motherboard.controller;

import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.motherboard.model.MotherboardSeries;
import com.bitproject.techbeats.motherboard.repository.MbSeriesRepository;
import com.bitproject.techbeats.motherboard.repository.MothrboardRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.storage.model.StorageCapasity;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/motherboardsseriess")
public class MotherboardSeriesController {

    @Autowired
    private MbSeriesRepository mbSeriesDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<MotherboardSeries> motherboardSeriesList(){
        return mbSeriesDao.findAll();
    }

    //get mapping for get series buy given brand id(/motherboardsseriess/allbybrand?bid=)
    @GetMapping(value = "/allbybrand",params = "bid",produces = "application/json")
    public List<MotherboardSeries> motherboardSeriesByBrand(@RequestParam("bid") Integer bid){
        return mbSeriesDao.findByBrand(bid);

    }







}
