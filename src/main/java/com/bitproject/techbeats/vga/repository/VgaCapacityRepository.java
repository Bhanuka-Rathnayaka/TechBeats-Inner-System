package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.vga.modal.VgaCapacity;
import com.bitproject.techbeats.vga.modal.VgaSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VgaCapacityRepository extends JpaRepository<VgaCapacity,Integer> {
}
