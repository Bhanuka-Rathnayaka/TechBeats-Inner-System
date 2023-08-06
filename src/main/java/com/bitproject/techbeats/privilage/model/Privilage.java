package com.bitproject.techbeats.privilage.model;

import com.bitproject.techbeats.user.Roles;
import com.bitproject.techbeats.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity

@Table(name = "privilage")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Privilage {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "role_id",referencedColumnName = "id")
    private Roles role_id;

    @ManyToOne
    @JoinColumn(name = "module_id",referencedColumnName = "id")
    private Module module_id;

    @Column(name = "select_permission")
    private boolean select_permission;

     @Column(name = "insert_permission")
     private boolean insert_permission;

     @Column(name = "update_permission")
     private boolean update_permission;

     @Column(name = "delete_permission")
     private boolean delete_permission;

     @Column(name = "adddatetime")
     private LocalDateTime adddatetime;

     @Column(name = "updatedatetime")
     private LocalDateTime updatedatetime;

     @Column(name = "deletedatetime")
     private LocalDateTime deletedatetime;

     @ManyToOne
     @JoinColumn(name = "adduser_id",referencedColumnName = "id")
     private User adduser_id;

     @ManyToOne
     @JoinColumn(name = "updateuser_id",referencedColumnName = "id")
     private User updateuser_id;

    //constructor for show table
    public Privilage (Integer id,Roles role_id,Module module_id,boolean select_permission,boolean insert_permission, boolean update_permission,boolean delete_permission){
        this.id = id;
        this.module_id=module_id;
        this.role_id = role_id;
        this.select_permission = select_permission;
        this.insert_permission = insert_permission;
        this.update_permission = update_permission;
        this.delete_permission = delete_permission;
    }

}
