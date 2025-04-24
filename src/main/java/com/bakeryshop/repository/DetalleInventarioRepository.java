package com.bakeryshop.repository;

import com.bakeryshop.model.DetalleInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DetalleInventarioRepository extends JpaRepository<DetalleInventario, Integer> {
    
    @Query(value = "SELECT * FROM detalleinventario WHERE id_producto = :idProducto", nativeQuery = true)
    List<DetalleInventario> buscarPorProductoId(@Param("idProducto") Integer idProducto);
    
    @Query(value = "SELECT * FROM detalleinventario WHERE id_ingrediente = :idIngrediente", nativeQuery = true)
    List<DetalleInventario> buscarPorIngredienteId(@Param("idIngrediente") Integer idIngrediente);
}