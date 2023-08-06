package com.bitproject.techbeats.motherboard.model;

import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemCategory;
import com.bitproject.techbeats.processor.model.ProcessorSocket;
import com.bitproject.techbeats.ram.model.RamType;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "motherboard")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Motherboard {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "modelname")
    private String modelname;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @ManyToOne()
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="mb_series_id",referencedColumnName = "id")
    private MotherboardSeries mb_series_id;

    @ManyToOne()
    @JoinColumn(name ="mb_formfactor_id",referencedColumnName = "id")
    private MotherboardFormfactor mb_formfactor_id;

    @ManyToOne()
    @JoinColumn(name ="mb_chipset_id",referencedColumnName = "id")
    private MotherboardChipset mb_chipset_id;

    @ManyToOne()
    @JoinColumn(name ="pro_socket_id",referencedColumnName = "id")
    private ProcessorSocket pro_socket_id;

    @ManyToOne()
    @JoinColumn(name ="ram_type_id",referencedColumnName = "id")
    private RamType ram_type_id;

    @Column(name = "max_memory")
    private Integer max_memory;


    @Column(name = "memory_slots")
    private Integer memory_slots;

    @Column(name = "pciex16v4")
    private Integer pciex16v4;

    @Column(name = "pciex16v5")
    private Integer pciex16v5;

    @Column(name = "sata6gbs")
    private Integer sata6gbs;

    @Column(name = "sata3gbs")
    private Integer sata3gbs;

    @Column(name = "m2_port")
    private Integer m2_port;

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
    @JoinColumn(name ="mb_status_id",referencedColumnName = "id")
    private MotherboardStatus mb_status_id;

    public Motherboard(Integer id,String code,String name,BigDecimal sale_price,BigDecimal purchase_price){
        this.id=id;
        this.code=code;
        this.name=name;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
    }

    public Motherboard(Integer id,String code,String name,BigDecimal sale_price,BigDecimal purchase_price,Integer warrenty){
        this.id=id;
        this.code=code;
        this.name=name;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
        this.warrenty = warrenty;
    }





}
