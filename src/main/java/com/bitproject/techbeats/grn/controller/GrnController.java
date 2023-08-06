package com.bitproject.techbeats.grn.controller;

import com.bitproject.techbeats.casing.model.Casing;
import com.bitproject.techbeats.casing.repository.CasingRepository;
import com.bitproject.techbeats.cooler.model.Cooler;
import com.bitproject.techbeats.cooler.repository.CoolerRepository;
import com.bitproject.techbeats.customerorder.model.CustomerOrder;
import com.bitproject.techbeats.customerorderitem.model.CustomerOrderItem;
import com.bitproject.techbeats.grn.model.Grn;
import com.bitproject.techbeats.grn.model.GrnItem;
import com.bitproject.techbeats.grn.repository.GrnRepository;
import com.bitproject.techbeats.grn.repository.GrnStatusRepository;
import com.bitproject.techbeats.laptop.model.Laptop;
import com.bitproject.techbeats.laptop.repository.LaptopRepository;
import com.bitproject.techbeats.motherboard.model.Motherboard;
import com.bitproject.techbeats.motherboard.repository.MothrboardRepository;
import com.bitproject.techbeats.powersupply.model.Powersupply;
import com.bitproject.techbeats.powersupply.repository.PsuRepository;
import com.bitproject.techbeats.privilage.controller.PrivilageControl;
import com.bitproject.techbeats.processor.model.Processor;
import com.bitproject.techbeats.processor.repository.ProcessorRepository;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequest;
import com.bitproject.techbeats.purchacerequest.model.PurchaseRequestItem;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestRepository;
import com.bitproject.techbeats.purchacerequest.repository.PurchaseRequestStatusRepository;
import com.bitproject.techbeats.ram.model.Ram;
import com.bitproject.techbeats.ram.repositary.RamRepository;
import com.bitproject.techbeats.serielno.model.Seriel;
import com.bitproject.techbeats.storage.model.Storage;
import com.bitproject.techbeats.storage.repository.StorageRepository;
import com.bitproject.techbeats.supplier.model.Supplier;
import com.bitproject.techbeats.supplier.repository.SupplierRepository;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import com.bitproject.techbeats.vga.modal.Vga;
import com.bitproject.techbeats.vga.repository.VgaRepository;
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
@RequestMapping(value = "/grn")
public class GrnController {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageControl privilageControl;
    @Autowired
    private GrnRepository grnDao;
    @Autowired
    private GrnStatusRepository grnStatusDao;
    @Autowired
    private PurchaseRequestRepository purchaseRequestDao;
    @Autowired
    private PurchaseRequestStatusRepository purchaseRequestStatusDao;
    @Autowired
    private SupplierRepository supplierDao;
    @Autowired
    private CoolerRepository coolerDao;
    @Autowired
    private RamRepository ramDao;
    @Autowired
    private ProcessorRepository processorDao;
    @Autowired
    private CasingRepository casingDao;
    @Autowired
    private  VgaRepository vgaDao;
    @Autowired
    private PsuRepository psuDao;
    @Autowired
    private MothrboardRepository mothrboardDao;
    @Autowired
    private StorageRepository storageDao;
    @Autowired
    private LaptopRepository laptopDao;

    //load customer ui
    @GetMapping
    public ModelAndView grnView(){
        ModelAndView grnUI = new ModelAndView();
        grnUI.setViewName("grn.html");
        return grnUI;
    }

    @GetMapping(value = "/all",produces = "application/json")
    public List<Grn> grnFindAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Grn");

        if (logExtUser != null && userPrivilage.get("select_permission")){
            return grnDao.findAll(Sort.by(Sort.Direction.DESC,"code"));
        }else{
            List<Grn> grnList = new ArrayList<>();
            return grnList;
        }
    }

    //get mapping service for get storage by given quary variable id[/grn/getbyid?id=1]
    @GetMapping(value = "/getbyid" , params = {"id"}, produces = "application/json")
    public Grn getGRNByQPId(@RequestParam("id") Integer id){
        return grnDao.getReferenceById(id);
    }

    @GetMapping(value = "/listbysupplir/{sid}")
    public List<Grn> getGrnBySupplierId(@PathVariable("sid") Integer sid){
        return grnDao.grnBySupplierId(sid);
    }

    @PostMapping
    @Transactional
    public String addGrn(@RequestBody Grn grn){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Grn");
        if (logExtUser != null && userPrivilage.get("insert_permission")){


            try{
                //set auto value
                grn.setCode(grnDao.nextGrnCode());
                grn.setAdddatetime(LocalDateTime.now());
                grn.setAdduser_id(logExtUser);
                grn.setBalanceforgrn(grn.getFinalamaount());



                //save
                for (GrnItem gri : grn.getGrnItemList()){
                    gri.setGrn_id(grn);
                }

                for (Seriel seriel : grn.getSerielList()){
                        seriel.setGrn_id(grn);
                }

                grnDao.save(grn);

                /*////////////////*/

                //update purchase order status
                //get fully Purchase order object that in GRN object
                PurchaseRequest purchaseRequest = purchaseRequestDao.getReferenceById(grn.getPurchase_request_id().getId());

                //set Purhase order status that pending to complete
                if (grn.getGrn_status_id().getId() == 4){
                    purchaseRequest.setPurchase_status_id(purchaseRequestStatusDao.getReferenceById(2));
                }

                purchaseRequest.setUpdatedatetime(LocalDateTime.now());
                purchaseRequest.setDeleteuser_id(logExtUser);
                //save Purchase order
                for (PurchaseRequestItem poi : purchaseRequest.getPurchaseRequestItemList()){
                    poi.setPurchase_request_id(purchaseRequest);
                }

                purchaseRequestDao.save(purchaseRequest);

                /*/////////////////////*/
                //add Supplier balance to grn total
                //get fully supplier object that in GRN object

                Supplier supplier = supplierDao.getReferenceById(grn.getPurchase_request_id().getSupplier_id().getId());

                BigDecimal balance = supplier.getBalance();
                BigDecimal grnFinalamaount = grn.getFinalamaount();

                supplier.setBalance(balance.add(grnFinalamaount));

                supplierDao.save(supplier);

                /*/////////////*/


                for (Seriel seriel : grn.getSerielList()){

                    if (seriel.getItem_category_id().getName().equals("Cooler")){
                        Cooler cooler = coolerDao.coolerbyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        cooler.setSale_price(seriel.getSale_price());
                        cooler.setPurchase_price(seriel.getPurchase_price());

                        coolerDao.save(cooler);
                    }

                    if (seriel.getItem_category_id().getName().equals("Ram")){
                        Ram ram = ramDao.rambyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        ram.setSale_price(seriel.getSale_price());
                        ram.setPurchase_price(seriel.getPurchase_price());

                        ramDao.save(ram);
                    }

                    if (seriel.getItem_category_id().getName().equals("Casing")){
                        Casing casing = casingDao.casingbyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        casing.setSale_price(seriel.getSale_price());
                        casing.setPurchase_price(seriel.getPurchase_price());

                        casingDao.save(casing);
                    }

                    if (seriel.getItem_category_id().getName().equals("Motherboard")){
                        Motherboard motherboard = mothrboardDao.mbbyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        motherboard.setSale_price(seriel.getSale_price());
                        motherboard.setPurchase_price(seriel.getPurchase_price());

                        mothrboardDao.save(motherboard);
                    }

                    if (seriel.getItem_category_id().getName().equals("Laptop")){
                        Laptop laptop = laptopDao.lapbyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        laptop.setSale_price(seriel.getSale_price());
                        laptop.setPurchase_price(seriel.getPurchase_price());

                        laptopDao.save(laptop);
                    }

                    if (seriel.getItem_category_id().getName().equals("Storage")){
                        Storage storage = storageDao.stbyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        storage.setSale_price(seriel.getSale_price());
                        storage.setPurchase_price(seriel.getPurchase_price());

                        storageDao.save(storage);
                    }

                    if (seriel.getItem_category_id().getName().equals("Power Supply Unit")){
                        Powersupply powersupply = psuDao.psubyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        powersupply.setSale_price(seriel.getSale_price());
                        powersupply.setPurchase_price(seriel.getPurchase_price());

                        psuDao.save(powersupply);


                    }

                    if (seriel.getItem_category_id().getName().equals("Graphic Card")){
                        Vga vga = vgaDao.vgabyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        vga.setSale_price(seriel.getSale_price());
                        vga.setPurchase_price(seriel.getPurchase_price());

                        vgaDao.save(vga);


                    }

                    if (seriel.getItem_category_id().getName().equals("Processor")){
                        Processor processor = processorDao.probyitemcodename(seriel.getItem_code(),seriel.getItem_name());
                        processor.setSale_price(seriel.getSale_price());
                        processor.setPurchase_price(seriel.getPurchase_price());

                        processorDao.save(processor);


                    }


                }


                return "0";

            }catch(Exception e){
                return "GRN insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }

    @PutMapping
    @Transactional
    public String updateGrn(@RequestBody Grn grn){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Grn");
        if (logExtUser != null && userPrivilage.get("update_permission")){


            try{
                //set auto value
                grn.setUpdatedatetime(LocalDateTime.now());
                grn.setUpdateuser_id(logExtUser);


                //save
                for (GrnItem gri : grn.getGrnItemList()){
                    gri.setGrn_id(grn);
                }

                grnDao.save(grn);
/*
                //update purchase order status
                //get fully Purchase order object that in GRN object
                PurchaseRequest purchaseRequest = purchaseRequestDao.getReferenceById(grn.getPurchase_request_id().getId());

                //set Purhase order status that pending to complete
                purchaseRequest.setPurchase_status_id(purchaseRequestStatusDao.getReferenceById(2));
                purchaseRequest.setUpdatedatetime(LocalDateTime.now());
                purchaseRequest.setDeleteuser_id(logExtUser);

                //save Purchase order
                for (PurchaseRequestItem poi : purchaseRequest.getPurchaseRequestItemList()){
                    poi.setPurchase_request_id(purchaseRequest);
                }

                purchaseRequestDao.save(purchaseRequest);*/

                return "0";

            }catch(Exception e){
                return "GRN insert not complete :" + e.getMessage();
            }
        }else {
            return "Add not complete : You dont have permission";
        }
    }


    //create delete mapping
    @DeleteMapping
    public String deleteGrn(@RequestBody Grn grn){
        //check privilage

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();//login user(get record from configuration file)
        User logExtUser = userDao.findUserByUsername(auth.getName());

        HashMap<String,Boolean> userPrivilage = privilageControl.getPrivilageByUserModule(auth.getName(),"Grn");

        if (logExtUser != null && userPrivilage.get("delete_permission")){
            //check Customer order exist
            Grn extgrn = grnDao.getReferenceById(grn.getId());

            if(extgrn != null){
                try {
                    //set auto instert value
                    extgrn.setDeletedatetime(LocalDateTime.now());
                    extgrn.setDeleteuser_id(logExtUser);
                    extgrn.setGrn_status_id(grnStatusDao.getReferenceById(2));
                    grnDao.save(extgrn);

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
