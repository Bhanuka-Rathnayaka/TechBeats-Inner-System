package com.bitproject.techbeats.ram.repositary;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.ram.model.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RamRepository extends JpaRepository <Ram,Integer> {
    //findall with selected colum only
    @Query(value = "select new Ram (e.id,e.rcode,e.rname,e.ram_status_id,e.purchase_price,e.sale_price,e.warrenty) from Ram e order by e.id desc")
    List<Ram> findAll();

    //check duplicate with find ram by given ram name without quary
    Ram findRamByRname(String rname);

    //add default value to number(increment only last digit)
    @Query(value = "SELECT lpad(max(e.rcode)+1,5,'0') FROM techbeats.ram as e;",nativeQuery = true)
    String nextRamCode();

    //Ram list with selected colum only
    @Query(value = "select new Ram (e.id,e.rcode,e.rname,e.sale_price,e.warrenty) from Ram e where e.ram_status_id.id=2")
    List<Ram> ramListForCo();

    //ram for purchsae request
    @Query(value = "select new Ram (r.id,r.rcode,r.rname,r.purchase_price) from Ram r where r.item_brand_id.id=?1")
    List<Ram> ramListForPR(Integer bid);



    //ram for assemble
    @Query(value = "select r from Ram r where r.ram_type_id.id in (select phr.ram_type_id.id from ProcessorHasRamtype phr where phr.processor_id.id=?1) and r.ram_type_id.id in(select m.ram_type_id.id from Motherboard m where m.id =?2) and r.ram_status_id.id=2")
    List<Ram> ramListForAssemble(Integer pid,Integer mid);


    //getBynamecode for sale price in grn
    @Query(value = "select r from Ram r where r.ram_status_id.id=1 and r.rcode =?1 and r.rname=?2")
    Ram rambyitemcodename(String code, String name);
}
