package com.bitproject.techbeats.supplier.model;

import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestStatus;
import com.bitproject.techbeats.supplierbank.model.SupplierBank;
import com.bitproject.techbeats.supplieritembrandcategory.model.SupplierItemBrandCategory;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@Table(name = "supplier")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplier {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sup_code")
    private String sup_code;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "number")
    private String number;

    @Column(name = "address")
    private String address;

    @Column(name = "website")
    private String website;

    @Column(name = "agent_name")
    private String agent_name;

    @Column(name = "agent_email")
    private String agent_email;

    @Column(name = "agent_phone")
    private String agent_phone;


    @Column(name = "brn")
    private String brn;

    @Column(name = "balance")
    private BigDecimal balance;

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


    @ManyToOne()
    @JoinColumn(name ="supplier_status_id",referencedColumnName = "id")
    private SupplierStatus supplier_status_id;

    @OneToMany(mappedBy = "supplier_id",orphanRemoval = true ,cascade = CascadeType.ALL)
    private List<SupplierItemBrandCategory> supplierItemBrandCategoriesList;

    @OneToMany(mappedBy = "supplier_id",orphanRemoval = true ,cascade = CascadeType.ALL)
    private List<SupplierBank> supplierBanksList;

}
