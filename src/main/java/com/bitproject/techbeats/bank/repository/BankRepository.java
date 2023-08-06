package com.bitproject.techbeats.bank.repository;

import com.bitproject.techbeats.bank.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank,Integer> {
}
