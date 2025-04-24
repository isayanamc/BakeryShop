package com.bakeryshop.controller;

import com.bakeryshop.dto.ProductoDTO;
import com.bakeryshop.model.Producto;
import com.bakeryshop.service.ProductoService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:3000") // React
public class ProductoController {

    @Autowired
    private ProductoService productoService;
    
    @GetMapping("/listar")
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoService.listarProductos();
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Integer id) {
        Producto producto = productoService.obtenerProductoPorId(id);
        return ResponseEntity.ok(producto);
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> buscarPorCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.buscarProductosPorCategoria(categoria);
        return ResponseEntity.ok(productos);
    }
    
    @PostMapping("/agregar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REPOSTERO')")
    public ResponseEntity<String> agregarProducto(@Valid @RequestBody ProductoDTO productoDTO) {
        productoService.agregarProducto(productoDTO);
        return ResponseEntity.ok("Producto agregado con éxito");
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REPOSTERO')")
    public ResponseEntity<String> actualizarProducto(
            @PathVariable Integer id, 
            @Valid @RequestBody ProductoDTO productoDTO) {
        productoService.actualizarProducto(id, productoDTO);
        return ResponseEntity.ok("Producto actualizado con éxito");
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarProducto(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok("Producto eliminado con éxito");
    }
    
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REPOSTERO')")
    public ResponseEntity<String> actualizarStock(
            @PathVariable Integer id, 
            @RequestParam Integer nuevoStock) {
        productoService.actualizarStock(id, nuevoStock);
        return ResponseEntity.ok("Stock actualizado con éxito");
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<Producto>> obtenerProductosDestacados() {
        List<Producto> productosDestacados = productoService.obtenerProductosDestacados();
        return ResponseEntity.ok(productosDestacados);
    }

}