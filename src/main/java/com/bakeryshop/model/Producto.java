package com.bakeryshop.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_producto")
    @Column(name = "id_producto")
    private Integer id;

    private String nombre;
    
    private String descripcion;
    
    private Double precio;
    
    private Integer stock;
    
    private String categoria;
    
    @JsonProperty("imagen_url")
    @Column(name = "imagen_url")
    private String imagenUrl;
        
    @Column(name = "tiempo_preparacion")
    private Integer tiempoPreparacion;
}