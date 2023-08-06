package com.bitproject.techbeats.invoice.model;

import com.bitproject.techbeats.bank.model.Bank;
import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.invoiceitem.model.InvoiceItem;
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

@Table(name = "invoice")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Invoice {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "invoicenumber")
    private String invoicenumber;

    @ManyToOne()
    @JoinColumn(name ="customer_id",referencedColumnName = "id")
    private Customer customer_id;

    @Column(name = "cus_name")
    private String cus_name;

    @Column(name = "cus_mobile")
    private String cus_mobile;

    @Column(name = "cus_mail")
    private String cus_mail;

    @ManyToOne()
    @JoinColumn(name ="customerorder_id",referencedColumnName = "id")
    private CustomerOrder customerorder_id;

    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @Column(name = "discountrate")
    private BigDecimal discountrate;

    @Column(name = "lastprice")
    private BigDecimal lastprice;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "invoicedate")
    private LocalDate date;

    @ManyToOne()
    @JoinColumn(name ="payment_method_id",referencedColumnName = "id")
    private PaymentMethod payment_method_id;

    /*@ManyToOne()
    @JoinColumn(name ="card_type_id",referencedColumnName = "id")
    private CardType card_type_id;*/

    @ManyToOne()
    @JoinColumn(name ="bank_id",referencedColumnName = "id")
    private Bank bank_id;

    @Column(name = "note")
    private String note;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne(optional = false)
    @JoinColumn(name ="adduser_id",referencedColumnName = "id")
    private User adduser_id;

    @ManyToOne()
    @JoinColumn(name ="updateuser_id",referencedColumnName = "id")
    private User updateuser_id;

    @ManyToOne()
    @JoinColumn(name ="deleteuser_id",referencedColumnName = "id")
    private User deleteuser_id;


    @ManyToOne(optional = false)
    @JoinColumn(name ="invoice_status_id",referencedColumnName = "id")
    private InvoiceStatus invoice_status_id;


    @OneToMany(mappedBy = "invoice_id",orphanRemoval = true,cascade = CascadeType.ALL)
    private List<InvoiceItem>invoiceItemList;
}
