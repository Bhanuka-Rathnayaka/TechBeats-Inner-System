package com.bitproject.techbeats.laptop.model;

import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemCategory;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "laptop")
//create getters and setters
@Data
//constructor with parameters for all field
@AllArgsConstructor
// generate a default constructor without any parameters
@NoArgsConstructor
//ignore null value in object
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Laptop {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="lap_seres_id",referencedColumnName = "id")
    private LaptopSeries lap_seres_id;

    @Column(name = "modelname")
    private String modelname;

    @Column(name = "name")
    private String name;

    @Column(name = "processor")
    private String processor;

    @Column(name = "ram")
    private String ram;

    @Column(name = "storage")
    private String storage;

    @Column(name = "vga")
    private String vga;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "profit_rate")
    private BigDecimal profit_rate;

    @Column(name = "sale_price")
    private BigDecimal sale_price;

    @Column(name = "warrenty")
    private Integer warrenty;

    @ManyToOne()
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    @ManyToOne()
    @JoinColumn(name ="updateuser_id",referencedColumnName = "id")
    private User updateuser_id;

    @ManyToOne()
    @JoinColumn(name ="deleteuser_id",referencedColumnName = "id")
    private User deleteuser_id;

    @ManyToOne()
    @JoinColumn(name ="lap_status_id",referencedColumnName = "id")
    private LaptopStatus lap_status_id;

    public Laptop(Integer id,String code,String name,BigDecimal purchase_price,BigDecimal sale_price,Integer warrenty){
        this.id = id;
        this.code = code;
        this.name = name;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
        this.warrenty = warrenty;
    }


}
