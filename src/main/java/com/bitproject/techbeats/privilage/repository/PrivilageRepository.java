package com.bitproject.techbeats.privilage.repository;

import com.bitproject.techbeats.privilage.model.Privilage;
import org.springframework.data.jpa.mapping.JpaPersistentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface PrivilageRepository extends JpaRepository<Privilage,Integer> {
    //findAll with selected colum only
    @Query(value = "select new Privilage (p.id,p.role_id,p.module_id,p.select_permission,p.insert_permission,p.update_permission,p.delete_permission) from Privilage p order by p.id desc")
    List<Privilage>findAll();

    @Query(value = "SELECT bit_or(p.select_permission),bit_or(p.insert_permission),bit_or(p.update_permission),bit_or(p.delete_permission) FROM techbeats.privilage as p " +
            "where p.role_id in (select uhr.role_id from techbeats.user_has_role as uhr " +
            "where uhr.user_id in (select u.id from techbeats.user as u " +
            "where u.user_name = ?1)) and p.module_id in (select m.id from techbeats.module as m " +
            "where m.name = ?2);" , nativeQuery = true)
    String getPrivilageByUserModule(String username,String modulename);

    @Query(value = "select p from Privilage p where p.role_id.id=?1 and p.module_id.id =?2")
    Privilage getByRoleandModule(Integer rollid,Integer moduleid);
}
