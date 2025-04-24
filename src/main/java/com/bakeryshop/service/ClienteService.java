package com.bakeryshop.service;

import com.bakeryshop.dto.ClienteDTO;
import com.bakeryshop.dto.LoginDTO;
import com.bakeryshop.model.Cliente;
import com.bakeryshop.repository.ClienteRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class ClienteService {
    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Implementación JPA para registro de clientes
    public int registrarCliente(ClienteDTO dto) {
        if (clienteRepository.contarPorEmail(dto.getEmail()) > 0) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        // Crear nueva entidad Cliente
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setPassword(passwordEncoder.encode(dto.getPassword()));
        cliente.setCalle(dto.getCalle());
        cliente.setCiudad(dto.getCiudad());
        cliente.setCodigoPostal(dto.getCodigoPostal());
        cliente.setFechaRegistro(LocalDateTime.now());
        
        logger.debug("Cliente preparado para guardar: {}", cliente.getEmail());
    
    try {
        // Guardar cliente en la base de datos
        Cliente clienteGuardado = clienteRepository.save(cliente);
        logger.info("Cliente guardado correctamente con ID: {}", clienteGuardado.getId());
        return clienteGuardado.getId();
    } catch (Exception e) {
        logger.error("Error al guardar cliente: {}", e.getMessage(), e);
        throw new RuntimeException("Error al registrar cliente", e);
    }
    }

    public Cliente validarCredenciales(LoginDTO dto) {
        Cliente cliente = clienteRepository.findByEmail(dto.getEmail()).orElse(null);

        if (cliente != null && passwordEncoder.matches(dto.getPassword(), cliente.getPassword())) {
            return cliente;
        }
        
        return null;
    }

    // Obtener cliente por email
    public Cliente obtenerPorEmail(String email) {
        return clienteRepository.findByEmail(email).orElse(null);
    }    

    // Obtener cliente por ID
    public Cliente obtenerPorId(int id) {
        Optional<Cliente> optionalCliente = clienteRepository.findById(id);
        return optionalCliente.orElse(null);
    }

    public void actualizarCliente(Cliente clienteActualizado) {
        // Buscar el cliente existente
        Cliente clienteExistente = clienteRepository.findById(clienteActualizado.getId())
            .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
        
        // Actualizamos los campos editables
        clienteExistente.setNombre(clienteActualizado.getNombre());
        clienteExistente.setTelefono(clienteActualizado.getTelefono());
        clienteExistente.setCalle(clienteActualizado.getCalle());
        clienteExistente.setCiudad(clienteActualizado.getCiudad());
        clienteExistente.setCodigoPostal(clienteActualizado.getCodigoPostal());
        
        // El email es sensible, validamos que no exista ya si está cambiando
        if (!clienteExistente.getEmail().equals(clienteActualizado.getEmail())) {
            if (clienteRepository.contarPorEmail(clienteActualizado.getEmail()) > 0) {
                throw new IllegalArgumentException("El nuevo email ya está registrado por otro usuario");
            }
            clienteExistente.setEmail(clienteActualizado.getEmail());
        }
        
        // Si hay una nueva contraseña, la encriptamos
        if (clienteActualizado.getPassword() != null && !clienteActualizado.getPassword().isEmpty()) {
            clienteExistente.setPassword(passwordEncoder.encode(clienteActualizado.getPassword()));
        }
        
        // Guardamos el cliente actualizado usando el método save() de JPA
        logger.info("Actualizando cliente con ID: {}", clienteExistente.getId());
        clienteRepository.save(clienteExistente);
        logger.info("Cliente actualizado correctamente");
    }

    // Listar todos
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    //Desactivar cliente
    @Transactional
    public void desactivarCliente(Integer id) {
        clienteRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
    clienteRepository.desactivarCliente(id);

    }
}