package com.bakeryshop.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Rol {
    @Id
    @Column(name = "id") 
    private Integer id;

    @OneToMany(mappedBy = "rol")
    @JsonIgnoreProperties("rol") 
    private List<Usuario> usuarios;


    @Column(unique = true, nullable = false)
    private String nombre;
}
