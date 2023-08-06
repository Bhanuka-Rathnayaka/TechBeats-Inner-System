package com.bitproject.techbeats.serielno.controller;

import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.report.model.AvailableStockReport;
import com.bitproject.techbeats.report.model.SellItemReport;
import com.bitproject.techbeats.serielno.model.Seriel;
import com.bitproject.techbeats.serielno.repository.SerielRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SerielController {
    @Autowired
    private SerielRepository serielDao;

    //load Cooler ui
    @GetMapping(value = "/stock_check")
    public ModelAndView stockView(){
        ModelAndView stockUI = new ModelAndView();
        stockUI.setViewName("checkstock.html");
        return stockUI;
    }

    @GetMapping(value = "serielnumber/bycategoryandcode/{catid}/{code}",produces = "application/json")
    public List<Seriel> serielListByCategoryAndCode(@PathVariable("catid") Integer catid,@PathVariable("code") String code){
        return serielDao.getSerielListForInvoice(catid,code);
    }

    //get full available stock report
    @GetMapping(value = "serielnumber/bycategory",produces = "application/json")
    public List<AvailableStockReport> availableSerialListByCategory(){
        String[][] reportDataList = new String[100][4];

        reportDataList = serielDao.getAvailableSerial();
        //create arraylist AvailableStockReport list instance
        List<AvailableStockReport>availableStockReportList = new ArrayList<>();

        for (int i=0; i<reportDataList.length;i++){
            //array list eak athule object ekaka instance ekak
            AvailableStockReport availableStockReport = new AvailableStockReport();

            availableStockReport.setCategoryname(reportDataList[i][0]);
            availableStockReport.setItemcode(reportDataList[i][1]);
            availableStockReport.setItemname(reportDataList[i][2]);
           availableStockReport.setCount(reportDataList[i][3]);
            availableStockReportList.add(availableStockReport);

        }
        return availableStockReportList;
    }

    @GetMapping(value = "/availableserial",produces = "application/json")
    public Seriel availableList(){
        return serielDao.getAllAvailableSerial();
    }
}
