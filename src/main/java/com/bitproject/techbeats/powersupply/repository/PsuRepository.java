package com.bitproject.techbeats.powersupply.repository;
import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.ram.model.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PsuRepository extends JpaRepository<Powersupply,Integer> {
    //findall with selected colum only
    @Query(value = "select new Powersupply (p.id,p.pscode,p.psname,p.psstatus_id,p.purchase_price,p.sale_price) from Powersupply p order by p.id desc")
    List<Powersupply> findAll();

    //Ram list with selected colum only
    @Query(value = "select new Powersupply (p.id,p.pscode,p.psname,p.sale_price,p.warranty) from Powersupply p where p.psstatus_id.id=1")
    List<Powersupply> psuListForCo();

    //psu for purchsae request
    @Query(value = "select new Powersupply (psu.id,psu.pscode,psu.psname,psu.purchase_price) from Powersupply psu where psu.item_brand_id.id=?1")
    List<Powersupply> psuListForPR(Integer bid);

    //check duplicate with find psu by given psu name without quary
    Powersupply findPsuByPsname(String psname);

    //add default value to number(increment only last digit)
    @Query(value = "SELECT lpad(max(p.pscode)+1,5,'0') FROM techbeats.powersupply as p;",nativeQuery = true)
    String nextPsuCode();


    @Query(value = "select psu from Powersupply psu where psu.psstatus_id.id=1")
    List<Powersupply> psuListForAssemble();

    @Query(value = "select p from Powersupply p where p.psstatus_id.id=1 and p.pscode =?1 and  p.psname=?2")
    Powersupply psubyitemcodename(String code, String name);
}
