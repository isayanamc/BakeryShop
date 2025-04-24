package com.bakeryshop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "clientes")
@NamedStoredProcedureQueries({
    @NamedStoredProcedureQuery( 
        name = "RegistrarCliente",
        procedureName = "RegistrarCliente",
        parameters = {
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_nombre", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_email", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_telefono", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_password", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_calle", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_ciudad", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_codigo_postal", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.OUT, name = "p_id_cliente", type = Integer.class)
        }
    ),
    @NamedStoredProcedureQuery( 
        name = "ActualizarCliente",
        procedureName = "ActualizarCliente",
        parameters = {
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_id_cliente", type = Integer.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_nombre", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_email", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_telefono", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_calle", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_ciudad", type = String.class),
            @StoredProcedureParameter(mode = ParameterMode.IN, name = "p_codigo_postal", type = String.class)
        }
    )
})
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer id;

    private String nombre;
    private String email;
    private String telefono;
    private String password;
    private String calle;
    private String ciudad;

    @Column(name = "activo")
    private boolean activo = true;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "cliente")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JsonIgnoreProperties("cliente")
    private java.util.List<Pedido> pedidos;

}
