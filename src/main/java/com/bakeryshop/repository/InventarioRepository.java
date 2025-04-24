package com.bakeryshop.repository;

import com.bakeryshop.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    
    @Query(value = "SELECT * FROM inventario", nativeQuery = true)
    List<Inventario> listarIngredientes();
    
    @Query(value = "SELECT * FROM inventario WHERE cantidad < :cantidadMinima", nativeQuery = true)
    List<Inventario> buscarIngredientesBajoCantidad(@Param("cantidadMinima") Double cantidadMinima);
    
    @Query(value = "UPDATE inventario SET cantidad = cantidad + :cantidad WHERE id_ingrediente = :idIngrediente", nativeQuery = true)
    void incrementarCantidad(@Param("idIngrediente") Integer idIngrediente, @Param("cantidad") Double cantidad);
    
    @Query(value = "UPDATE inventario SET cantidad = cantidad - :cantidad WHERE id_ingrediente = :idIngrediente", nativeQuery = true)
    void decrementarCantidad(@Param("idIngrediente") Integer idIngrediente, @Param("cantidad") Double cantidad);
}