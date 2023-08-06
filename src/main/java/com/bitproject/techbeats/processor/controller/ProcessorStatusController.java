package com.bitproject.techbeats.processor.controller;
import com.bitproject.techbeats.processor.model.ProcessorStatus;
import com.bitproject.techbeats.processor.repository.ProcessorStatusRepocitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/processorstatus")
public class ProcessorStatusController {
    @Autowired
    private ProcessorStatusRepocitory proStatusDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<ProcessorStatus> processorStatusList(){
        return proStatusDao.findAll();
    }

}
