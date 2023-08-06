package com.bitproject.techbeats.processor.repository;
import com.bitproject.techbeats.processor.model.ProcessorNumber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessorNumberRepocitory extends JpaRepository<ProcessorNumber,Integer> {
}
