package com.bitproject.techbeats.report.repository;

import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.invoice.model.InvoiceStatus;
import com.bitproject.techbeats.item.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Invoice,Integer> {

    @Query(value = "SELECT year(inv.invoicedate),date(inv.invoicedate),count(inv.id),sum(inv.lastprice) FROM techbeats.invoice as inv where inv.invoicedate between ?1 and ?2 group by date(inv.invoicedate);",nativeQuery = true)
    String[][] getInvoiceReportDaily(String sdate, String edate);

    @Query(value = "SELECT year(inv.invoicedate),weekofyear(inv.invoicedate),count(inv.id),sum(inv.lastprice) FROM techbeats.invoice as inv where inv.invoicedate between ?1 and ?2 group by week(inv.invoicedate);",nativeQuery = true)
    String[][] getInvoiceReportWeekly(String sdate, String edate);

    @Query(value = "SELECT year(inv.invoicedate),month(inv.invoicedate),count(inv.id),sum(inv.lastprice) FROM techbeats.invoice as inv where inv.invoicedate between ?1 and ?2 group by month(inv.invoicedate);",nativeQuery = true)
    String[][] getInvoiceReportMonthly(String sdate, String edate);

    @Query(value = "SELECT year(inv.invoicedate),inv.note,count(inv.id),sum(inv.lastprice) FROM techbeats.invoice as inv where inv.invoicedate between ?1 and ?2 group by year(inv.invoicedate);",nativeQuery = true)
    String[][] getInvoiceReportAnualy(String sdate, String edate);



    //query for sell item
    @Query(value = "SELECT inv.invoicedate,invitm.itemcode,invitm.itemname,count(invitm.id),invitm.itemprice FROM techbeats.invoice as inv, techbeats.invoiceitem as invitm, techbeats.item_category as itc where inv.id = invitm.invoice_id and invitm.item_category_id = itc.id and itc.id = ?1 and inv.invoicedate between ?2 and ?3 group by invitm.item_category_id,invitm.itemcode,inv.invoicedate;",nativeQuery = true)
    String[][] getSellItemReport(Integer cid, String sdate, String edate);







    //query for get total of invoice amount in current date
    @Query(value = "SELECT year(inv.invoicedate),date(inv.invoicedate),count(inv.id),sum(inv.lastprice) FROM techbeats.invoice as inv where inv.invoicedate =?1",nativeQuery = true)
    String[][] getInvoiceAmountToday(String today);



}


