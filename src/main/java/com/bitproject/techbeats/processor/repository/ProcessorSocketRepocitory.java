package com.bitproject.techbeats.processor.repository;
import com.bitproject.techbeats.processor.model.ProcessorCollection;
import com.bitproject.techbeats.processor.model.ProcessorSocket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface ProcessorSocketRepocitory extends JpaRepository<ProcessorSocket,Integer> {
}
