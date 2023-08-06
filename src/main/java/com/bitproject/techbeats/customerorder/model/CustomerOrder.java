package com.bitproject.techbeats.customerorder.model;

import com.bitproject.techbeats.cooler.model.CoolerType;
import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@Table(name = "customerorder")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerOrder {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @ManyToOne(optional = false)
    @JoinColumn(name ="customer_id",referencedColumnName = "id")
    private Customer customer_id;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "note")
    private String note;

    @Column(name = "requiredate")
    private LocalDate requiredate;

    @Column(name = "amount")
    private BigDecimal amount;

    @ManyToOne(optional = false)
    @JoinColumn(name ="orderstatus_id",referencedColumnName = "id")
    private CustomerOrderStatus orderstatus_id;

    @ManyToOne(optional = false)
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    @ManyToOne()
    @JoinColumn(name ="updateuser_id",referencedColumnName = "id")
    private User updateuser_id;

    @ManyToOne()
    @JoinColumn(name ="deleteuser_id",referencedColumnName = "id")
    private User deleteuser_id;

    @OneToMany(mappedBy = "customerorder_id",orphanRemoval = true ,cascade = CascadeType.ALL)
    private List<CustomerOrderItem>customerOrderItemList;

    public CustomerOrder (Integer id, String code,Customer customer_id){
        this.id = id;
        this.code = code;
        this.customer_id = customer_id;

    }

    public CustomerOrder(Long id){
        this.id = Integer.valueOf(id.toString());
    }
}
