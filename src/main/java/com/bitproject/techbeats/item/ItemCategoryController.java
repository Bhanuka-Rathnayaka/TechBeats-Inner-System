package com.bitproject.techbeats.item;

import com.bitproject.techbeats.motherboard.model.MotherboardSeries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/itemcategory")
public class ItemCategoryController {
    @Autowired
    private ItemCategoryRepository itemCategoryDao;

    @GetMapping(value = "/all",produces = "application/json")
    public List<ItemCategory>itemCategoryList(){
        return itemCategoryDao.findAll();
    }

    //get mapping for get series buy given brand id(/itemcategory/bybrand?bid=)
    @GetMapping(value = "/bybrand",params = "bid",produces = "application/json")
    public List<ItemCategory> itemCategoryListFromBrand(@RequestParam("bid") Integer bid){
        return itemCategoryDao.itemCategoryByBrand(bid);

    }

    //getmapping for filter category by supplier
    @GetMapping(value = "/bysupplerid/{sid}",produces = "application/json")
    public List<ItemCategory>itemCategoryByCategory(@PathVariable("sid") Integer sid){
        return itemCategoryDao.findCategoryBySupplier(sid);
    }

    //getmapping for filter category by supplier
    @GetMapping(value = "/bypoid/{pid}",produces = "application/json")
    public List<ItemCategory>itemCategoryByPO(@PathVariable("pid") Integer pid){
        return itemCategoryDao.findCategoryByPOID(pid);
    }

}
