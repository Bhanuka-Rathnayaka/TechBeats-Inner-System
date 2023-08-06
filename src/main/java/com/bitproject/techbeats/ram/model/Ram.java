package com.bitproject.techbeats.ram.model;

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

//JPA entity
@Entity

@Table(name = "ram")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Ram {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "rcode")
    private String rcode;

    @Column(name = "rname")
    private String rname;

    @ManyToOne
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne
    @JoinColumn(name ="ram_type_id",referencedColumnName = "id")
    private RamType ram_type_id;

    @ManyToOne
    @JoinColumn(name ="ram_product_series_id",referencedColumnName = "id")
    private RamProductSeries ram_product_series_id;

    @ManyToOne
    @JoinColumn(name ="ram_capacity_id",referencedColumnName = "id")
    private RamCapacity ram_capacity_id;

    @ManyToOne
    @JoinColumn(name ="ram_speed_id",referencedColumnName = "id")
    private RamSpeed ram_speed_id;

   /* @ManyToOne
    @JoinColumn(name = "ram_color_id",referencedColumnName = "id")
    private RamColor ram_color_id;*/


    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "ram_status_id",referencedColumnName = "id")
    private RamStatus ram_status_id;

    @ManyToOne
    @JoinColumn(name = "add_user_id",referencedColumnName = "id")
    private User add_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id",referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id",referencedColumnName = "id")
    private User delete_user_id;


    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "profit_rate")
    private BigDecimal profit_rate;

    @Column(name = "min_discount")
    private BigDecimal min_discount;

    @Column(name = "max_discount")
    private BigDecimal max_discount;

    @Column(name = "sale_price")
    private BigDecimal sale_price;

    @Column(name = "warrenty")
    private Integer warrenty;

    //findall constructor for selected colum only
    public Ram(Integer id,String rcode,String rname,RamStatus ram_status_id,BigDecimal purchase_price,BigDecimal sale_price,Integer warrenty){
        this.id = id;
        this.rcode=rcode;
        this.rname=rname;
        this.ram_status_id = ram_status_id;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
        this.warrenty = warrenty;

    }

    //constructor for ramListForCo function
    public Ram(Integer id,String rcode,String rname,BigDecimal sale_price,Integer warrenty){
        this.id = id;
        this.rcode=rcode;
        this.rname=rname;
        this.sale_price = sale_price;
        this.warrenty = warrenty;
    }

    public Ram(Integer id,String rcode,String rname,BigDecimal purchase_price){
        this.id = id;
        this.rcode=rcode;
        this.rname=rname;
        this.purchase_price = purchase_price;

    }


}
