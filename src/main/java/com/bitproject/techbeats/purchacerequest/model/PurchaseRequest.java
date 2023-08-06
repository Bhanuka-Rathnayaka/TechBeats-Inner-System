package com.bitproject.techbeats.purchacerequest.model;

import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.grn.model.GrnStatus;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.supplier.model.SupplierStatus;
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

@Table(name = "purchase_request")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseRequest {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "requireddate")
    private LocalDate requireddate;

    @Column(name = "note")
    private String note;

    @ManyToOne()
    @JoinColumn(name ="purchase_status_id",referencedColumnName = "id")
    private PurchaseRequestStatus purchase_status_id;

    @ManyToOne()
    @JoinColumn(name ="supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne(optional = false)
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



    @OneToMany(mappedBy = "purchase_request_id",orphanRemoval = true ,cascade = CascadeType.ALL)
    private List<PurchaseRequestItem> purchaseRequestItemList;

    
}
