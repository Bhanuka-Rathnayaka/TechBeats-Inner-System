package com.bitproject.techbeats.serielno.model;

import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.item.ItemCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity

@Table(name = "item_serial_no_list")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Seriel {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "serialno")
    private String serialno;


    @Column(name = "status")
    private Boolean status;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name ="grn_id",referencedColumnName = "id")
    private Grn grn_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @Column(name = "item_code")
    private String item_code;

    @Column(name = "item_name")
    private String item_name;

    @Column(name = "sale_price")
    private BigDecimal sale_price;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    public Seriel(String serialno,BigDecimal sale_price){
        this.serialno = serialno;
        this.sale_price = sale_price;
    }

    public Seriel(Long id){
        this.serialno = id.toString();
    }


}
