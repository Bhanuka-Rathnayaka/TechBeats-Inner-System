package com.bitproject.techbeats.report.controller;

import com.bitproject.techbeats.report.model.InvoiceReport;
import com.bitproject.techbeats.report.model.SellItemReport;
import com.bitproject.techbeats.report.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ReportDataController {
    @Autowired
    private ReportRepository reportDao;

    @GetMapping(value = "/invoicereport/bydatetype",params = {"sdate","edate","type"},produces = "application/json")
    public List<InvoiceReport> getInvoiceByDateType(@RequestParam("sdate") String sdate,@RequestParam("edate") String edate,@RequestParam("type") String type){

        String[][] reportDataList = new String[100][4];


        if(type.equals("Daily"))
            reportDataList =  reportDao.getInvoiceReportDaily(sdate,edate);
        if(type.equals("Weekly"))
            reportDataList =  reportDao.getInvoiceReportWeekly(sdate,edate);
        if(type.equals("Monthly"))
            reportDataList =  reportDao.getInvoiceReportMonthly(sdate,edate);
        if(type.equals("Anualy"))
            reportDataList =  reportDao.getInvoiceReportAnualy(sdate,edate);


        List<InvoiceReport> invoiceReportList = new ArrayList<>();
        for (int i=0; i<reportDataList.length;i++){
            InvoiceReport invoiceReport = new InvoiceReport();

            if(type.equals("Daily")){
                invoiceReport.setDate(reportDataList[i][1]);
            }

            if(type.equals("Weekly")){
                invoiceReport.setDate(reportDataList[i][0] + '-' + reportDataList[i][1]);
            }

            if(type.equals("Monthly")){
                invoiceReport.setDate(reportDataList[i][0] + '-' + reportDataList[i][1]);
            }

            if(type.equals("Anualy")){
                invoiceReport.setDate(reportDataList[i][0]);
            }

            /*invoiceReport.setDate(reportDataList[i][0] + '-' + reportDataList[i][1]);*/
            invoiceReport.setInvoicecount(reportDataList[i][2]);
            invoiceReport.setTotalamount(reportDataList[i][3]);
            invoiceReportList.add(invoiceReport);
        }
        return invoiceReportList;
    }


    //get sell item for particular category and date
    @GetMapping(value = "/sellitemreport/bydatetypeandcategory",params = {"cid","sdate","edate"},produces = "application/json")
    public List<SellItemReport> getSellItemReport(@RequestParam("cid") Integer cid, @RequestParam("sdate") String sdate, @RequestParam("edate") String edate){

        String[][] reportDataList = new String[100][4];

        reportDataList = reportDao.getSellItemReport(cid, sdate, edate);

        List<SellItemReport> sellItemReportsList = new ArrayList<>();


        for (int i=0; i<reportDataList.length;i++){
            SellItemReport sellItemReport = new SellItemReport();

            sellItemReport.setDate(reportDataList[i][0]);
            sellItemReport.setItemCode(reportDataList[i][1]);
            sellItemReport.setItemName(reportDataList[i][2]);
            sellItemReport.setSellItemcount(reportDataList[i][3]);
            sellItemReport.setItemPrice(reportDataList[i][4]);

            Integer count = Integer.valueOf(reportDataList[i][3]);
            Integer price = Integer.valueOf(reportDataList[i][4]);

            Integer lineTotal = count*price;

            sellItemReport.setLineTotal(String.valueOf(lineTotal));
            sellItemReportsList.add(sellItemReport);

        }
        return sellItemReportsList;

    }

    ////query for get total of invoice amount in current date
    @GetMapping(value = "/sellitemreport/bydatetypeandcategory",params = {"today"},produces = "application/json")
    public List<InvoiceReport> getIvoiceTotal(@RequestParam("today") String  today){

        String[][] reportDataList = new String[100][4];

        reportDataList = reportDao.getInvoiceAmountToday(today);
        List<InvoiceReport> invoiceAmountList = new ArrayList<>();


        for (int i=0; i<reportDataList.length;i++){
            InvoiceReport invoiceReport = new InvoiceReport();
            invoiceReport.setDate(reportDataList[i][1]);
            invoiceReport.setInvoicecount(reportDataList[i][2]);
            invoiceReport.setTotalamount(reportDataList[i][3]);
            invoiceAmountList.add(invoiceReport);

        }
        return invoiceAmountList;
    }




}
