package com.bakeryshop.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detalleinventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleInventario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "id_ingrediente", referencedColumnName = "id_ingrediente")
    private Inventario ingrediente;
    
    @ManyToOne
    @JoinColumn(name = "id_producto", referencedColumnName = "id_producto")
    private Producto producto;
    
    private Double cantidad;
}