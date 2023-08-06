package com.bitproject.techbeats.grn.model;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.invoiceitem.model.InvoiceItem;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.serielno.model.Seriel;
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
import java.util.Optional;

@Entity

@Table(name = "grn")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Grn {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "totalamount")
    private String totalamount;

    @Column(name = "taxrate")
    private BigDecimal taxrate;

    @Column(name = "discountrate")
    private BigDecimal discountrate;

    @Column(name = "finalamaount")
    private BigDecimal finalamaount;

    @Column(name = "note")
    private String note;

    @ManyToOne()
    @JoinColumn(name ="grn_status_id",referencedColumnName = "id")
    private GrnStatus grn_status_id;

    @Column(name = "recivedate")
    private LocalDate recivedate;

    @ManyToOne()
    @JoinColumn(name ="purchase_request_id",referencedColumnName = "id")
    private PurchaseRequest purchase_request_id;

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

    @Column(name = "balanceforgrn")
    private BigDecimal balanceforgrn;

    @OneToMany(mappedBy = "grn_id",orphanRemoval = true,cascade = CascadeType.ALL)
    private List<GrnItem> grnItemList;

    @OneToMany(mappedBy = "grn_id",orphanRemoval = true,cascade = CascadeType.ALL)
    private List<Seriel> serielList;


}
