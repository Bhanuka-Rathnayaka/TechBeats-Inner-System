package com.bitproject.techbeats.vga.modal;

import com.bitproject.techbeats.item.ItemBrand;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity

@Table(name = "vga")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Vga {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="vcode")
    private String vcode;

    @Column(name ="vname")
    private String vname;

    @ManyToOne()
    @JoinColumn(name = "item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @ManyToOne()
    @JoinColumn(name = "vga_series_id",referencedColumnName = "id")
    private VgaSeries vga_series_id;

    @ManyToOne()
    @JoinColumn(name = "vga_chipset_id",referencedColumnName = "id")
    private VgaChipset vga_chipset_id;

    @Column(name ="edition")
    private String edition;

    @ManyToOne()
    @JoinColumn(name = "vga_capacity_id",referencedColumnName = "id")
    private VgaCapacity vga_capacity_id;

    @ManyToOne()
    @JoinColumn(name = "vga_interface_id",referencedColumnName = "id")
    private VgaInterface vga_interface_id;

    @Column(name ="length")
    private String length;

    @Column(name ="psu")
    private String psu;

    @ManyToOne()
    @JoinColumn(name = "vga_type_id",referencedColumnName = "id")
    private VgaType vga_type_id;

    @ManyToOne()
    @JoinColumn(name = "vga_status_id",referencedColumnName = "id")
    private VgaStatus vga_status_id;

    @Column(name = "profit_rate")
    private BigDecimal profit_rate;


    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "sale_price")
    private BigDecimal sale_price;

    @Column(name = "warranty")
    private Integer warranty;

    public Vga(Integer id,String vcode,String vname,VgaStatus vga_status_id){
        this.id = id;
        this.vcode = vcode;
        this.vname = vname;
        this.vga_status_id = vga_status_id;

    }

    public Vga(Integer id,String vcode,String vname,BigDecimal purchase_price,BigDecimal sale_price,Integer warranty){
        this.id = id;
        this.vcode = vcode;
        this.vname = vname;
        this.sale_price = sale_price;
        this.purchase_price = purchase_price;
        this.warranty = warranty;

    }

}
