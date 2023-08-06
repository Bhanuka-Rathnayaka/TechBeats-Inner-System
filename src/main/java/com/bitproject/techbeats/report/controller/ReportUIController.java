package com.bitproject.techbeats.report.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping()
public class ReportUIController {
    @GetMapping("/invoicereport")
    public ModelAndView invoiceReportView(){
        ModelAndView invoiceReport = new ModelAndView();
        invoiceReport.setViewName("invoicereport.html");
        return invoiceReport;
    }

    @GetMapping("/sellitemreport")
    public ModelAndView sellItemReportView(){
        ModelAndView sellItemReport = new ModelAndView();
        sellItemReport.setViewName("sellitemreport.html");
        return sellItemReport;
    }

    @GetMapping("/stockcheck")
    public ModelAndView stockReportView(){
        ModelAndView stcckReport = new ModelAndView();
        stcckReport.setViewName("stockreport.html");
        return stcckReport;
    }
}
