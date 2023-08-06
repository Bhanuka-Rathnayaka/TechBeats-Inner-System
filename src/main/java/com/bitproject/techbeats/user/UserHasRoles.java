package com.bitproject.techbeats.user;

import com.bitproject.techbeats.employee.model.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "user_has_role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserHasRoles implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "role_id",referencedColumnName = "id")
    private User role_id;
}
