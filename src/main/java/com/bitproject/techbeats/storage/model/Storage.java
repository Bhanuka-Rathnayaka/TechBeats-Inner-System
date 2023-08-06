package com.bitproject.techbeats.storage.model;

import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.cooler.model.CoolerStatus;
import com.bitproject.techbeats.cooler.model.CoolerType;
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
@Table(name = "storage")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Storage {
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
    @JoinColumn(name ="st_type_id",referencedColumnName = "id")
    private StorageType st_type_id;

    @ManyToOne()
    @JoinColumn(name ="st_capasity_id",referencedColumnName = "id")
    private StorageCapasity st_capasity_id;

    @Column(name = "modelname")
    private String modelname;

    @Column(name = "name")
    private String name;

    @ManyToOne()
    @JoinColumn(name ="st_formfactor_id",referencedColumnName = "id")
    private StorageFormfactor st_formfactor_id;

    @ManyToOne()
    @JoinColumn(name ="st_interface_id",referencedColumnName = "id")
    private StorageInterface st_interface_id;

    @Column(name = "photopath")
    private String photopath;

    @Column(name = "photo")
    private byte[] photo;


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

    @Column(name = "warrenty")
    private Integer warrenty;

    @ManyToOne()
    @JoinColumn(name ="st_status_id",referencedColumnName = "id")
    private StorageStatus st_status_id;

    public Storage(Integer id, String code, String name, StorageStatus st_status_id, BigDecimal purchase_price, BigDecimal sale_price,Integer warrenty){
        this.id = id;
        this.code = code;
        this.name = name;
        this.st_status_id = st_status_id;
        this.purchase_price = purchase_price;
        this.sale_price = sale_price;
        this.warrenty = warrenty;
    }

    public Storage(Integer id,String code,String name,BigDecimal sale_price,Integer warrenty){
        this.id = id;
        this.code = code;
        this.name = name;
        this.sale_price = sale_price;
        this.warrenty = warrenty;
    }
    public Storage(Integer id,String code,String name,BigDecimal sale_price,BigDecimal purchase_price){
        this.id = id;
        this.code = code;
        this.name = name;
        this.sale_price = sale_price;
        this.purchase_price = purchase_price;

    }

    public Storage(Integer id,String code,String name,BigDecimal purchase_price){
        this.id = id;
        this.code = code;
        this.name = name;
        this.purchase_price = purchase_price;

    }

}
