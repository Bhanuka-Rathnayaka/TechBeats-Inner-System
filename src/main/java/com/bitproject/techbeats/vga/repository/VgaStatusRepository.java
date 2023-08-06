package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.vga.modal.VgaInterface;
import com.bitproject.techbeats.vga.modal.VgaStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VgaStatusRepository extends JpaRepository<VgaStatus,Integer> {
}
