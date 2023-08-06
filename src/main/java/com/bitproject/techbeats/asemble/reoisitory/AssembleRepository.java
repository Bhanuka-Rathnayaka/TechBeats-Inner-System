package com.bitproject.techbeats.asemble.reoisitory;

import com.bitproject.techbeats.asemble.model.Assemble;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface AssembleRepository extends JpaRepository<Assemble,Integer> {

    @Query(value = "select a from Assemble a where a.totalamount <=?2 and a.totalamount >= ?1")
    List<Assemble> findAll(BigDecimal manprice, BigDecimal maxprice);
}
