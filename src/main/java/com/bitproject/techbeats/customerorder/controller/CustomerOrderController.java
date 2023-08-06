package com.bitproject.techbeats.customerorder.controller;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorder.model.CustomerOrderStatus;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderRepository;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderStatusRepository;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.customerorderitem.repository.CustomerOrderItemRepository;
import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.invoice.repossitory.InvoiceRepository;
import com.bitproject.techbeats.invoice.repossitory.InvoiceStatusRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customerorder")
public class CustomerOrderController {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private CustomerOrderRepository customerOrderDao;

    @Autowired
    private CustomerOrderItemRepository customerOrderItemDao;

    @Autowired
    private CustomerOrderStatusRepository customerOrderStatusRepository;

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private InvoiceStatusRepository invoiceStatusDao;


    //load customer ui
    @GetMapping
    public ModelAndView customerOrderView(){
        ModelAndView customerOrderUI = new ModelAndView();
        customerOrderUI.setViewName("customerorder.html");
        return customerOrderUI;
    }

    @GetMapping(value = "/all",produces = "application/json")
    public List<CustomerOrder>customerOrdersFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer Order");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return customerOrderDao.findAll(Sort.by(Sort.Direction.DESC,"code"));
        }else{
           List<CustomerOrder> customerOrderList = new ArrayList<>();
           return customerOrderList;
        }
    }

    //get mapping service for get storage by given quary variable id[/storage/getbyid?id=1]
    @GetMapping(value = "/getbyid" , params = {"id"}, produces = "application/json")
    public CustomerOrder getCOrderByQPId(@RequestParam("id") Integer id){
        return customerOrderDao.getReferenceById(id);
    }

    //get pending customer order for invoice
    @GetMapping(value = "/bystatus",produces = "application/json")
    public List<CustomerOrder> pendingCOList(){

        return customerOrderDao.corderListForInvoice(LocalDate.now());
    }

    //get pending customer order counnt
    @GetMapping(value = "/pendingorder",produces = "application/json")
    public CustomerOrder pendingCustomerOrderCount(){
        return customerOrderDao.getPendingCOCount();
    }

    //create delete mapping
    @DeleteMapping
    public String deleteCustomerOrder(@RequestBody CustomerOrder customerOrder){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer Order");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check Customer order exist
            CustomerOrder extCO = customerOrderDao.getReferenceById(customerOrder.getId());

            if(extCO != null){
                try {
                    //set auto instert value
                    extCO.setDeletedatetime(LocalDateTime.now());
                    extCO.setOrderstatus_id(customerOrderStatusRepository.getReferenceById(3));
                    customerOrderDao.save(extCO);

                    //change invoice status to order cancel when cancel customer order


                    return "0";

                }catch (Exception e){
                    return "Delete not complete :"+e.getMessage();
                }
            }else {
                return "Delete not complete : Order not exist";
            }

        }else {
            return "Delete not complete : You dont have permission";
        }


    }

    @PostMapping
    @Transactional
    public String addCustomerOrder(@RequestBody CustomerOrder customerorder){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer Order");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                customerorder.setCode(customerOrderDao.nextCoCode());
                customerorder.setAdddatetime(LocalDateTime.now());
                customerorder.setAdduser_id(logExtUser);


                //save
                for (CustomerOrderItem coi : customerorder.getCustomerOrderItemList()){
                    coi.setCustomerorder_id(customerorder);
                }

                 customerOrderDao.save(customerorder);

                return "0";

            }catch(Exception e){
                return "Customer Order insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }

    ////create mapping for post casing details("/customerorder")
    @PutMapping
    public String putCustomerOrder(@RequestBody CustomerOrder customerOrder){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Customer Order");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                customerOrder.setUpdateuser_id(logExtUser);

                //set updat date time
                customerOrder.setUpdatedatetime(LocalDateTime.now());

                //save

                for (CustomerOrderItem coi : customerOrder.getCustomerOrderItemList()){
                    coi.setCustomerorder_id(customerOrder);
                }

                customerOrderDao.save(customerOrder);
                return "0";
            }catch(Exception e){
                return "Customer order Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }
}
