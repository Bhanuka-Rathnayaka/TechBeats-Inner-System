package com.bitproject.techbeats.asemble.model;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.vga.modal.Vga;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity

@Table(name = "assemble")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Assemble {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "assemblecode")
    private String assemblecode;


    @ManyToOne()
    @JoinColumn(name ="processor_id",referencedColumnName = "id")
    private Processor processor_id;

    @ManyToOne()
    @JoinColumn(name ="motherboard_id",referencedColumnName = "id")
    private Motherboard motherboard_id;

    @ManyToOne()
    @JoinColumn(name ="ram_id",referencedColumnName = "id")
    private Ram ram_id;

    @ManyToOne()
    @JoinColumn(name ="vga_id",referencedColumnName = "id")
    private Vga vga_id;

    @ManyToOne()
    @JoinColumn(name ="casing_id",referencedColumnName = "id")
    private Casing casing_id;

    @ManyToOne()
    @JoinColumn(name ="storage_id",referencedColumnName = "id")
    private Storage storage_id;

    @ManyToOne()
    @JoinColumn(name ="cooler_id",referencedColumnName = "id")
    private Cooler cooler_id;

    @ManyToOne()
    @JoinColumn(name ="powersupply_id",referencedColumnName = "id")
    private Powersupply powersupply_id;

    @Column(name = "totalamount")
    private BigDecimal totalamount;
}
