package com.bakeryshop.service;

import com.bakeryshop.dto.ProductoDTO;
import com.bakeryshop.model.Producto;
import com.bakeryshop.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> listarProductos() {
        return productoRepository.findAllProductos();
    }
    
    public Producto obtenerProductoPorId(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
    }
    
    public List<Producto> buscarProductosPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }
    
    public void agregarProducto(ProductoDTO productoDTO) {
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setCategoria(productoDTO.getCategoria());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setTiempoPreparacion(productoDTO.getTiempoPreparacion());
        
        productoRepository.save(producto);
    }
    
    public void actualizarProducto(Integer id, ProductoDTO productoDTO) {
        Producto producto = obtenerProductoPorId(id);
        
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setCategoria(productoDTO.getCategoria());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setTiempoPreparacion(productoDTO.getTiempoPreparacion());
        
        productoRepository.save(producto);
    }
    
    public void eliminarProducto(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
    
    public void actualizarStock(Integer id, Integer nuevoStock) {
        Producto producto = obtenerProductoPorId(id);
        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }

    public List<Producto> obtenerProductosDestacados() {
        return productoRepository.findDestacados();
    }
    
}