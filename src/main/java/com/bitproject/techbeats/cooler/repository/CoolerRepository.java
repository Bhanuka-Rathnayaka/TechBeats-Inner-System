package com.bitproject.techbeats.cooler.repository;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.ram.model.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoolerRepository extends JpaRepository<Cooler,Integer> {

    //findall with selected colum only
    @Query(value = "select new Cooler (c.id,c.cooler_code,c.name,c.cooler_status_id,c.purchase_price,c.sale_price) from Cooler c order by c.id desc")
    List<Cooler> findAll();

    //Cooler list with selected colum only
    @Query(value = "select new Cooler (c.id,c.cooler_code,c.name,c.purchase_price,c.sale_price,c.warranty) from Cooler c where c.cooler_status_id.id=1")
    List<Cooler> coolerListForCo();

    //quary for get cooler for purchase request
    @Query(value = "select new Cooler (c.id,c.cooler_code,c.name,c.purchase_price,c.sale_price) from Cooler c where c.item_brand_id.id=?1")
    List<Cooler> coolerListForPR(Integer bid);

    //check duplicate with find Cooler by given Cooler name without quary
    Cooler findCoolerByName(String name);

    //@Query("SELECT c FROM Cooler c WHERE c.name = :coolerName")
    //Cooler findCoolerByName(@Param("coolerName") String coolerName);

    //add default value to number(increment only last digit)
    @Query(value = "select lpad(max(c.cooler_code)+1,5,'0') from Cooler as c;",nativeQuery = true)
    String nextCoolerCode();

    @Query(value = "select c from Cooler c where c.cooler_status_id.id=1")
    List<Cooler> coolerListForAssemble();

    //getBynamecode for sale price in grn
    @Query(value = "select c from Cooler c where c.cooler_status_id.id=1 and c.cooler_code =?1 and c.name=?2")
    Cooler coolerbyitemcodename(String code,String name);



}
