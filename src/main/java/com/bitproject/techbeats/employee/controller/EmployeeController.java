package com.bitproject.techbeats.employee.controller;

import com.bitproject.techbeats.employee.model.Employee;
import com.bitproject.techbeats.employee.repository.EmpStatusRepository;
import com.bitproject.techbeats.employee.repository.EmployeeRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/employee")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeDao;

    @Autowired
    private EmpStatusRepository empStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    //load employee ui
    @GetMapping
    public ModelAndView employeeView(){
        ModelAndView employeeUI = new ModelAndView();
        employeeUI.setViewName("employee.html");
        return employeeUI;
    }

    //get mapping service for get employee by given path variable id[/employee/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Employee getEmployeeById(@PathVariable("id") Integer id){
        return employeeDao.getReferenceById(id);
    }

    //create mapping for get all employee
    @GetMapping(value = "/all" , produces = "application/json")
    public List <Employee> employeesFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Employee");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return employeeDao.findAll();
        }else{
            List <Employee> employeeList = new ArrayList<>();
            return employeeList;
        }

    };

    //mapping for get employee list without user account(this one need for user form where select employee field)
    @GetMapping(value = "/listbywithoutuseraccount",produces = "application/json")
    public List<Employee> getEmployeeListWithoutUserAccount(){
        return employeeDao.getEmployeeWithoutUser();
    }

    //create delete mapping
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employee){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Employee");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check employee exist
            Employee extemp = employeeDao.getReferenceById(employee.getId());

            if(extemp != null){
                try {
                    //set auto instert value
                    extemp.setDeletedatetime(LocalDateTime.now());
                    extemp.setEmp_status_id(empStatusDao.getReferenceById(3));
                    employeeDao.save(extemp);

                    return "0";

                }catch (Exception e){
                    //return server error
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                //return employee not exsist error
                return "Delete not complete : employee not exist";
            }

        }else {
            //return not permission error
            return "Delete not complete : You dont have permission";
        }


    }

    @PostMapping
    public String postEmployee (@RequestBody Employee employee){
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Employee");

        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check duplicate
            //check exist NIC
            Employee extnic = employeeDao.findEmployeeByNic(employee.getNic());
            if(extnic != null && extnic.getId() != employee.getId()){
                return "employee insert not complete : NIC already exist";
            }

            //check exit email
            Employee extemail = employeeDao.findEmployeeByEmail(employee.getEmail());
            if(extemail != null && extemail.getId() != employee.getId()){
                return "employee insert not complete : Email already exist";
            }

            try{
                employee.setNumber(employeeDao.nextEmployeeNumber());
                employee.setAdddatetime(LocalDateTime.now());

                //save operator
                employeeDao.save(employee);


                return "0";
            }catch(Exception e){
                return "employee Add not completed : "+e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }



    }


    @PutMapping
    public String putEmployee (@RequestBody Employee employee){
        //check privilage

        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Employee");

        if (logExtUser != null && userPrivilage.get("update_permission")){
            //check duplicate
            //check exist NIC
            Employee extnic = employeeDao.findEmployeeByNic(employee.getNic());
            if(extnic != null && extnic.getId() != employee.getId()){
                return "employee insert not complete : NIC already exist";
            }

            //check exit email
            Employee extemail = employeeDao.findEmployeeByEmail(employee.getEmail());
            if(extemail != null && extemail.getId() != employee.getId()){
                return "employee insert not complete : Email already exist";
            }

            try{

                employee.setUpdatedatetime(LocalDateTime.now());

                //save operator
                employeeDao.save(employee);

                //need update dependency module

                return "0";
            }catch(Exception e){
                return "employee update not completed : "+e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }

    }


}
