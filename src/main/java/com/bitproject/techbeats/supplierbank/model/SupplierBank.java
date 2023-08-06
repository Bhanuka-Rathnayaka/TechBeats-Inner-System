package com.bitproject.techbeats.supplierbank.model;

import com.bitproject.techbeats.bank.model.Bank;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity

@Table(name = "supplier_bank_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierBank {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name ="supplier_id",referencedColumnName = "id")
    @JsonIgnore
    private Supplier supplier_id;

    @ManyToOne()
    @JoinColumn(name ="bank_id",referencedColumnName = "id")
    private Bank bank_id;

    @Column(name = "accountnumber")
    private String accountnumber;

    @Column(name = "branchname")
    private String branchname;

    @Column(name = "holdername")
    private String holdername;
}
