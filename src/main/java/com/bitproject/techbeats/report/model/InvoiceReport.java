package com.bitproject.techbeats.report.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceReport {
    private String date;
    private String invoicecount;
    private String totalamount;
}
