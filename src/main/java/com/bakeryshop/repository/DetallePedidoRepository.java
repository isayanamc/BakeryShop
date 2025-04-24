package com.bakeryshop.repository;

import com.bakeryshop.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {

    @Query(value = "SELECT * FROM detallepedidos WHERE id_pedido = :idPedido", nativeQuery = true)
    List<DetallePedido> findByPedidoId(@Param("idPedido") Integer idPedido);
    
    @Query(value = "INSERT INTO detallepedidos (id_pedido, id_producto, cantidad, subtotal) VALUES (:idPedido, :idProducto, :cantidad, :subtotal)", nativeQuery = true)
    void agregarDetallePedido(
        @Param("idPedido") Integer idPedido,
        @Param("idProducto") Integer idProducto,
        @Param("cantidad") Integer cantidad,
        @Param("subtotal") Double subtotal
    );
}