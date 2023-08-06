package com.bitproject.techbeats.employee.repository;

import com.bitproject.techbeats.employee.model.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository <Designation,Integer> {
}
