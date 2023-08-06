package com.bitproject.techbeats.casing.repository;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.ram.model.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasingRepository extends JpaRepository<Casing,Integer> {
    //findall with selected colum only
    @Query(value = "select new Casing (c.id,c.casing_code,c.casing_name,c.status_id,c.purchase_price,c.sale_price) from Casing as c order by c.id desc")
    List<Casing>findAll();

    //Ram list with selected colum only
    @Query(value = "select new Casing (c.id,c.casing_code,c.casing_name,c.purchase_price,c.sale_price,c.warrenty) from Casing c where c.status_id.id=1")
    List<Casing> caseListForCo();

    //casing for purchsae request
    @Query(value = "select new Casing (c.id,c.casing_code,c.casing_name,c.purchase_price,c.sale_price) from Casing c where c.item_brand_id.id = ?1 and c.status_id.id=1")
    List<Casing> caseListForPR(Integer bid);


    //check duplicate with find Casing by given Casing name without quary
    //Casing findCasingByCasing_name(String casing_name);

    @Query("SELECT c FROM Casing c WHERE c.casing_name = :casingName")
    Casing findCasingByCasingName(@Param("casingName") String casingName);

    //add default value to number(increment only last digit)
    @Query(value = "select lpad(max(c.casing_code)+1,5,'0') from Casing as c;",nativeQuery = true)
    String nextCasingCode();


    @Query(value = "select c from Casing c where c.status_id.id=1")
    List<Casing> caseListForAssemble();

    @Query(value = "select c from Casing c where c.status_id.id=1 and c.casing_code =?1 and c.casing_name=?2")
    Casing casingbyitemcodename(String code, String name);
}
