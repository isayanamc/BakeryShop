package com.bakeryshop.repository;
import java.util.Optional;
import java.util.List;

import com.bakeryshop.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmail(String email);


    @Modifying
    @Query("UPDATE Usuario u SET u.activo = false WHERE u.id = :id")
    void desactivarUsuario(@Param("id") Integer id);

    @Query("SELECT u FROM Usuario u WHERE u.activo = true")
    List<Usuario> findUsuariosActivos();

}
