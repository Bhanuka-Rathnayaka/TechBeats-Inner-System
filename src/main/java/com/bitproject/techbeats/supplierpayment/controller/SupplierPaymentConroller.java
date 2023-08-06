package com.bitproject.techbeats.supplierpayment.controller;

import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.grn.model.GrnItem;
import com.bitproject.techbeats.grn.repository.GrnRepository;
import com.bitproject.techbeats.grn.repository.GrnStatusRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.serielno.model.Seriel;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.supplier.repository.SupplierRepository;
import com.bitproject.techbeats.supplierbank.model.SupplierBank;
import com.bitproject.techbeats.supplieritembrandcategory.model.SupplierItemBrandCategory;
import com.bitproject.techbeats.supplierpayment.model.SupplierPayment;
import com.bitproject.techbeats.supplierpayment.repository.SupplierPaymentRepository;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/supplierpayment")
public class SupplierPaymentConroller {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;
    @Autowired
    private SupplierPaymentRepository supplierPaymentDao;
    @Autowired
    private SupplierRepository supplierDao;
    @Autowired
    private GrnRepository grnDao;
    @Autowired
    private GrnStatusRepository grnStatusDao;

    @GetMapping
    public ModelAndView supplierPaymentView(){
        ModelAndView supplierPaymentUI = new ModelAndView();
        supplierPaymentUI.setViewName("supplierpayment.html");
        return supplierPaymentUI;
    }

    @GetMapping(value = "/all",produces = "application/json")
    public List<SupplierPayment> spFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier Payment");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return supplierPaymentDao.findAll();
        }else{
            List<SupplierPayment> spList = new ArrayList<>();
            return spList;
        }
    }

    @PostMapping
    public String addSupPayent(@RequestBody SupplierPayment supplierPayment){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Supplier Payment");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                supplierPayment.setPayment_no("PAY00001");
                supplierPayment.setAdddatetime(LocalDateTime.now());
                supplierPayment.setAdduser_id(logExtUser);

                BigDecimal grnTotal = supplierPayment.getGrnamount();
                BigDecimal paidAmount = supplierPayment.getPaidamount();

                BigDecimal newPendingGrnAmount = grnTotal.subtract(paidAmount);

                supplierPayment.setBalance(newPendingGrnAmount);

                //save
                supplierPaymentDao.save(supplierPayment);

                //update Supplier blance
                //get fully Supplier object that in Supplier payament object
                Supplier supplier = supplierDao.getReferenceById(supplierPayment.getSupplier_id().getId());


                BigDecimal balance = supplier.getBalance();
                BigDecimal paidamount = supplierPayment.getPaidamount();

                BigDecimal newBalance = balance.subtract(paidamount);
                supplier.setBalance(newBalance);

                //save
                for (SupplierItemBrandCategory sbc : supplier.getSupplierItemBrandCategoriesList()){
                    sbc.setSupplier_id(supplier);
                }

                for (SupplierBank sb : supplier.getSupplierBanksList()){
                    sb.setSupplier_id(supplier);
                }

                supplierDao.save(supplier);

                //update grn blance
                //get fully grn object that in Supplier payament object

                Grn grn = grnDao.getReferenceById(supplierPayment.getGrn_id().getId());

                BigDecimal balanceforgrn = grn.getBalanceforgrn();
                BigDecimal paidamountforgrn = supplierPayment.getPaidamount();

                BigDecimal newBalanceForGrn = balanceforgrn.subtract(paidamountforgrn);

                grn.setBalanceforgrn(newBalanceForGrn);


                BigDecimal balanceCompare = grn.getBalanceforgrn();
                if (balanceCompare.compareTo(BigDecimal.ZERO) == 0){
                    grn.setGrn_status_id(grnStatusDao.getReferenceById(1));
                }

                //save
                for (GrnItem gri : grn.getGrnItemList()){
                    gri.setGrn_id(grn);
                }

                for (Seriel seriel : grn.getSerielList()){
                    seriel.setGrn_id(grn);
                }

                grnDao.save(grn);

                return "0";

            }catch(Exception e){
                return "Payment insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }


}
