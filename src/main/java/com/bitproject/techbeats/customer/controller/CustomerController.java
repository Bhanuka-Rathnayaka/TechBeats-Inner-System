package com.bitproject.techbeats.customer.controller;

import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customer.repository.CustomerRepository;
import com.bitproject.techbeats.customer.repository.CustomerStatusRepository;
import com.bitproject.techbeats.employee.model.Employee;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private CustomerRepository customerDao;

    @Autowired
    private CustomerStatusRepository customerStatusDao;

    //load customer ui
    @GetMapping
    public ModelAndView customerView(){
        ModelAndView customerUI = new ModelAndView();
        customerUI.setViewName("customer.html");
        return customerUI;
    }

    //create mapping for get all customer
    @GetMapping(value = "/all" , produces = "application/json")
    public List<Customer> customersFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return customerDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        }else{
            return null;
        }

    };

    @GetMapping(value = "/bystatus",produces = "application/json")
    public List<Customer> activeCustomerList(){
        return customerDao.customerByStatus();
    }

    @GetMapping(value = "/bymobile/{mobileno}",produces = "application/json")
    public Customer getCustomerByMobile(@PathVariable("mobileno")String mobileno){
        return customerDao.findByMobile(mobileno);
    }
    //create delete mapping
    @DeleteMapping
    public String deleteCustomer(@RequestBody Customer customer){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check customer exist
            Customer extcus = customerDao.getReferenceById(customer.getId());

            if(extcus != null){
                try {
                    //set auto instert value
                    extcus.setDeletedatetime(LocalDateTime.now());
                    extcus.setDeleteuser_id(logExtUser);
                    extcus.setCustomer_status_id(customerStatusDao.getReferenceById(1));
                    customerDao.save(extcus);

                    return "0";

                }catch (Exception e){
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                return "Delete not complete : Customer not exist";
            }

        }else {
            return "Delete not complete : You dont have permission";
        }


    }


    @PostMapping
    public String postCustomer (@RequestBody Customer customer){
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer");
        if (logExtUser != null && userPrivilage.get("insert_permission")){
            //check duplicate


            try{
                customer.setCus_code(customerDao.nextCustomerNumber());
                customer.setCustomer_status_id(customerStatusDao.getReferenceById(2));
                customer.setAdddatetime(LocalDateTime.now());
                customer.setAdduser_id(logExtUser);

                //save operator
                customerDao.save(customer);

                //need update dependency module

                return "0";
            }catch(Exception e){
                return "Customer Add not completed : "+e.getMessage();
            }
        }else {
            return "Insert not complete : You dont have permission";
        }

    }

    //get mapping service for get customer by given path variable id[/customer/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Customer getEmployeeById(@PathVariable("id") Integer id){
        return customerDao.getReferenceById(id);
    }

    @PutMapping
    public String putCustomer (@RequestBody Customer customer){
        //check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());
        System.out.println(logExtUser);

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer");
        if (logExtUser != null && userPrivilage.get("update_permission")){
            //check duplicate


            try{
                customer.setUpdatedatetime(LocalDateTime.now());
                customer.setUpdateuser_id(logExtUser);
                //save operator
                customerDao.save(customer);

                //need update dependency module

                return "0";
            }catch(Exception e){
                return "Customer Update not completed : "+e.getMessage();
            }
        }else {
            return "Update not complete : You dont have permission";
        }

    }

}
