package com.bitproject.techbeats.privilage.repository;

import com.bitproject.techbeats.privilage.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module,Integer> {

    @Query(value = "SELECT m.name FROM techbeats.module as m where m.id not in (select p.module_id from techbeats.privilage as p where p.select_permission=1 and p.role_id in (select uhr.role_id from techbeats.user_has_role as uhr where uhr.user_id in (select u.id from techbeats.user as u where u.user_name=?1)));",nativeQuery = true)
    List getByUser(String username);
}
