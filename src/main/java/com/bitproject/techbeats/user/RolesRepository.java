package com.bitproject.techbeats.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RolesRepository extends JpaRepository<Roles,Integer> {
    //get role for given userid(in this we use param method)
    @Query(value = "select r from Roles r where r.id in (select uhr.role_id.id from UserHasRoles uhr where uhr.user_id.id = :userid)")
    List<Roles> getRoleByUserId(@Param("userid") Integer userid);

    @Query(value = "select r from Roles r where r.name <> 'Admin' and r.name <> 'Owner'")
    List<Roles>findAll();
}
