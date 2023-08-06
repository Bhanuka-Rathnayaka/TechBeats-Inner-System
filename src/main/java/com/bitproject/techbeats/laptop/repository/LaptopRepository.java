package com.bitproject.techbeats.laptop.repository;

import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.laptop.model.Laptop;
import com.bitproject.techbeats.vga.modal.Vga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LaptopRepository extends JpaRepository<Laptop,Integer> {


    //quary for get lptop for purchase request
    @Query(value = "select new Laptop (l.id,l.code,l.name,l.purchase_price,l.sale_price,l.warrenty) from Laptop l where l.item_brand_id.id = ?1")
    List<Laptop> lapListForPR(Integer bid);

    //Vga list with selected colum only
    @Query(value = "select new Laptop (l.id,l.code,l.name,l.purchase_price,l.sale_price,l.warrenty) from Laptop l where l.lap_status_id.id=1")
    List<Laptop> lapListForCo();

    @Query(value = "select l from Laptop l where l.lap_status_id.id=1 and l.code =?1 and l.name=?2")
    Laptop lapbyitemcodename(String code, String name);
}
