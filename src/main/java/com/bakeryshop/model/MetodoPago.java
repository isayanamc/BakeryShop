package com.bakeryshop.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "metodospago")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo_pago")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo", nullable = false)
    private TipoMetodoPago metodo;

    @OneToMany(mappedBy = "metodoPago")
    @JsonIgnoreProperties("metodoPago") 
    private List<Pedido> pedidos;

    public enum TipoMetodoPago {
        EFECTIVO, 
        TARJETA_DE_CREDITO, 
        TARJETA_DEBITO, 
        PAYPAL
    }
}
