package com.bakeryshop.controller;

import com.bakeryshop.dto.ReporteDTO;
import com.bakeryshop.model.Reporte;
import com.bakeryshop.service.ReporteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class ReporteController {
    
    @Autowired
    private ReporteService reporteService;
    
    @GetMapping("/ventas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Reporte>> generarReporteVentas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        ReporteDTO filtros = new ReporteDTO();
        filtros.setFechaInicio(fechaInicio);
        filtros.setFechaFin(fechaFin);
        
        List<Reporte> reporte = reporteService.generarReporteVentasPorFecha(filtros);
        return ResponseEntity.ok(reporte);
    }
    
    @GetMapping("/ventas/dia")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    public ResponseEntity<Map<String, Object>> obtenerVentasDia(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        LocalDate fechaConsulta = fecha != null ? fecha : LocalDate.now();
        Double total = reporteService.obtenerTotalVentasDia(fechaConsulta);
        
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("fecha", fechaConsulta);
        respuesta.put("totalVentas", total != null ? total : 0.0);
        
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/productos/mas-vendidos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'REPOSTERO')")
    public ResponseEntity<List<Reporte>> generarReporteProductosMasVendidos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Integer limite) {
        
        ReporteDTO filtros = new ReporteDTO();
        filtros.setFechaInicio(fechaInicio);
        filtros.setFechaFin(fechaFin);
        filtros.setCategoria(categoria);
        filtros.setLimite(limite);
        
        List<Reporte> reporte = reporteService.generarReporteProductosMasVendidos(filtros);
        return ResponseEntity.ok(reporte);
    }
    
    @GetMapping("/productos/mas-vendidos/stored")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'REPOSTERO')")
    public ResponseEntity<List<Reporte>> obtenerProductosMasVendidosStored() {
        List<Reporte> reporte = reporteService.obtenerProductosMasVendidos();
        return ResponseEntity.ok(reporte);
    }
    
    @GetMapping("/clientes/frecuentes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Reporte>> generarReporteClientesFrecuentes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false) Integer limite) {
        
        ReporteDTO filtros = new ReporteDTO();
        filtros.setFechaInicio(fechaInicio);
        filtros.setFechaFin(fechaFin);
        filtros.setLimite(limite);
        
        List<Reporte> reporte = reporteService.generarReporteClientesFrecuentes(filtros);
        return ResponseEntity.ok(reporte);
    }
    
    @PostMapping("/personalizado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> generarReportePersonalizado(@RequestBody ReporteDTO filtros) {
        // Obtener todos los reportes para la misma consulta
        List<Reporte> ventas = reporteService.generarReporteVentasPorFecha(filtros);
        List<Reporte> productos = reporteService.generarReporteProductosMasVendidos(filtros);
        List<Reporte> clientes = reporteService.generarReporteClientesFrecuentes(filtros);
        
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("ventas", ventas);
        reporte.put("productosMasVendidos", productos);
        reporte.put("clientesFrecuentes", clientes);
        
        // Calcular el total de ventas en el período
        double totalPeriodo = ventas.stream()
                .mapToDouble(Reporte::getTotalVentas)
                .sum();
        reporte.put("totalVentasPeriodo", totalPeriodo);
        
        return ResponseEntity.ok(reporte);
    }
}