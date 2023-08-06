package com.bitproject.techbeats.cooler.model;

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

@Table(name = "cooler")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cooler {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cooler_code")
    private String cooler_code;

    @ManyToOne()
    @JoinColumn(name ="cooler_type_id",referencedColumnName = "id")
    private CoolerType cooler_type_id;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="cooler_series_id",referencedColumnName = "id")
    private CoolerSeries cooler_series_id;

    @Column(name = "modelname")
    private String modelname;

    @Column(name = "name")
    private String name;

    @Column(name = "height")
    private Integer height;

    @Column(name = "radiator")
    private Integer radiator;

    @Column(name = "rgbsupport")
     private Boolean rgbsupport;

    @ManyToOne()
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    @ManyToOne()
    @JoinColumn(name ="updateuser_id",referencedColumnName = "id")
    private User updateuser_id;

    @ManyToOne()
    @JoinColumn(name ="deleteuser_id",referencedColumnName = "id")
    private User deleteuser_id;

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

    @Column(name = "warranty")
    private Integer warranty;

    @ManyToOne()
    @JoinColumn(name ="cooler_status_id",referencedColumnName = "id")
    private CoolerStatus cooler_status_id;

    public Cooler(Integer id,String cooler_code,String name,CoolerStatus cooler_status_id,BigDecimal purchase_price,BigDecimal sale_price){
        this.id = id;
        this.cooler_code = cooler_code;
        this.name = name;
        this.cooler_status_id = cooler_status_id;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
    }

    public Cooler(Integer id,String cooler_code,String name,BigDecimal purchase_price,BigDecimal sale_price) {
        this.id = id;
        this.cooler_code = cooler_code;
        this.name = name;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;

    }

    public Cooler(Integer id,String cooler_code,String name,BigDecimal purchase_price,BigDecimal sale_price,Integer warranty) {
        this.id = id;
        this.cooler_code = cooler_code;
        this.name = name;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
        this.warranty = warranty;

    }
}
