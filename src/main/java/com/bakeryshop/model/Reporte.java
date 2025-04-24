package com.bakeryshop.model;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Reporte {
    
    private LocalDate fecha;
    private Double totalVentas;
    
    private Integer idProducto;
    private String nombreProducto;
    private Integer cantidadVendida;
    private Double totalGenerado;
    
    private Integer idCliente;
    private String nombreCliente;
    private Integer cantidadPedidos;
    private Double totalGastado;
    
    // Reporte ventas
    public Reporte(LocalDate fecha, Double totalVentas) {
        this.fecha = fecha;
        this.totalVentas = totalVentas;
    }
    
    // Reporte productos
    public Reporte(Integer idProducto, String nombreProducto, Integer cantidadVendida, Double totalGenerado) {
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.cantidadVendida = cantidadVendida;
        this.totalGenerado = totalGenerado;
    }
    
    //reporte clientes
    public static Reporte createClienteReporte(Integer idCliente, String nombreCliente, Integer cantidadPedidos, Double totalGastado) {
        Reporte reporte = new Reporte();
        reporte.idCliente = idCliente;
        reporte.nombreCliente = nombreCliente;
        reporte.cantidadPedidos = cantidadPedidos;
        reporte.totalGastado = totalGastado;
        return reporte;
    }
}