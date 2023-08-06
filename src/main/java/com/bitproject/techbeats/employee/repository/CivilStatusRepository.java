package com.bitproject.techbeats.employee.repository;

import com.bitproject.techbeats.employee.model.CivilStatus;
import com.bitproject.techbeats.employee.model.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CivilStatusRepository extends JpaRepository <CivilStatus,Integer> {
}
