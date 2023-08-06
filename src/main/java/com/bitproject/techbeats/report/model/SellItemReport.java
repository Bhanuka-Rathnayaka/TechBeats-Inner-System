package com.bitproject.techbeats.report.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellItemReport {
    private String date;
    private String itemCode;
    private String itemName;
    private String sellItemcount;
    private String itemPrice;
    private String lineTotal;

}
