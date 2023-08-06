package com.bitproject.techbeats.laptop.model;

import com.bitproject.techbeats.item.ItemBrand;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lap_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LaptopStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

}
