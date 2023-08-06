package com.bitproject.techbeats.cooler.model;

import com.bitproject.techbeats.item.ItemBrand;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cooler_series")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoolerSeries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne()
    @JoinColumn(name = "item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;
}
