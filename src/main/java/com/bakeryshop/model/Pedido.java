package com.bakeryshop.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", referencedColumnName = "id_cliente")
    @JsonIgnoreProperties("pedidos")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = true)
    @JsonIgnoreProperties("pedidos") 
    private Usuario usuario;

    private LocalDateTime fecha;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Convert(converter = EstadoPedidoConverter.class)
    private EstadoPedido estado;

    private Double total;

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago", referencedColumnName = "id_metodo_pago")
    @JsonIgnoreProperties("pedidos")
    private MetodoPago metodoPago;
}
