package com.bakeryshop.repository;

import com.bakeryshop.model.Pedido;
import com.bakeryshop.model.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    @Procedure(name = "CrearPedido")
    int crearPedido(
        @Param("p_id_cliente") Integer idCliente,
        @Param("p_id_metodo_pago") Integer idMetodoPago,
        @Param("p_fecha_entrega") LocalDate fechaEntrega
    );

    @Procedure(name = "ActualizarEstadoPedido")
    void actualizarEstadoPedido(
        @Param("p_id_pedido") Integer idPedido,
        @Param("p_nuevo_estado") String nuevoEstado
    );

    @Procedure(name = "ConfirmarPedido")
    void confirmarPedido(@Param("p_id_pedido") Integer idPedido);

    @Query(value = "SELECT p.* FROM pedidos p WHERE p.id_cliente = :idCliente", nativeQuery = true)
    List<Pedido> findPedidosByClienteId(@Param("idCliente") Integer idCliente);

    @Query(value = "SELECT p.* FROM pedidos p WHERE p.estado = :estado", nativeQuery = true)
    List<Pedido> findPedidosByEstado(@Param("estado") String estado);
    
    default List<Pedido> findPedidosByEstado(EstadoPedido estado) {
        return findPedidosByEstado(estado.toString());
    }
    
    @Query(value = "SELECT p.* FROM pedidos p WHERE p.fecha_entrega = :fecha", nativeQuery = true)
    List<Pedido> findPedidosByFechaEntrega(@Param("fecha") LocalDate fecha);

}