package com.bitproject.techbeats.customerorderitem.model;

import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.item.ItemCategory;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity

@Table(name = "customerorderitem")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerOrderItem {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="customerorder_id",referencedColumnName = "id")
    @JsonIgnore
    private CustomerOrder customerorder_id;

    @ManyToOne()
    @JoinColumn(name ="item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;

    @Column(name = "itemcode")
    private String itemcode;

    @Column(name = "itemname")
    private String itemname;

    @Column(name = "itemprice")
    private BigDecimal itemprice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @Column(name = "warrenty")
    private BigDecimal warrenty;




}
