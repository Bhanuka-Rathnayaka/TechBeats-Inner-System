package com.bitproject.techbeats.grn.model;

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

@Table(name = "grn_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GrnItem {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="grn_id",referencedColumnName = "id")
    @JsonIgnore
    private Grn grn_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @Column(name = "itemcode")
    private String itemcode;

    @Column(name = "itemname")
    private String itemname;

    @Column(name = "itemprice")
    private BigDecimal itemprice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "linetotal")
    private BigDecimal linetotal;

}
