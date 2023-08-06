package com.bitproject.techbeats.powersupply.model;

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

@Table(name = "powersupply")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Powersupply {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="pscode" )
    private String pscode;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="psseries_id",referencedColumnName = "id")
    private PsSeries psseries_id;

    @Column(name ="model_name" )
    private String model_name;

    @ManyToOne()
    @JoinColumn(name ="pswattage_id",referencedColumnName = "id")
    private PsWattage pswattage_id;

    @ManyToOne()
    @JoinColumn(name ="psefficiency_id",referencedColumnName = "id")
    private PsEfficienct psefficiency_id;

    @ManyToOne
    @JoinColumn(name ="psmodular_id", referencedColumnName = "id")
    private PsModular psmodular_id;

    @Column(name ="psname" )
    private String psname;

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
    @JoinColumn(name ="psstatus_id",referencedColumnName = "id")
    private PsStatus psstatus_id;

    @ManyToOne()
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    public Powersupply (Integer id,String pscode,String psname,PsStatus psstatus_id,BigDecimal purchase_price,BigDecimal sale_price){
        this.id=id;
        this.pscode = pscode;
        this.psname = psname;
        this.psstatus_id = psstatus_id;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
    }

    public Powersupply (Integer id,String pscode,String psname,BigDecimal sale_price){
        this.id=id;
        this.pscode = pscode;
        this.psname = psname;
        this.sale_price = sale_price;
    }

    public Powersupply (Integer id,String pscode,String psname,BigDecimal sale_price,Integer warranty){
        this.id=id;
        this.pscode = pscode;
        this.psname = psname;
        this.sale_price = sale_price;
        this.warranty = warranty;
    }

    public Powersupply (Integer id,String pscode,String psname,BigDecimal sale_price,BigDecimal purchase_price){
        this.id=id;
        this.pscode = pscode;
        this.psname = psname;
        this.sale_price = sale_price;
        this.purchase_price = purchase_price;
    }
}

