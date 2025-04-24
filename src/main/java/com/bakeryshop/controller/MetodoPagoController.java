package com.bakeryshop.controller;

import com.bakeryshop.model.MetodoPago;
import com.bakeryshop.repository.MetodoPagoRepository;
import com.bakeryshop.service.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/metodos-pago")
@CrossOrigin(origins = "http://localhost:3000")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<?> obtenerMetodos() {
        try {
            List<MetodoPago> metodos = metodoPagoRepository.findAll();
            return ResponseEntity.ok(metodos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al obtener métodos de pago: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/metodo-pago")
    public ResponseEntity<Void> actualizarMetodoPago(
        @PathVariable Integer id,
        @RequestBody Map<String, Integer> body
    ) {
        Integer idMetodoPago = body.get("idMetodoPago");
        pedidoService.actualizarMetodoPago(id, idMetodoPago);
        return ResponseEntity.ok().build();
    }

    
}
