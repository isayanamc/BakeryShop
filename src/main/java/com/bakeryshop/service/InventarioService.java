package com.bakeryshop.service;

import com.bakeryshop.dto.ActualizarInventarioDTO;
import com.bakeryshop.dto.DetalleInventarioDTO;
import com.bakeryshop.dto.InventarioDTO;
import com.bakeryshop.model.DetalleInventario;
import com.bakeryshop.model.Inventario;
import com.bakeryshop.model.Producto;
import com.bakeryshop.repository.DetalleInventarioRepository;
import com.bakeryshop.repository.InventarioRepository;
import com.bakeryshop.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventarioService {
    
    @Autowired
    private InventarioRepository inventarioRepository;
    
    @Autowired
    private DetalleInventarioRepository detalleInventarioRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Inventario> listarIngredientes() {
        return inventarioRepository.listarIngredientes();
    }
    
    public Inventario obtenerIngredientePorId(Integer id) {
        return inventarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ingrediente no encontrado con ID: " + id));
    }
    
    public List<Inventario> buscarIngredientesBajoCantidad(Double cantidadMinima) {
        return inventarioRepository.buscarIngredientesBajoCantidad(cantidadMinima);
    }
    
    @Transactional
    public void agregarIngrediente(InventarioDTO dto) {
        Inventario inventario = new Inventario();
        inventario.setNombre(dto.getNombre());
        inventario.setCantidad(dto.getCantidad());
        inventario.setUnidad(dto.getUnidad());
        inventario.setFechaActualizacion(LocalDateTime.now());
        
        inventarioRepository.save(inventario);
    }
    
    @Transactional
    public void actualizarIngrediente(Integer id, InventarioDTO dto) {
        Inventario inventario = obtenerIngredientePorId(id);
        
        inventario.setNombre(dto.getNombre());
        inventario.setCantidad(dto.getCantidad());
        inventario.setUnidad(dto.getUnidad());
        inventario.setFechaActualizacion(LocalDateTime.now());
        
        inventarioRepository.save(inventario);
    }
    
    @Transactional
    public void eliminarIngrediente(Integer id) {
        if (!inventarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Ingrediente no encontrado con ID: " + id);
        }
        
        List<DetalleInventario> detalles = detalleInventarioRepository.buscarPorIngredienteId(id);
        if (!detalles.isEmpty()) {
            throw new IllegalArgumentException("No se puede eliminar el ingrediente porque está siendo utilizado en productos");
        }
        
        inventarioRepository.deleteById(id);
    }
    
    @Transactional
    public void incrementarCantidad(ActualizarInventarioDTO dto) {
        Inventario ingrediente = obtenerIngredientePorId(dto.getIdIngrediente());
        ingrediente.setCantidad(ingrediente.getCantidad() + dto.getCantidad());
        ingrediente.setFechaActualizacion(LocalDateTime.now());
        
        inventarioRepository.save(ingrediente);
    }
    
    @Transactional
    public void decrementarCantidad(ActualizarInventarioDTO dto) {
        Inventario ingrediente = obtenerIngredientePorId(dto.getIdIngrediente());
        
        if (ingrediente.getCantidad() < dto.getCantidad()) {
            throw new IllegalArgumentException("Cantidad insuficiente en inventario");
        }
        
        ingrediente.setCantidad(ingrediente.getCantidad() - dto.getCantidad());
        ingrediente.setFechaActualizacion(LocalDateTime.now());
        
        inventarioRepository.save(ingrediente);
    }
    
    @Transactional
    public void agregarDetalleInventario(DetalleInventarioDTO dto) {
        Inventario ingrediente = obtenerIngredientePorId(dto.getIdIngrediente());
        
        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + dto.getIdProducto()));
        
        DetalleInventario detalle = new DetalleInventario();
        detalle.setIngrediente(ingrediente);
        detalle.setProducto(producto);
        detalle.setCantidad(dto.getCantidad());
        
        detalleInventarioRepository.save(detalle);
    }
    
    public List<DetalleInventario> obtenerDetallesPorProducto(Integer idProducto) {
        if (!productoRepository.existsById(idProducto)) {
            throw new EntityNotFoundException("Producto no encontrado con ID: " + idProducto);
        }
        
        return detalleInventarioRepository.buscarPorProductoId(idProducto);
    }
    
    @Transactional
    public void actualizarDetalleInventario(Integer id, DetalleInventarioDTO dto) {
        DetalleInventario detalle = detalleInventarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Detalle de inventario no encontrado con ID: " + id));
        
        Inventario ingrediente = obtenerIngredientePorId(dto.getIdIngrediente());
        
        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + dto.getIdProducto()));
        
        detalle.setIngrediente(ingrediente);
        detalle.setProducto(producto);
        detalle.setCantidad(dto.getCantidad());
        
        detalleInventarioRepository.save(detalle);
    }
    
    @Transactional
    public void eliminarDetalleInventario(Integer id) {
        if (!detalleInventarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Detalle de inventario no encontrado con ID: " + id);
        }
        
        detalleInventarioRepository.deleteById(id);
    }
    
    public boolean verificarDisponibilidadIngredientes(Integer idProducto, Integer cantidad) {
        List<DetalleInventario> detalles = detalleInventarioRepository.buscarPorProductoId(idProducto);
        
        for (DetalleInventario detalle : detalles) {
            double cantidadNecesaria = detalle.getCantidad() * cantidad;
            if (detalle.getIngrediente().getCantidad() < cantidadNecesaria) {
                return false;
            }
        }
        
        return true;
    }
    
    @Transactional
    public void reducirInventarioPorProducto(Integer idProducto, Integer cantidad) {
        List<DetalleInventario> detalles = detalleInventarioRepository.buscarPorProductoId(idProducto);
        
        for (DetalleInventario detalle : detalles) {
            double cantidadReducir = detalle.getCantidad() * cantidad;
            Inventario ingrediente = detalle.getIngrediente();
            
            if (ingrediente.getCantidad() < cantidadReducir) {
                throw new IllegalArgumentException("Cantidad insuficiente del ingrediente: " + ingrediente.getNombre());
            }
            
            ingrediente.setCantidad(ingrediente.getCantidad() - cantidadReducir);
            ingrediente.setFechaActualizacion(LocalDateTime.now());
            inventarioRepository.save(ingrediente);
        }
    }
}