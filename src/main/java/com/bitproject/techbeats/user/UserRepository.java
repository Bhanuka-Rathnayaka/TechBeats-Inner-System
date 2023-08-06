package com.bitproject.techbeats.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    @Query("select u from User u where u.user_name=?1")
    User findUserByUsername(String username);


    @Query(value = "select new User (e.id,e.employee_id,e.user_name,e.email,e.adddatetime,e.status) from User e order by e.id desc ")
    List<User> findAll();

    @Query("select u from User u where u.employee_id.id = ?1")//id parameter pass (in here ?1 mean first parameter)
    User getUserByEmployee(Integer id);
}
