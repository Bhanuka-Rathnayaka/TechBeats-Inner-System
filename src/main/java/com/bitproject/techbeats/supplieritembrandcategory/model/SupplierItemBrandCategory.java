package com.bitproject.techbeats.supplieritembrandcategory.model;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemCategory;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity

@Table(name = "supplier_has_item_category")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierItemBrandCategory {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="supplier_id",referencedColumnName = "id")
    @JsonIgnore
    private Supplier supplier_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;
}
