package com.bitproject.techbeats.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemCategoryRepository extends JpaRepository<ItemCategory,Integer> {
    @Query(value = "select ic from ItemCategory ic where ic.id in (select bhc.item_category_id.id from ItemBrandHasItemCategory bhc where bhc.item_brand_id.id=?1)")
    List<ItemCategory>itemCategoryByBrand(Integer bid);

    @Query(value = "select ic from ItemCategory ic where ic.id in (select sbc.item_category_id.id from SupplierItemBrandCategory sbc where sbc.supplier_id.id=?1)")
    List<ItemCategory> findCategoryBySupplier(Integer sid);


    @Query(value = "select ic from ItemCategory ic where ic.id in  (select pri.item_category_id.id from PurchaseRequestItem pri where pri.purchase_request_id.id=?1)")
    List<ItemCategory> findCategoryByPOID(Integer pid);


}
