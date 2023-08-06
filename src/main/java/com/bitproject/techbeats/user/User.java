package com.bitproject.techbeats.user;

import com.bitproject.techbeats.employee.model.Employee;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "user_name")
    private String user_name;

    @ManyToOne
    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    private Employee employee_id;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "description")
    private String description;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime ;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "photoname")
    private String photoname;

    @Column(name = "photopath")
    private String photopath;

    @ManyToMany
    @JoinTable(name = "user_has_role",joinColumns = @JoinColumn(name = "user_id"),inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set <Roles> roles;

    public User(Integer id,Employee employee_id,String user_name,String email,LocalDateTime adddatetime,boolean status){
        this.id = id;
        this.employee_id=employee_id;
        this.user_name=user_name;
        this.email=email;
        this.adddatetime=adddatetime;
        this.status=status;

    }
}
