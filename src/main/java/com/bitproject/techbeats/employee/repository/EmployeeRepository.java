package com.bitproject.techbeats.employee.repository;

import com.bitproject.techbeats.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

    //findall with selected colum only
    @Query(value = "select new Employee(e.id,e.number,e.callingname,e.fullname,e.address,e.nic,e.mobile,e.email,e.photo,e.emp_status_id) from Employee e order by e.id desc")
    List<Employee> findAll();

    //check exist nic
    Employee findEmployeeByNic(String nic);

    //check exist email
    Employee findEmployeeByEmail(String email);

    //auto increment number
    //add default value to number(increment only last digit)
    @Query(value = "SELECT lpad(max(e.number)+1,5,'0') FROM techbeats.employee as e;",nativeQuery = true)
    String nextEmployeeNumber();

    //quary for get employee list without having user account
    @Query(value = "select new Employee(e.id,e.number,e.callingname,e.email) from Employee e where  e.id not in(select u.employee_id.id from User u where u.employee_id is not null ) and e.emp_status_id.id=1")
    List<Employee> getEmployeeWithoutUser();
}
