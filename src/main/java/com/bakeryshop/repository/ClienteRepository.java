package com.bakeryshop.repository;

import com.bakeryshop.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;


public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    // Consulta personalizada para listar todos los clientes
    @Query(value = "SELECT * FROM clientes", nativeQuery = true)
    List<Cliente> listarClientes();

    // Consulta para contar cuántos clientes tienen un email específico
    @Query("SELECT COUNT(c) FROM Cliente c WHERE c.email = :email")
    int contarPorEmail(@Param("email") String email);

    // Método para buscar un cliente por su email
    Optional<Cliente> findByEmail(String email);

    @Modifying
    @Query("UPDATE Cliente c SET c.activo = false WHERE c.id = :id")
    void desactivarCliente(@Param("id") Integer id);

    @Query("SELECT c FROM Cliente c WHERE c.activo = true")
    List<Cliente> listarClientesActivos();


}