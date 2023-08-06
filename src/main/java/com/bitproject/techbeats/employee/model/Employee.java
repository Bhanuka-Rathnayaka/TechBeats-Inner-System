package com.bitproject.techbeats.employee.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity

@Table(name = "employee")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Employee {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "number")
    private String number;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "callingname")
    private String callingname;

    @Column(name = "nic")
    private String nic;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "gender")
    private String gender ;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "land")
    private String land;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "adddatetime")
    private LocalDateTime adddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "photo")
    private byte[] photo;

    @ManyToOne
    @JoinColumn(name = "civil_status_id",referencedColumnName = "id")
    private CivilStatus civil_status_id;

    @ManyToOne
    @JoinColumn(name = "designation_id",referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne
    @JoinColumn(name = "emp_status_id",referencedColumnName = "id")
    private EmployeeStatus emp_status_id;


    //constructor for show table
    public Employee(Integer id , String number,String callingname, String fullname, String address,String nic,String mobile,String email,byte[] photo,EmployeeStatus emp_status_id){
        this.id=id;
        this.number = number;
        this.callingname=callingname;
        this.fullname=fullname;
        this.address = address;
        this.nic = nic;
        this.mobile = mobile;
        this.email = email;
        this.photo = photo;
        this.emp_status_id = emp_status_id;
    }

    //constructor that use in getEmployeeWithoutUser
    public Employee(Integer id,String number,String callingname,String email){
        this.id = id;
        this.number = number;
        this.callingname = callingname;
        this.email = email;
    }

}
