package com.bitproject.techbeats.storage.repository;


import com.bitproject.techbeats.cooler.model.CoolerSeries;
import com.bitproject.techbeats.storage.model.StorageFormfactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorageFormfactorRepository extends JpaRepository <StorageFormfactor,Integer>{
    //quary for get storage formfactor for given type id
    @Query(value ="select sff from StorageFormfactor sff where sff.st_type_id.id=?1")
    List<StorageFormfactor>findByType(Integer tid);
}
