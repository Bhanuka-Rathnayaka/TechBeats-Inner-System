package com.bitproject.techbeats.supplierpayment.model;

import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.invoice.model.PaymentMethod;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity

@Table(name = "supplier_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierPayment {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "payment_no")
    private String payment_no;

    @Column(name = "grnamount")
    private BigDecimal grnamount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "chequeno")
    private String chequeno;

    @Column(name = "chequedate")
    private LocalDate chequedate;

    @Column(name = "transfer_no")
    private String transfer_no;

    @Column(name = "transferdatetime")
    private LocalDate transferdatetime;

    @ManyToOne()
    @JoinColumn(name ="payment_method_id",referencedColumnName = "id")
    private PaymentMethod payment_method_id;

    @ManyToOne()
    @JoinColumn(name ="supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne()
    @JoinColumn(name ="grn_id",referencedColumnName = "id")
    private Grn grn_id;

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







}
