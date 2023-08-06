package com.bitproject.techbeats.motherboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mb_formfactor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotherboardFormfactor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    
}
