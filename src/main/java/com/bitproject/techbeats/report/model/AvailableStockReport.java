package com.bitproject.techbeats.report.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailableStockReport {
    private String categoryname;
    private String itemcode;
    private String itemname;
    private String count;
}
