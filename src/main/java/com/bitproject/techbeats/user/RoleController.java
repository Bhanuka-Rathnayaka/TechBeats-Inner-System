package com.bitproject.techbeats.user;

import com.bitproject.techbeats.employee.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/role")
public class RoleController {

    @Autowired
    private RolesRepository rolesDao;

    //create mapping for get user all details("/role/all")
    @GetMapping(value = "/all",produces = "application/json")
    public List<Roles> roleList(){
        return rolesDao.findAll();
    }

    //get mapping service for get roles by given user id[/role/byuserid/1]
    @GetMapping(value = "/byuserid/{userid}",produces = "application/json")
    public List<Roles> getRolesListByUser(@PathVariable("userid") Integer userid){
        return rolesDao.getRoleByUserId(userid);
    }
}
