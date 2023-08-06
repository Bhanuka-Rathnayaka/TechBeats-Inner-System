package com.bitproject.techbeats.bank.controoler;

import com.bitproject.techbeats.bank.model.Bank;
import com.bitproject.techbeats.bank.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/bank")
public class BankController {

    @Autowired
    private BankRepository bankDao;

    @GetMapping(value = "all",produces = "application/json")
    public List<Bank>bankList(){
        return bankDao.findAll();
    }
}
