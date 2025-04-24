package com.bakeryshop.repository;

import com.bakeryshop.model.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Integer> {

    @Query(value = "SELECT * FROM metodospago", nativeQuery = true)
    List<MetodoPago> findAllMetodosPago();
}