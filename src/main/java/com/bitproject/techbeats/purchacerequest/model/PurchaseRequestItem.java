package com.bitproject.techbeats.purchacerequest.model;
import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity

@Table(name = "purchase_request_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseRequestItem {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="purchase_request_id",referencedColumnName = "id")
    @JsonIgnore
    private PurchaseRequest purchase_request_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

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
