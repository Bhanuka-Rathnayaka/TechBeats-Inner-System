package com.bitproject.techbeats.serielno.repository;

import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.serielno.model.Seriel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SerielRepository extends JpaRepository<Seriel,Integer> {
    //get serial for invoice
    @Query(value = "select new Seriel(s.serialno , s.sale_price) from Seriel s where s.item_category_id.id=?1 and s.item_code=?2 and s.status=true")
    List<Seriel> getSerielListForInvoice(Integer catid,String code);

    //get serial number for hange status according to order
    @Query(value = "select s from Seriel s where s.item_category_id.id=?1 and s.item_code = ?2 and s.item_name = ?3 and s.serialno = ?4")
    Seriel getSerialByItemCatodeName(Integer catid, String itemcode, String itemname,String serial);

    //get available stock
   @Query(value = "SELECT ic.name,isn.item_code,isn.item_name,count(isn.id) FROM techbeats.item_serial_no_list as isn,techbeats.item_category as ic where isn.item_category_id in (select ic.id from techbeats.item_category) and isn.status = 1 group by isn.item_category_id,isn.item_code,isn.item_name;",nativeQuery = true)
    String[][] getAvailableSerial();

   //get count of serial ount available(for dashboard)
    @Query(value = "select new Seriel(count(s.id)) from Seriel s where s.status = true")
    Seriel getAllAvailableSerial();
}
