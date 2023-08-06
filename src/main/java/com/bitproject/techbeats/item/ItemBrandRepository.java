package com.bitproject.techbeats.item;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemBrandRepository extends JpaRepository<ItemBrand,Integer> {

    //quary for get brand given category
    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=1)")
    List<ItemBrand>findByCategoryRam();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=2)")
    List<ItemBrand>findByCategoryPro();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=6)")
    List<ItemBrand>findByCategoryCooler();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=7)")
    List<ItemBrand>findByCategoryStorage();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=4)")
    List<ItemBrand>findByCategoryPsu();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=5)")
    List<ItemBrand>findByCategoryCase();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=3)")
    List<ItemBrand>findByCategoryVga();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=8)")
    List<ItemBrand>findByCategoryMotherbord();

    @Query(value = "select ib from ItemBrand ib where ib.id in (select bhc.item_brand_id.id from ItemBrandHasItemCategory bhc where bhc.item_category_id.id=9)")
    List<ItemBrand> findByCategoryLaptop();

    // query for get item_brand by category foe Purchase request
    @Query(value = "select ib from ItemBrand ib where ib.id in (select sbc.item_brand_id.id from SupplierItemBrandCategory sbc where sbc.item_category_id.id=?1 and sbc.supplier_id.id=?2)")
    List<ItemBrand> findByCategoryForPR(Integer cid,Integer sid);





}
