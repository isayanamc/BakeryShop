package com.bakeryshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PedidoDTO {

    @NotNull(message = "El ID del cliente es obligatorio")
    private Integer idCliente;

    @NotNull(message = "El ID del método de pago es obligatorio")
    private Integer idMetodoPago;

    @NotNull(message = "La fecha de entrega es obligatoria")
    @FutureOrPresent(message = "La fecha de entrega debe ser igual o posterior a hoy")
    private LocalDate fechaEntrega;

    @NotEmpty(message = "Debe incluir al menos un producto en el pedido")
    @Valid
    private List<DetallePedidoDTO> detalles;
}