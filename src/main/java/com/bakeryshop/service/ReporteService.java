package com.bakeryshop.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bakeryshop.dto.ReporteDTO;
import com.bakeryshop.model.Reporte;
import com.bakeryshop.repository.ReporteRepository;

@Service
public class ReporteService {
    
    @Autowired
    private ReporteRepository reporteRepository;
    
    /**
     * Genera un reporte de ventas por fecha dentro de un rango
     */
    public List<Reporte> generarReporteVentasPorFecha(ReporteDTO filtros) {
        // Valores por defecto si no se especifican
        LocalDate fechaInicio = filtros.getFechaInicio() != null ? 
                filtros.getFechaInicio() : 
                LocalDate.now().minusDays(30);
                
        LocalDate fechaFin = filtros.getFechaFin() != null ? 
                filtros.getFechaFin() : 
                LocalDate.now();
        
        List<Object[]> resultados = reporteRepository.obtenerVentasPorFecha(fechaInicio, fechaFin);
        
        List<Reporte> reportes = new ArrayList<>();
        for (Object[] resultado : resultados) {
            LocalDate fecha = ((java.sql.Date) resultado[0]).toLocalDate();
            Double totalVentas = (Double) resultado[1];
            
            reportes.add(new Reporte(fecha, totalVentas));
        }
        
        return reportes;
    }
    
    /**
     * Genera un reporte de los productos más vendidos
     */
    public List<Reporte> generarReporteProductosMasVendidos(ReporteDTO filtros) {
        // Valores por defecto si no se especifican
        LocalDate fechaInicio = filtros.getFechaInicio() != null ? 
                filtros.getFechaInicio() : 
                LocalDate.now().minusDays(30);
                
        LocalDate fechaFin = filtros.getFechaFin() != null ? 
                filtros.getFechaFin() : 
                LocalDate.now();
                
        Integer limite = filtros.getLimite() != null ? 
                filtros.getLimite() : 
                10;
        
        List<Object[]> resultados;
        
        // Si se especifica una categoría, se filtran los productos por ella
        if (filtros.getCategoria() != null && !filtros.getCategoria().isEmpty()) {
            resultados = reporteRepository.obtenerProductosMasVendidosPorCategoria(
                    fechaInicio, fechaFin, filtros.getCategoria(), limite);
        } else {
            resultados = reporteRepository.obtenerProductosMasVendidos(
                    fechaInicio, fechaFin, limite);
        }
        
        List<Reporte> reportes = new ArrayList<>();
        for (Object[] resultado : resultados) {
            Integer idProducto = ((Number) resultado[0]).intValue();
            String nombreProducto = (String) resultado[1];
            Integer cantidadVendida = ((Number) resultado[2]).intValue();
            Double totalGenerado = (Double) resultado[3];
            
            reportes.add(new Reporte(idProducto, nombreProducto, cantidadVendida, totalGenerado));
        }
        
        return reportes;
    }
    
    /**
     * Genera un reporte de los clientes que más compras han realizado
     */
    public List<Reporte> generarReporteClientesFrecuentes(ReporteDTO filtros) {
        // Valores por defecto si no se especifican
        LocalDate fechaInicio = filtros.getFechaInicio() != null ? 
                filtros.getFechaInicio() : 
                LocalDate.now().minusDays(30);
                
        LocalDate fechaFin = filtros.getFechaFin() != null ? 
                filtros.getFechaFin() : 
                LocalDate.now();
                
        Integer limite = filtros.getLimite() != null ? 
                filtros.getLimite() : 
                10;
        
        List<Object[]> resultados = reporteRepository.obtenerClientesFrecuentes(
                fechaInicio, fechaFin, limite);
        
        List<Reporte> reportes = new ArrayList<>();
        for (Object[] resultado : resultados) {
            Integer idCliente = ((Number) resultado[0]).intValue();
            String nombreCliente = (String) resultado[1];
            Integer cantidadPedidos = ((Number) resultado[2]).intValue();
            Double totalGastado = (Double) resultado[3];
            
            reportes.add(Reporte.createClienteReporte(idCliente, nombreCliente, cantidadPedidos, totalGastado));
        }
        
        return reportes;
    }
    
    /**
     * Obtiene el total de ventas para un día específico
     */
    public Double obtenerTotalVentasDia(LocalDate fecha) {
        // Intenta usar el stored procedure primero
        try {
            Double total = reporteRepository.ventasPorFecha(fecha);
            if (total != null) {
                return total;
            }
        } catch (Exception e) {
            // Si falla el stored procedure, usa la consulta SQL directa
        }
        
        return reporteRepository.obtenerTotalVentasDia(fecha);
    }
    
    /**
     * Obtiene los 10 productos más vendidos (usando el stored procedure)
     */
    public List<Reporte> obtenerProductosMasVendidos() {
        try {
            List<Object[]> resultados = reporteRepository.productosMasVendidos();
            
            List<Reporte> reportes = new ArrayList<>();
            for (Object[] resultado : resultados) {
                String nombreProducto = (String) resultado[0];
                Integer cantidadVendida = ((Number) resultado[1]).intValue();
                
                reportes.add(new Reporte(null, nombreProducto, cantidadVendida, null));
            }
            
            return reportes;
        } catch (Exception e) {
            // Si falla el stored procedure, retorna una lista vacía
            return new ArrayList<>();
        }
    }
}