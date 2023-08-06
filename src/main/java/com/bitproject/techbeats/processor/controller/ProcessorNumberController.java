package com.bitproject.techbeats.processor.controller;
import com.bitproject.techbeats.processor.model.ProcessorNumber;
import com.bitproject.techbeats.processor.repository.ProcessorNumberRepocitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/processornumber")
public class ProcessorNumberController {
    @Autowired
    private ProcessorNumberRepocitory proNumberDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<ProcessorNumber> processorNumberList(){
        return proNumberDao.findAll();
    }

}
