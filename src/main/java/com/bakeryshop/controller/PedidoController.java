package com.bakeryshop.controller;

import com.bakeryshop.dto.AsignarReposteroDTO;
import com.bakeryshop.dto.PedidoDTO;
import com.bakeryshop.model.DetallePedido;
import com.bakeryshop.model.MetodoPago;
import com.bakeryshop.model.Pedido;
import com.bakeryshop.model.EstadoPedido;
import com.bakeryshop.repository.MetodoPagoRepository;
import com.bakeryshop.repository.PedidoRepository;
import com.bakeryshop.service.PedidoService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @PostMapping("/crear")
    public ResponseEntity<Map<String, Object>> crearPedido(@Valid @RequestBody PedidoDTO pedidoDTO) {
        Integer idPedido = pedidoService.crearPedido(pedidoDTO);
        return ResponseEntity.ok(Map.of(
            "mensaje", "Pedido creado con éxito",
            "idPedido", idPedido
        ));
    }

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRADOR') or hasAuthority('ROLE_VENDEDOR')")
    public ResponseEntity<?> listarPedidos() {
        try {
            List<Pedido> pedidos = pedidoService.listarPedidos();
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "mensaje", e.getMessage(),
                "causa", e.getCause() != null ? e.getCause().toString() : "Sin causa",
                "tipo", e.getClass().getName()
            ));
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Pedido>> listarPedidosCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(pedidoService.listarPedidosCliente(idCliente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.obtenerPedido(id));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<DetallePedido>> obtenerDetallesPedido(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.obtenerDetallesPedido(id));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRADOR') or hasAuthority('ROLE_VENDEDOR') or hasAuthority('ROLE_CLIENTE')")
    public ResponseEntity<String> actualizarEstadoPedido(
            @PathVariable Integer id,
            @RequestParam EstadoPedido nuevoEstado) {
        pedidoService.actualizarEstadoPedido(id, nuevoEstado);
        return ResponseEntity.ok("Estado del pedido actualizado con éxito");
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<String> cancelarPedido(@PathVariable Integer id) {
        pedidoService.cancelarPedido(id);
        return ResponseEntity.ok("Pedido cancelado con éxito");
    }

    @GetMapping("/filtrar")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRADOR') or hasAuthority('ROLE_VENDEDOR')")
    public ResponseEntity<List<Pedido>> filtrarPedidosPorEstado(@RequestParam EstadoPedido estado) {
        return ResponseEntity.ok(pedidoService.filtrarPedidosPorEstado(estado));
    }

    @PatchMapping("/{id}/metodo-pago")
    @PreAuthorize("hasAuthority('ROLE_CLIENTE')")
    public ResponseEntity<String> actualizarMetodoPago(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {

        Integer nuevoMetodo = body.get("idMetodoPago");
        pedidoService.actualizarMetodoPago(id, nuevoMetodo);
        return ResponseEntity.ok("Método de pago actualizado");
    }

    @PostMapping("/{id}/confirmar-completo")
    public ResponseEntity<String> confirmarPedidoCompleto(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {

        Integer idMetodoPago = body.get("idMetodoPago");

        if (idMetodoPago == null) {
            return ResponseEntity.badRequest().body("El método de pago es requerido");
        }

        try {
            pedidoService.actualizarMetodoPago(id, idMetodoPago);
            pedidoService.actualizarEstadoPedido(id, EstadoPedido.En_proceso);
            return ResponseEntity.ok("Pedido confirmado con éxito");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al confirmar pedido: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/checkout-publico")
    public ResponseEntity<String> checkoutPublico(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {

        Integer idMetodoPago = body.get("idMetodoPago");

        if (idMetodoPago == null) {
            return ResponseEntity.badRequest().body("El método de pago es requerido");
        }

        try {
            Pedido pedido = pedidoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

            MetodoPago metodoPago = metodoPagoRepository.findById(idMetodoPago)
                    .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

            pedido.setMetodoPago(metodoPago);
            pedido.setEstado(EstadoPedido.En_proceso);
            pedidoRepository.save(pedido);

            return ResponseEntity.ok("Pedido confirmado exitosamente (público)");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al confirmar pedido: " + e.getMessage());
        }
    }
    

}
