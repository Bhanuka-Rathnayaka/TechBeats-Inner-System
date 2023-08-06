package com.bitproject.techbeats.invoiceitem.model;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.item.ItemCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity

@Table(name = "invoiceitem")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InvoiceItem {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="invoice_id",referencedColumnName = "id")
    @JsonIgnore
    private Invoice invoice_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @Column(name = "itemcode")
    private String itemcode;

    @Column(name = "itemname")
    private String itemname;

    @Column(name = "serialnumber")
    private String serialnumber;

    @Column(name = "itemprice")
    private BigDecimal itemprice;

    @Column(name = "warrenty")
    private BigDecimal warrenty;

}
