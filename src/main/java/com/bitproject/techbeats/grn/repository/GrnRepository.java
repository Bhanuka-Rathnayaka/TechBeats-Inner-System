package com.bitproject.techbeats.grn.repository;

import com.bitproject.techbeats.grn.model.Grn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GrnRepository extends JpaRepository<Grn,Integer> {
    @Query(value = "SELECT CONCAT('GRN', LPAD(MAX(SUBSTRING(grn.code, 4))+1, 5, '0')) FROM Grn grn;",nativeQuery = true)
    String nextGrnCode();

    @Query(value = "select grn from Grn grn where grn.id in (select s.grn_id.id from Seriel s where s.item_category_id.id=?1 and s.item_code = ?2 and s.item_name = ?3 and s.serialno = ?4)")
    Grn getGrnByItemCatodeName(Integer catid,String itemcode,String itemname,String serial);

    @Query(value = "select grn from Grn grn where grn.purchase_request_id.supplier_id.id = ?1 and grn.grn_status_id.id =4")
    List<Grn> grnBySupplierId(Integer sid);
}
