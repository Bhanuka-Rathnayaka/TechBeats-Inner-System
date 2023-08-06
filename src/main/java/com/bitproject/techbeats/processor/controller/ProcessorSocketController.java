package com.bitproject.techbeats.processor.controller;
import com.bitproject.techbeats.processor.model.ProcessorCollection;
import com.bitproject.techbeats.processor.model.ProcessorSocket;
import com.bitproject.techbeats.processor.repository.ProcessorCollectionRepocitory;
import com.bitproject.techbeats.processor.repository.ProcessorSocketRepocitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/processorsocket")
public class ProcessorSocketController {
    @Autowired
    private ProcessorSocketRepocitory processorSocketRepocitory;

    @GetMapping(value = "/all",produces = "application/json")
    public List<ProcessorSocket> processorSocketList(){

        return processorSocketRepocitory.findAll();
    }

}
