package com.bitproject.techbeats.ram.repositary;
import com.bitproject.techbeats.ram.model.RamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RamTypeRepository extends JpaRepository<RamType,Integer> {
    @Query(value = "select rt from RamType rt where rt.id in(select phrt.ram_type_id.id from ProcessorHasRamtype phrt where phrt.processor_id.id= :id)")
    List<RamType> getRamType(@Param("id") Integer id);
}
