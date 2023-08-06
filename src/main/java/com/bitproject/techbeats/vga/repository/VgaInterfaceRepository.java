package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.vga.modal.VgaInterface;
import com.bitproject.techbeats.vga.modal.VgaSeries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VgaInterfaceRepository extends JpaRepository<VgaInterface,Integer> {
}
