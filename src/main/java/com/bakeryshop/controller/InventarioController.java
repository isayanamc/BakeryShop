package com.bakeryshop.controller;

import com.bakeryshop.dto.ActualizarInventarioDTO;
import com.bakeryshop.dto.DetalleInventarioDTO;
import com.bakeryshop.dto.InventarioDTO;
import com.bakeryshop.model.DetalleInventario;
import com.bakeryshop.model.Inventario;
import com.bakeryshop.service.InventarioService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventario")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class InventarioController {
    
    @Autowired
    private InventarioService inventarioService;
    
    @GetMapping("/ingredientes")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<List<Inventario>> listarIngredientes() {
        List<Inventario> ingredientes = inventarioService.listarIngredientes();
        return ResponseEntity.ok(ingredientes);
    }
    
    @GetMapping("/ingredientes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<Inventario> obtenerIngrediente(@PathVariable Integer id) {
        Inventario ingrediente = inventarioService.obtenerIngredientePorId(id);
        return ResponseEntity.ok(ingrediente);
    }
    
    @GetMapping("/ingredientes/bajoStock")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<List<Inventario>> buscarIngredientesBajoStock(
            @RequestParam(defaultValue = "10.0") Double cantidadMinima) {
        List<Inventario> ingredientes = inventarioService.buscarIngredientesBajoCantidad(cantidadMinima);
        return ResponseEntity.ok(ingredientes);
    }
    
    @PostMapping("/ingredientes")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> agregarIngrediente(@Valid @RequestBody InventarioDTO dto) {
        inventarioService.agregarIngrediente(dto);
        return ResponseEntity.ok("Ingrediente agregado con éxito");
    }
    
    @PutMapping("/ingredientes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> actualizarIngrediente(
            @PathVariable Integer id, 
            @Valid @RequestBody InventarioDTO dto) {
        inventarioService.actualizarIngrediente(id, dto);
        return ResponseEntity.ok("Ingrediente actualizado con éxito");
    }
    
    @DeleteMapping("/ingredientes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarIngrediente(@PathVariable Integer id) {
        inventarioService.eliminarIngrediente(id);
        return ResponseEntity.ok("Ingrediente eliminado con éxito");
    }
    
    @PostMapping("/ingredientes/incrementar")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> incrementarCantidad(@Valid @RequestBody ActualizarInventarioDTO dto) {
        inventarioService.incrementarCantidad(dto);
        return ResponseEntity.ok("Cantidad incrementada con éxito");
    }
    
    @PostMapping("/ingredientes/decrementar")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> decrementarCantidad(@Valid @RequestBody ActualizarInventarioDTO dto) {
        inventarioService.decrementarCantidad(dto);
        return ResponseEntity.ok("Cantidad decrementada con éxito");
    }
    
    @PostMapping("/detalles")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> agregarDetalleInventario(@Valid @RequestBody DetalleInventarioDTO dto) {
        inventarioService.agregarDetalleInventario(dto);
        return ResponseEntity.ok("Detalle de inventario agregado con éxito");
    }
    
    @GetMapping("/detalles/producto/{idProducto}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<List<DetalleInventario>> obtenerDetallesPorProducto(@PathVariable Integer idProducto) {
        List<DetalleInventario> detalles = inventarioService.obtenerDetallesPorProducto(idProducto);
        return ResponseEntity.ok(detalles);
    }
    
    @PutMapping("/detalles/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO')")
    public ResponseEntity<String> actualizarDetalleInventario(
            @PathVariable Integer id, 
            @Valid @RequestBody DetalleInventarioDTO dto) {
        inventarioService.actualizarDetalleInventario(id, dto);
        return ResponseEntity.ok("Detalle de inventario actualizado con éxito");
    }
    
    @DeleteMapping("/detalles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarDetalleInventario(@PathVariable Integer id) {
        inventarioService.eliminarDetalleInventario(id);
        return ResponseEntity.ok("Detalle de inventario eliminado con éxito");
    }
    
    @GetMapping("/verificar/{idProducto}")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPOSTERO', 'VENDEDOR')")
    public ResponseEntity<Map<String, Boolean>> verificarDisponibilidad(
            @PathVariable Integer idProducto,
            @RequestParam Integer cantidad) {
        boolean disponible = inventarioService.verificarDisponibilidadIngredientes(idProducto, cantidad);
        return ResponseEntity.ok(Map.of("disponible", disponible));
    }
}