package com.bitproject.techbeats.processor.controller;
import com.bitproject.techbeats.processor.model.ProcessorCollection;
import com.bitproject.techbeats.processor.repository.ProcessorCollectionRepocitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/processorcollection")
public class ProcessorCollectionController {
    @Autowired
    private ProcessorCollectionRepocitory proCollectionDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<ProcessorCollection> processorCollectionList(){

        return proCollectionDao.findAll();
    }

}
