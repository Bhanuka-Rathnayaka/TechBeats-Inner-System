package com.bitproject.techbeats.storage.repository;


import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.storage.model.Storage;
import org.springframework.cglib.proxy.LazyLoader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorageRepository extends JpaRepository <Storage,Integer>{
    @Query(value = "select new Storage (s.id,s.code,s.name,s.st_status_id,s.purchase_price,s.sale_price,s.warrenty) from Storage s order by s.id desc")
    List findAll();

    //quary for get storage details to customerorder
    @Query(value = "select new Storage (s.id,s.code,s.name,s.sale_price,s.warrenty) from Storage s where s.st_status_id.id=1")
    List<Storage> storageListForCo();

    //check duplicate with find Storage by given Storage name without quary
    Storage findStorageByName(String name);

    //generate next code
    @Query(value = "SELECT CONCAT('ST', LPAD(MAX(SUBSTRING(s.code, 3))+1, 5, '0')) FROM Storage AS s;",nativeQuery = true)
    String nextStorageCode();

    @Query(value = "select s from Storage s where s.code=?1")
    Storage getStorageCode(String code);

    //Storage for purchsae request
    @Query(value = "select new Storage (s.id,s.code,s.name,s.purchase_price) from Storage s where s.item_brand_id.id=?1")
    List<Storage> storageListForPR(Integer bid);

    //for assemble
    @Query(value = "select s from Storage s where s.st_status_id.id=1")
    List<Storage> storageListForAssemble();


    //getBynamecode for sale price in grn
    @Query(value = "select s from Storage s where s.st_status_id.id=1 and s.code =?1 and s.name=?2")
    Storage stbyitemcodename(String code, String name);
}
