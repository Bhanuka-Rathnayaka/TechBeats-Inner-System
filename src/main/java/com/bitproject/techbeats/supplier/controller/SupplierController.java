package com.bitproject.techbeats.supplier.controller;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.invoice.model.Invoice;
import com.bitproject.techbeats.invoiceitem.model.InvoiceItem;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.supplier.repository.SupplierRepository;
import com.bitproject.techbeats.supplier.repository.SupplierStatusRepossitory;
import com.bitproject.techbeats.supplierbank.model.SupplierBank;
import com.bitproject.techbeats.supplieritembrandcategory.model.SupplierItemBrandCategory;
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
@RequestMapping("/supplier")
public class SupplierController {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;
    @Autowired
    private SupplierRepository supplierDao;
    @Autowired
    private SupplierStatusRepossitory supplierStatusDao;


    //load customer ui
    @GetMapping
    public ModelAndView supplierView(){
        ModelAndView supplierUI = new ModelAndView();
        supplierUI.setViewName("supplier.html");
        return supplierUI;
    }

    //get supplier details
    @GetMapping(value = "/all",produces = "application/json")
    public List<Supplier> suppliersFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return supplierDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        }else{
            List<Supplier> supplierList = new ArrayList<>();
            return supplierList;
        }
    }

    //get mapping service for get supplier by given path variable id[/supplier/getbyid/1]
    @GetMapping(value = "/getbyid/{id}",produces = "application/json")
    public Supplier getSupplierById(@PathVariable("id") Integer id){
        return supplierDao.getReferenceById(id);
    }


    @PostMapping
    //
    @Transactional
    public String addSupplier(@RequestBody Supplier supplier){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                supplier.setSup_code(supplierDao.nextSupCode());
                supplier.setAdddatetime(LocalDateTime.now());
                supplier.setAdduser_id(logExtUser);
                supplier.setBalance(BigDecimal.valueOf(0.00));
                //invoice.setInvoice_status_id(invoiceStatusDao.getReferenceById(1));



                //save
                for (SupplierItemBrandCategory sbc : supplier.getSupplierItemBrandCategoriesList()){
                    sbc.setSupplier_id(supplier);
                }

                for (SupplierBank sb : supplier.getSupplierBanksList()){
                    sb.setSupplier_id(supplier);
                }

                supplierDao.save(supplier);
                return "0";

            }catch(Exception e){
                return "Supplier Add not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }

    ////create mapping for post supplier details("/supplier")
    @PutMapping
    public String putSupplier(@RequestBody Supplier supplier){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                supplier.setUpdateuser_id(logExtUser);

                //set updat date time
                supplier.setUpdatedatetime(LocalDateTime.now());

                //save

                //save
                for (SupplierItemBrandCategory sbc : supplier.getSupplierItemBrandCategoriesList()){
                    sbc.setSupplier_id(supplier);
                }

                for (SupplierBank sb : supplier.getSupplierBanksList()){
                    sb.setSupplier_id(supplier);
                }

                supplierDao.save(supplier);
                return "0";

            }catch(Exception e){
                return "Customer order Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }

    //create delete mapping
    @DeleteMapping
    public String deleteSupplier(@RequestBody Supplier supplier){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check Customer order exist
            Supplier extSup = supplierDao.getReferenceById(supplier.getId());

            if(extSup != null){
                try {
                    //set auto instert value
                    extSup.setDeletedatetime(LocalDateTime.now());
                    extSup.setDeleteuser_id(logExtUser);
                    extSup.setSupplier_status_id(supplierStatusDao.getReferenceById(2));
                    supplierDao.save(extSup);

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
}
