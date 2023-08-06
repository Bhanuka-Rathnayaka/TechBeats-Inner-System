package com.bitproject.techbeats.processor.repository;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.ram.model.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcessorRepository extends JpaRepository<Processor,Integer> {
    //findall with selected colum only
    @Query(value = "select new Processor (e.id,e.pcode,e.pname,e.pro_status_id,e.purchase_price,e.sale_price) from Processor e order by e.id desc")
    List<Processor> findAll();

    //processor list with selected colum only
    @Query(value = "select new Processor (p.id,p.pcode,p.pname,p.sale_price,p.purchase_price,p.warrenty) from Processor p where p.pro_status_id.id=2")
    List<Processor> processorListForCo();

    //Processor for purchsae request
    @Query(value = "select new Processor (p.id,p.pcode,p.pname,p.sale_price,p.purchase_price) from Processor p where p.item_brand_id.id = ?1")
    List<Processor> proListForPR(Integer bid);

    //processr for assemble
    @Query(value = "select p from Processor p where p.pcode in (select s.item_code from Seriel s where s.item_category_id.id=2 and s.status=true)")
    List<Processor> processorListForAssemble();

    //add default value to number(increment only last digit)
    @Query(value = "SELECT lpad(max(e.pcode)+1,5,'0') FROM techbeats.processor as e;",nativeQuery = true)
    String nextProcessorCode();

    //check duplicate with find ram by given ram name without quary
    Processor findByPname(String pname);


    //getBynamecode for sale price in grn
    @Query(value = "select p from Processor p where p.pro_status_id.id=1 and p.pcode =?1 and p.pname=?2")
    Processor probyitemcodename(String code, String name);
}
