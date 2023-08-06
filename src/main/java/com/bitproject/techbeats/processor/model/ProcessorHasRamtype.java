package com.bitproject.techbeats.processor.model;

import com.bitproject.techbeats.ram.model.RamType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "processor_has_ram_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessorHasRamtype implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "processor_id",referencedColumnName = "id")
    private Processor processor_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "ram_type_id",referencedColumnName = "id")
    private RamType ram_type_id;



}

