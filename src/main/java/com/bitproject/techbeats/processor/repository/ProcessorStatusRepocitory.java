package com.bitproject.techbeats.processor.repository;
import com.bitproject.techbeats.processor.model.ProcessorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessorStatusRepocitory extends JpaRepository<ProcessorStatus,Integer> {
}
