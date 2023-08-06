package com.bitproject.techbeats.employee.repository;

import com.bitproject.techbeats.employee.model.Designation;
import com.bitproject.techbeats.employee.model.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpStatusRepository extends JpaRepository <EmployeeStatus,Integer> {
}
