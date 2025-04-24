package com.bakeryshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DetalleInventarioDTO {
    
    private Integer id;
    
    @NotNull(message = "El ID del ingrediente es obligatorio")
    private Integer idIngrediente;
    
    @NotNull(message = "El ID del producto es obligatorio")
    private Integer idProducto;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Double cantidad;
}
