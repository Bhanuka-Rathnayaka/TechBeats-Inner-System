package com.bitproject.techbeats.invoice.controller;

import com.bitproject.techbeats.customer.model.Customer;
import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderRepository;
import com.bitproject.techbeats.customerorder.repository.CustomerOrderStatusRepository;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.customerorderitem.repository.CustomerOrderItemRepository;
import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.grn.repository.GrnRepository;
import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.invoice.repossitory.InvoiceRepository;
import com.bitproject.techbeats.invoice.repossitory.InvoiceStatusRepository;
import com.bitproject.techbeats.invoiceitem.model.InvoiceItem;
import com.bitproject.techbeats.invoiceitem.repository.InvoiceItemRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.serielno.model.Seriel;
import com.bitproject.techbeats.serielno.repository.SerielRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/invoice")
public class InvoiceController {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private InvoiceStatusRepository invoiceStatusDao;

    @Autowired
    private InvoiceItemRepository invoiceItemDao;

    @Autowired
    private CustomerOrderRepository customerOrderDao;
    @Autowired
    private CustomerOrderStatusRepository customerOrderStatusDao;
    @Autowired
    private GrnRepository grnDao;
    @Autowired
    private SerielRepository serielDao;


    //load customer ui
    @GetMapping
    public ModelAndView invoiceView(){
        ModelAndView invoiceUI = new ModelAndView();
        invoiceUI.setViewName("invoice.html");
        return invoiceUI;
    }

   @GetMapping(value = "/all",produces = "application/json")
    public List<Invoice>invoiceFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Invoice");


        if (logExtUser != null && userPrivilage.get("select_permission")){
            return invoiceDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        }else{
           List<Invoice> invoiceList = new ArrayList<>();
           return invoiceList;
        }
    }


    @PostMapping
    @Transactional
    public String addinvoice(@RequestBody Invoice invoice){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Invoice");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                invoice.setInvoicenumber(invoiceDao.nextInCode());
                invoice.setAdddatetime(LocalDateTime.now());
                invoice.setAdduser_id(logExtUser);
                invoice.setDate(LocalDate.now());
                //invoice.setInvoice_status_id(invoiceStatusDao.getReferenceById(1));



                //save
                for (InvoiceItem ini : invoice.getInvoiceItemList()){
                    ini.setInvoice_id(invoice);
                }

                invoiceDao.save(invoice);

                //update customer order status
                //check if invoice crete from preorder or not
                if (invoice.getCustomerorder_id() != null){//true
                    //get fully customer order object that in invoice object
                    CustomerOrder customerOrder = customerOrderDao.getReferenceById(invoice.getCustomerorder_id().getId());

                    //set customer order status that pending to invoice create-payment pending
                    customerOrder.setOrderstatus_id(customerOrderStatusDao.getReferenceById(4));
                    customerOrder.setUpdatedatetime(LocalDateTime.now());
                    customerOrder.setUpdateuser_id(logExtUser);

                    //save customer order
                    for (CustomerOrderItem coi : customerOrder.getCustomerOrderItemList()){
                        coi.setCustomerorder_id(customerOrder);
                    }

                    customerOrderDao.save(customerOrder);

                }
                //if invoice is complete change serial key status is change to false
                if (invoice.getInvoice_status_id().getId()==1){
                    for (InvoiceItem ini : invoice.getInvoiceItemList()){
                        Grn grnCatCodeName =  grnDao.getGrnByItemCatodeName(ini.getItem_category_id().getId(),ini.getItemcode(),ini.getItemname(),ini.getSerialnumber());
                        Seriel serialCatCodeName = serielDao.getSerialByItemCatodeName(ini.getItem_category_id().getId(),ini.getItemcode(),ini.getItemname(),ini.getSerialnumber());
                        serialCatCodeName.setStatus(false);
                        serialCatCodeName.setGrn_id(grnCatCodeName);
                        serielDao.save(serialCatCodeName);

                    }
                }

                return invoice.getInvoicenumber();

            }catch(Exception e){
                return "Invoice Add not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }

    //get mapping service for get customer by given path variable id[/customer/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Invoice getInvoiceById(@PathVariable("id") Integer id){
        return invoiceDao.getReferenceById(id);
    }

    //get mapping service for get customer by given path variable id[/customer/getbyid/1]
    @GetMapping(value = "/getbyInvoicenumber/{code}",produces = "application/json")
    public Invoice getInvoiceByCode(@PathVariable("code") String code){
        return invoiceDao.getReferenceByInvoiceCode(code);
    }

    @PutMapping
    public String putStorage(@RequestBody Invoice invoice){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Invoice");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                invoice.setUpdateuser_id(logExtUser);
                //set add date time
                invoice.setUpdatedatetime(LocalDateTime.now());
                invoice.setInvoice_status_id(invoiceStatusDao.getReferenceById(1));


                //save operate
                //JSON Ignor karapu
                for (InvoiceItem ini : invoice.getInvoiceItemList()){
                    ini.setInvoice_id(invoice);
                }
                invoiceDao.save(invoice);

                //if invoice is complete change serial key status is change to false
                if (invoice.getInvoice_status_id().getId()==1){
                    for (InvoiceItem ini : invoice.getInvoiceItemList()){
                        Grn grnCatCodeName =  grnDao.getGrnByItemCatodeName(ini.getItem_category_id().getId(),ini.getItemcode(),ini.getItemname(),ini.getSerialnumber());
                        Seriel serialCatCodeName = serielDao.getSerialByItemCatodeName(ini.getItem_category_id().getId(),ini.getItemcode(),ini.getItemname(),ini.getSerialnumber());
                        serialCatCodeName.setStatus(false);
                        serialCatCodeName.setGrn_id(grnCatCodeName);
                        serielDao.save(serialCatCodeName);

                    }
                }

                //after payment change cus order status coplete
                CustomerOrder customerOrder = customerOrderDao.getReferenceById(invoice.getCustomerorder_id().getId());


                customerOrder.setOrderstatus_id(customerOrderStatusDao.getReferenceById(1));
                customerOrder.setUpdatedatetime(LocalDateTime.now());
                customerOrder.setUpdateuser_id(logExtUser);

                //save
                for (CustomerOrderItem coi : customerOrder.getCustomerOrderItemList()){
                    coi.setCustomerorder_id(customerOrder);
                }

                customerOrderDao.save(customerOrder);

                return "0";
            }catch(Exception e){
                return "Invoice Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }




}
