package com.bitproject.techbeats.purchacerequest.controller;

import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestItem;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestRepository;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestStatusRepository;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.supplier.repository.SupplierRepository;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/purchaserequest")
public class PurchaseRequestController {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;
    @Autowired
    private PurchaseRequestRepository purchaseRequestDao;
    @Autowired
    private PurchaseRequestStatusRepository purchaseRequestStatusDao;
    @Autowired
    private SupplierRepository supplierDao;

    //load customer ui
    @GetMapping
    public ModelAndView purchaserequestView(){
        ModelAndView purchaserequestUI = new ModelAndView();
        purchaserequestUI.setViewName("purchaserequest.html");
        return purchaserequestUI;
    }

    //get all pr
    @GetMapping(value = "/all",produces = "application/json")
    public List<PurchaseRequest> customerOrdersFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Purchase Request");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return purchaseRequestDao.findAll(Sort.by(Sort.Direction.DESC,"code"));
        }else{
            List<PurchaseRequest> purchaserequestList = new ArrayList<>();
            return purchaserequestList;
        }
    }

    @GetMapping(value = "/bysupplerid/{sid}", produces = "application/json")
    public List <PurchaseRequest> getPRBySuppler (@PathVariable("sid") Integer sid){
        return purchaseRequestDao.findPRBYSupplier(sid);
    }



    //get mapping service for get storage by given quary variable id[/purchaserequest/getbyid?id=1]
    @GetMapping(value = "/getbyid" , params = {"id"}, produces = "application/json")
    public PurchaseRequest getPRByQPId(@RequestParam("id") Integer id){
        return purchaseRequestDao.getReferenceById(id);
    }



    @PostMapping
    @Transactional
    public String addpurchaseOrder(@RequestBody PurchaseRequest purchaserequest){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Purchase Request");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                purchaserequest.setCode(purchaseRequestDao.getNexCode());
                purchaserequest.setAdddatetime(LocalDateTime.now());
                purchaserequest.setAdduser_id(logExtUser);


                //save
                for (PurchaseRequestItem pri : purchaserequest.getPurchaseRequestItemList()){
                    pri.setPurchase_request_id(purchaserequest);
                }

                purchaseRequestDao.save(purchaserequest);

                /*/////////*/


                return "0";

            }catch(Exception e){
                return "Purchase Order insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }

    ////create mapping for post casing details("/customerorder")
    @PutMapping
    public String putPurchaseOrder(@RequestBody PurchaseRequest purchaseRequest){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Purchase Request");
        if (logExtUser != null && userPrivilage.get("update_permission")){

            try{
                //set auto insert value
                purchaseRequest.setUpdateuser_id(logExtUser);

                //set updat date time
                purchaseRequest.setUpdatedatetime(LocalDateTime.now());

                //save

                for (PurchaseRequestItem pri : purchaseRequest.getPurchaseRequestItemList()){
                    pri.setPurchase_request_id(purchaseRequest);
                }

                purchaseRequestDao.save(purchaseRequest);
                return "0";
            }catch(Exception e){
                return "Purchase order Update not complete :" + e.getMessage();
            }
        }else{
            return "Update not complete : You dont have permission";
        }


    }

    //create delete mapping
    @DeleteMapping
    public String deletePurchaseOrder(@RequestBody PurchaseRequest purchaseRequest){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Purchase Request");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check Customer order exist
            PurchaseRequest extPR = purchaseRequestDao.getReferenceById(purchaseRequest.getId());

            if(extPR != null){
                try {
                    //set auto instert value
                    extPR.setDeletedatetime(LocalDateTime.now());
                    extPR.setDeleteuser_id(logExtUser);
                    extPR.setPurchase_status_id(purchaseRequestStatusDao.getReferenceById(3));
                    purchaseRequestDao.save(extPR);

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
