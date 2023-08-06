package com.bitproject.techbeats.casing.model;

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

@Table(name = "casing")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Casing {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="casing_code" )
    private String casing_code;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="series_id",referencedColumnName = "id")
    private CasingSeries series_id;

    @Column(name = "model_name")
    private String model_name;

    @Column(name = "casing_name")
    private String casing_name;

    @ManyToOne()
    @JoinColumn(name ="type_id",referencedColumnName = "id")
    private CasingType type_id;

    @Column(name = "ssd_bays")
    private Integer ssd_bays;


    @Column(name = "hdd_bays")
    private Integer hdd_bays;

    @Column(name = "max_gpu_leangth")
    private Integer max_gpu_leangth;

    @Column(name = "max_psu_leangth")
    private Integer max_psu_leangth;

    @Column(name = "max_cpucooler_height")
    private Integer max_cpucooler_height;

    @Column(name = "support_liquidcooling")
    private Boolean support_liquidcooling;

    @Column(name = "max_radiator_leangth")
    private Integer max_radiator_leangth;

    @ManyToOne()
    @JoinColumn(name ="colotr_id",referencedColumnName = "id")
    private CasingColor colotr_id;

    @ManyToOne()
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    @ManyToOne()
    @JoinColumn(name ="updateuser_id",referencedColumnName = "id")
    private User updateuser_id;

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

    @ManyToOne()
    @JoinColumn(name ="status_id",referencedColumnName = "id")
    private CasingStatus status_id;

    @Column(name = "warranty")
    private Integer warrenty;

    public Casing(Integer id,String casing_code,String casing_name,CasingStatus status_id,BigDecimal purchase_price,BigDecimal sale_price){
        this.id=id;
        this.casing_code=casing_code;
        this.casing_name=casing_name;
        this.status_id =status_id;
        this.purchase_price=purchase_price;
        this.sale_price=sale_price;
    }
    public Casing(Integer id,String casing_code,String casing_name,BigDecimal sale_price){
        this.id=id;
        this.casing_code=casing_code;
        this.casing_name=casing_name;
        this.sale_price=sale_price;
    }

    public Casing(Integer id,String casing_code,String casing_name,BigDecimal sale_price,BigDecimal purchase_price){
        this.id=id;
        this.casing_code=casing_code;
        this.casing_name=casing_name;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
    }

    public Casing(Integer id,String casing_code,String casing_name,BigDecimal sale_price,BigDecimal purchase_price,Integer warrenty){
        this.id=id;
        this.casing_code=casing_code;
        this.casing_name=casing_name;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
        this.warrenty = warrenty;
    }

    public Casing(Integer id,String casing_code,String casing_name,CasingStatus status_id,BigDecimal purchase_price,BigDecimal sale_price,Integer warrenty){
        this.id=id;
        this.casing_code=casing_code;
        this.casing_name=casing_name;
        this.status_id =status_id;
        this.purchase_price=purchase_price;
        this.sale_price=sale_price;
        this.warrenty = warrenty;
    }
}
