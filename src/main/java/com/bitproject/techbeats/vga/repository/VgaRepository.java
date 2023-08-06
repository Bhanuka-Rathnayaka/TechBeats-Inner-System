package com.bitproject.techbeats.vga.repository;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.vga.modal.Vga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface VgaRepository extends JpaRepository<Vga,Integer> {
    //findall with selected colum only
    @Query(value = "select new Vga (e.id,e.vcode,e.vname,e.vga_status_id) from Vga e order by e.id desc")
    List<Vga> findAll();

    //Vga list with selected colum only
    @Query(value = "select new Vga (v.id,v.vcode,v.vname,v.purchase_price,v.sale_price,v.warranty) from Vga v where v.vga_status_id.id=2")
    List<Vga> vgaListForCo();


    //add default value to number(increment only last digit)
    @Query(value = "SELECT lpad(max(e.vcode)+1,5,'0') FROM techbeats.vga as e;",nativeQuery = true)
    String nextVgaCode();

    //check duplicate with find ram by given ram name without quary
    Vga findByVname(String vname);

    //ram for purchsae request
    @Query(value = "select new Vga (v.id,v.vcode,v.vname,v.purchase_price,v.sale_price,v.warranty) from Vga v where v.item_brand_id.id=?1")
    List<Vga> vgaListForPR(Integer bid);

    //Quary for assemblr
    @Query(value = "select v from Vga v where v.vga_status_id.id=2")
    List<Vga>vgaListForAssemble();

    @Query(value = "select v from Vga v where v.vga_interface_id.id=2 and v.vga_status_id.id=2")
    List<Vga> vgaListForAssemblev4();

    @Query(value = "select v from Vga v where v.vga_interface_id.id=3 and v.vga_status_id.id=2")
    List<Vga> vgaListForAssemblev5();


    //getBynamecode for sale price in grn
    @Query(value = "select v from Vga v where v.vga_status_id.id=1 and v.vcode =?1 and v.vname=?2")
    Vga vgabyitemcodename(String code, String name);
}
