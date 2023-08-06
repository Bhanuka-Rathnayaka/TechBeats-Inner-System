package com.bitproject.techbeats.processor.model;


import com.bitproject.techbeats.item.ItemBrand;
import com.bitproject.techbeats.item.ItemCategory;
import com.bitproject.techbeats.ram.model.RamType;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.swing.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity

@Table(name = "processor")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Processor {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pcode")
    private String pcode;

    @ManyToOne
    @JoinColumn(name ="item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;


    @ManyToOne
    @JoinColumn(name ="pro_collection_id",referencedColumnName = "id")
    private ProcessorCollection pro_collection_id;

    @ManyToOne
    @JoinColumn(name ="pro_number_id",referencedColumnName = "id")
    private ProcessorNumber pro_number_id;

    @Column(name = "pname")
    private String pname;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

//    @ManyToOne
//    @JoinColumn(name = "add_user_id",referencedColumnName = "id")
//    private User add_user_id;
//
//    @ManyToOne
//    @JoinColumn(name = "update_user_id",referencedColumnName = "id")
//    private User update_user_id;
//
//    @ManyToOne
//    @JoinColumn(name = "del_user_id",referencedColumnName = "id")
//    private User del_user_id;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "profit_rate")
    private BigDecimal profit_rate;


    @Column(name = "sale_price")
    private BigDecimal sale_price;

    @ManyToOne
    @JoinColumn(name = "pro_status_id",referencedColumnName = "id")
    private ProcessorStatus pro_status_id;

    @ManyToOne
    @JoinColumn(name = "pro_socket_id",referencedColumnName = "id")
    private ProcessorSocket pro_socket_id;

    @ManyToMany
    @JoinTable(name = "processor_has_ram_type",joinColumns = @JoinColumn(name = "processor_id"),inverseJoinColumns = @JoinColumn(name = "ram_type_id"))
    private Set <RamType> ramTypes;

    @Column(name = "warranty")
    private Integer warrenty;

    public Processor(Integer id,String pcode,String pname,ProcessorStatus pro_status_id,BigDecimal purchase_price,BigDecimal sale_price){
        this.id=id;
        this.pcode = pcode;
        this.pname = pname;
        this.pro_status_id = pro_status_id;
        this.purchase_price = purchase_price;
        this.sale_price=sale_price;

    }

    public Processor(Integer id,String pcode,String pname,BigDecimal sale_price,BigDecimal purchase_price){
        this.id=id;
        this.pcode = pcode;
        this.pname = pname;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
    }

    public Processor(Integer id,String pcode,String pname,BigDecimal sale_price,BigDecimal purchase_price,Integer warrenty){
        this.id=id;
        this.pcode = pcode;
        this.pname = pname;
        this.sale_price=sale_price;
        this.purchase_price=purchase_price;
        this.warrenty = warrenty;
    }




}
