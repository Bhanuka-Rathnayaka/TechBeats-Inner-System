package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.vga.modal.VgaInterface;
import com.bitproject.techbeats.vga.modal.VgaType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VgaTypeRepository extends JpaRepository<VgaType,Integer> {
}
