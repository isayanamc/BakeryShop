package com.bakeryshop.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import com.bakeryshop.model.Pedido;

public interface ReporteRepository extends JpaRepository<Pedido, Integer> {
    
    @Query(value = 
        "SELECT DATE(p.fecha) as fecha, SUM(p.total) as total_ventas " +
        "FROM pedidos p " +
        "WHERE p.estado = 'Entregado' " +
        "AND p.fecha BETWEEN :fechaInicio AND :fechaFin " +
        "GROUP BY DATE(p.fecha) " +
        "ORDER BY fecha", nativeQuery = true)
    List<Object[]> obtenerVentasPorFecha(
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin
    );
    
    @Query(value = 
        "SELECT pr.id_producto, pr.nombre, SUM(dp.cantidad) as total_vendido, SUM(dp.subtotal) as total_generado " +
        "FROM detallepedidos dp " +
        "JOIN productos pr ON dp.id_producto = pr.id_producto " +
        "JOIN pedidos p ON dp.id_pedido = p.id_pedido " +
        "WHERE p.estado = 'Entregado' " +
        "AND (p.fecha BETWEEN :fechaInicio AND :fechaFin) " +
        "GROUP BY dp.id_producto " +
        "ORDER BY total_vendido DESC " +
        "LIMIT :limite", nativeQuery = true)
    List<Object[]> obtenerProductosMasVendidos(
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin, 
        @Param("limite") Integer limite
    );
    
    @Query(value = 
        "SELECT pr.id_producto, pr.nombre, SUM(dp.cantidad) as total_vendido, SUM(dp.subtotal) as total_generado " +
        "FROM detallepedidos dp " +
        "JOIN productos pr ON dp.id_producto = pr.id_producto " +
        "JOIN pedidos p ON dp.id_pedido = p.id_pedido " +
        "WHERE p.estado = 'Entregado' " +
        "AND (p.fecha BETWEEN :fechaInicio AND :fechaFin) " +
        "AND pr.categoria = :categoria " +
        "GROUP BY dp.id_producto " +
        "ORDER BY total_vendido DESC " +
        "LIMIT :limite", nativeQuery = true)
    List<Object[]> obtenerProductosMasVendidosPorCategoria(
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin, 
        @Param("categoria") String categoria,
        @Param("limite") Integer limite
    );
    
    @Query(value = 
        "SELECT c.id_cliente, c.nombre, COUNT(p.id_pedido) as cantidad_pedidos, SUM(p.total) as total_gastado " +
        "FROM pedidos p " +
        "JOIN clientes c ON p.id_cliente = c.id_cliente " +
        "WHERE p.estado = 'Entregado' " +
        "AND (p.fecha BETWEEN :fechaInicio AND :fechaFin) " +
        "GROUP BY p.id_cliente " +
        "ORDER BY cantidad_pedidos DESC, total_gastado DESC " +
        "LIMIT :limite", nativeQuery = true)
    List<Object[]> obtenerClientesFrecuentes(
        @Param("fechaInicio") LocalDate fechaInicio, 
        @Param("fechaFin") LocalDate fechaFin, 
        @Param("limite") Integer limite
    );
    
    @Query(value = 
        "SELECT SUM(p.total) as total_ventas " +
        "FROM pedidos p " +
        "WHERE p.estado = 'Entregado' " +
        "AND DATE(p.fecha) = :fecha", nativeQuery = true)
    Double obtenerTotalVentasDia(@Param("fecha") LocalDate fecha);
    
    @Procedure(name = "VentasPorFecha")
    Double ventasPorFecha(@Param("p_fecha") LocalDate fecha);
    
    @Procedure(name = "ProductosMasVendidos")
    List<Object[]> productosMasVendidos();
}