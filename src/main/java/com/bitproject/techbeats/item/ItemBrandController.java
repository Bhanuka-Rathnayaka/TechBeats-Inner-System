package com.bitproject.techbeats.item;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/itembrand")
public class ItemBrandController {
    @Autowired
    private ItemBrandRepository itembrandDao;

    //create mapping for get designation all details("/designation/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<ItemBrand> itemBrandList(){
        return itembrandDao.findAll();
    }

    /*@GetMapping(value = "/allbycategory/{cid}",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategory(@PathVariable("cid") Integer cid){
        return itembrandDao.findByCategory(cid);
    }*/
    @GetMapping(value = "/bycategoryram",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryRam(){
        return itembrandDao.findByCategoryRam();
    }

    @GetMapping(value = "/bycategorypro",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryPro(){
        return itembrandDao.findByCategoryPro();
    }

    @GetMapping(value = "/bycategoryvga",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryVga(){
        return itembrandDao.findByCategoryVga();
    }

    @GetMapping(value = "/bycategorycooler",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryCooler(){
        return itembrandDao.findByCategoryCooler();
    }

    @GetMapping(value = "/bycategorypsu",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryPsu(){
        return itembrandDao.findByCategoryPsu();
    }

    @GetMapping(value = "/bycategorycase",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryCase(){
        return itembrandDao.findByCategoryCase();
    }

    @GetMapping(value = "/bycategorystorage",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryStorage(){
        return itembrandDao.findByCategoryStorage();
    }

    @GetMapping(value = "/bycategorymb",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategoryMotherboard(){
        return itembrandDao.findByCategoryMotherbord();
    }

    @GetMapping(value = "/bycategorylap",produces = "application/json")
    public List<ItemBrand> itembrandsByItemCategoryLaptop(){
        return itembrandDao.findByCategoryLaptop();
    }

    //get mapping for get item_brand by category foe Purchase request
    @GetMapping(value = "/bycatid/{cid}/bysid/{sid}",produces = "application/json")
    public List<ItemBrand>itemBrandsByCategory(@PathVariable("cid") Integer cid,@PathVariable("sid") Integer sid){
        return itembrandDao.findByCategoryForPR(cid,sid);
    }


}
