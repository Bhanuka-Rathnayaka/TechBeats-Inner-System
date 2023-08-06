package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.vga.modal.VgaChipset;
import com.bitproject.techbeats.vga.modal.VgaSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VgaChipsetRepository extends JpaRepository<VgaChipset,Integer> {
}
