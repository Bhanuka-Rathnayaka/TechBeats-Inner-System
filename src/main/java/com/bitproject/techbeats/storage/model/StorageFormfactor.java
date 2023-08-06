package com.bitproject.techbeats.storage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "st_formfactor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageFormfactor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;


    @ManyToOne()
    @JoinColumn(name ="st_type_id",referencedColumnName = "id")
    private StorageType st_type_id;
}
