package com.bitproject.techbeats.motherboard.repository;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.processor.model.Processor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MothrboardRepository extends JpaRepository<Motherboard,Integer> {
    Motherboard findMotherboardByName(String name);

    //generate next code
    @Query(value = "SELECT CONCAT('MB', LPAD(MAX(SUBSTRING(m.code, 3))+1, 5, '0')) FROM Motherboard m;",nativeQuery = true)
    String nextMBCode();


    //casing for purchsae request
    @Query(value = "select new Motherboard (mb.id,mb.code,mb.name,mb.purchase_price,mb.sale_price) from Motherboard mb where mb.item_brand_id.id = ?1")
    List<Motherboard> mbListForPR(Integer bid);

    //casing for purchsae request
    @Query(value = "select new Motherboard (mb.id,mb.code,mb.name,mb.purchase_price,mb.sale_price,mb.warrenty) from Motherboard mb where mb.mb_status_id.id=1")
    List<Motherboard> mbListForCo();

    //mb for assemble
    @Query(value = "select m from Motherboard m where m.code in (select s.item_code from Seriel s where s.item_category_id.id=8 and s.status=true) and m.pro_socket_id.id in (select p.pro_socket_id.id from Processor p where p.pro_socket_id.id=?1)")
    List<Motherboard> mbListForAssemble(Integer pid);

    @Query(value = "select m from Motherboard m where m.mb_status_id.id=1 and m.code =?1 and m.name=?2")
    Motherboard mbbyitemcodename(String code, String name);
}
