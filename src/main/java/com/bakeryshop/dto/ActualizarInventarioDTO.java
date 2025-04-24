package com.bakeryshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActualizarInventarioDTO {
    
    @NotNull(message = "El ID del ingrediente es obligatorio")
    private Integer idIngrediente;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Double cantidad;
}