package com.bakeryshop.repository;

import com.bakeryshop.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    @Procedure(name = "AgregarProducto")
    void agregarProducto(
            @Param("p_nombre") String nombre,
            @Param("p_descripcion") String descripcion,
            @Param("p_precio") Double precio,
            @Param("p_stock") Integer stock,
            @Param("p_categoria") String categoria,
            @Param("p_imagen_url") String imagenUrl,
            @Param("p_tiempo_preparacion") Integer tiempoPreparacion
    );
    
    @Procedure(name = "EliminarProducto")
    void eliminarProducto(@Param("p_id_producto") Integer idProducto);
    
    @Procedure(name = "ActualizarProducto")
    void actualizarProducto(
            @Param("p_id_producto") Integer idProducto,
            @Param("p_nombre") String nombre,
            @Param("p_descripcion") String descripcion,
            @Param("p_precio") Double precio,
            @Param("p_stock") Integer stock,
            @Param("p_categoria") String categoria,
            @Param("p_imagen_url") String imagenUrl,
            @Param("p_tiempo_preparacion") Integer tiempoPreparacion
    );
    
    @Procedure(name = "BuscarProductosPorCategoria")
    List<Producto> buscarProductosPorCategoria(@Param("p_categoria") String categoria);
    
    @Query(value = "SELECT * FROM productos WHERE categoria = :categoria", nativeQuery = true)
    List<Producto> findByCategoria(@Param("categoria") String categoria);
    
    @Query(value = "SELECT * FROM productos", nativeQuery = true)
    List<Producto> findAllProductos();

    @Query(value = "SELECT * FROM productos ORDER BY id_producto ASC LIMIT 5", nativeQuery = true)
    List<Producto> findDestacados();
    

}