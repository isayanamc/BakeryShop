package com.bakeryshop.service;

import com.bakeryshop.dto.DetallePedidoDTO;
import com.bakeryshop.dto.PedidoDTO;
import com.bakeryshop.model.*;
import com.bakeryshop.repository.*;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Transactional
    public Integer crearPedido(PedidoDTO pedidoDTO) {

        if (!clienteRepository.existsById(pedidoDTO.getIdCliente())) {
            throw new EntityNotFoundException("Cliente no encontrado");
        }

        if (!metodoPagoRepository.existsById(pedidoDTO.getIdMetodoPago())) {
            throw new EntityNotFoundException("Método de pago no encontrado");
        }

        double total = 0.0;
        for (DetallePedidoDTO detalle : pedidoDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + detalle.getIdProducto()));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            total += producto.getPrecio() * detalle.getCantidad();
        }

        int idPedido = pedidoRepository.crearPedido(
                pedidoDTO.getIdCliente(),
                pedidoDTO.getIdMetodoPago(),
                pedidoDTO.getFechaEntrega()
        );

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new IllegalArgumentException("Error al crear el pedido"));

        pedido.setEstado(EstadoPedido.Pendiente);
        pedido.setTotal(total);
        pedidoRepository.save(pedido);

        for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setSubtotal(producto.getPrecio() * detalleDTO.getCantidad());

            detallePedidoRepository.save(detalle);
        }

        return idPedido;
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPedidosCliente(Integer idCliente) {
        if (!clienteRepository.existsById(idCliente)) {
            throw new EntityNotFoundException("Cliente no encontrado");
        }
        return pedidoRepository.findPedidosByClienteId(idCliente);
    }

    public Pedido obtenerPedido(Integer id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));
    }

    public List<DetallePedido> obtenerDetallesPedido(Integer idPedido) {
        if (!pedidoRepository.existsById(idPedido)) {
            throw new EntityNotFoundException("Pedido no encontrado");
        }
        return detallePedidoRepository.findByPedidoId(idPedido);
    }

    @Transactional
    public void actualizarEstadoPedido(Integer idPedido, EstadoPedido nuevoEstado) {
        if (!pedidoRepository.existsById(idPedido)) {
            throw new EntityNotFoundException("Pedido no encontrado");
        }

        pedidoRepository.actualizarEstadoPedido(idPedido, nuevoEstado.toString());

        if (nuevoEstado == EstadoPedido.En_proceso) {
            pedidoRepository.confirmarPedido(idPedido);
        }
    }

    @Transactional
    public void cancelarPedido(Integer idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        if (pedido.getEstado() != EstadoPedido.Pendiente) {
            throw new IllegalArgumentException("Solo se pueden cancelar pedidos pendientes");
        }

        pedidoRepository.actualizarEstadoPedido(idPedido, EstadoPedido.Cancelado.toString());
    }

    @Transactional
    public void actualizarMetodoPago(Integer idPedido, Integer idMetodoPago) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));

        MetodoPago metodo = metodoPagoRepository.findById(idMetodoPago)
                .orElseThrow(() -> new EntityNotFoundException("Método de pago no válido"));

        pedido.setMetodoPago(metodo);
        pedidoRepository.save(pedido);
    }

    public List<Pedido> filtrarPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findPedidosByEstado(estado.toString());
    }
}
