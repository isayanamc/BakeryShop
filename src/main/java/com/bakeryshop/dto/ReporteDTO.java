package com.bakeryshop.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ReporteDTO {
    
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String categoria;
    private Integer limite;
}