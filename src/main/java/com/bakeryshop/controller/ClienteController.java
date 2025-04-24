package com.bakeryshop.controller;

import com.bakeryshop.dto.ClienteDTO;
import com.bakeryshop.dto.LoginDTO;
import com.bakeryshop.model.Cliente;
import com.bakeryshop.security.JwtUtil;
import com.bakeryshop.service.ClienteService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "http://localhost:3000") // React
public class ClienteController {

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private JwtUtil jwtUtil;

    // Registrar cliente
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            logger.info("Recibida solicitud para registrar cliente: {}", clienteDTO.getEmail());
            int id = clienteService.registrarCliente(clienteDTO);
            logger.info("Cliente registrado exitosamente con ID: {}", id);
            return ResponseEntity.ok("Cliente registrado exitosamente");
        } catch (IllegalArgumentException e) {
            logger.error("Error al registrar cliente: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error inesperado al registrar cliente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    // Login cliente
    @PostMapping("/login")
    public ResponseEntity<?> loginCliente(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            logger.info("Intento de inicio de sesión para cliente: {}", loginDTO.getEmail());
    
            Cliente cliente = clienteService.validarCredenciales(loginDTO);
    
            if (cliente != null) {
                logger.info("Inicio de sesión exitoso para cliente: {}", cliente.getEmail());
    
                cliente.setPassword(null);
    
                String token = jwtUtil.generateToken(cliente.getEmail(), "CLIENTE");
                logger.info("🪙 Token generado para cliente: {}", token);
    
                Map<String, Object> response = new HashMap<>();
                response.put("usuario", cliente);
                response.put("token", token);
    
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Credenciales inválidas");
            }
    
        } catch (Exception e) {
            logger.error("Error en inicio de sesión de cliente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la solicitud de inicio de sesión");
        }
    }
    
    // Listar todos los clientes
    @GetMapping("/listar")
    public ResponseEntity<List<Cliente>> listarClientes() {
        try {
            logger.info("Solicitud para listar todos los clientes");
            List<Cliente> clientes = clienteService.listarClientes();
            
            // No enviar contraseñas en la respuesta
            clientes.forEach(c -> c.setPassword(null));
            
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            logger.error("Error al listar clientes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener un cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable int id) {
        try {
            logger.info("Solicitud para obtener cliente con ID: {}", id);
            Cliente cliente = clienteService.obtenerPorId(id);
            
            if (cliente != null) {
                // No enviar contraseña en la respuesta
                cliente.setPassword(null);
                return ResponseEntity.ok(cliente);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al obtener cliente con ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener cliente: " + e.getMessage());
        }
    }

    // Actualizar perfil del cliente
    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizar(@RequestBody Cliente cliente) {
        try {
            logger.info("Solicitud para actualizar cliente con ID: {}", cliente.getId());
            
            // Implementamos seguridad: no permitimos actualizar la contraseña por esta vía
            // Esto debe hacerse en un endpoint separado con validaciones más fuertes
            cliente.setPassword(null);
            
            clienteService.actualizarCliente(cliente);
            return ResponseEntity.ok("Perfil actualizado correctamente");
        } catch (IllegalArgumentException e) {
            logger.error("Error al actualizar cliente: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error al actualizar cliente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar perfil: " + e.getMessage());
        }
    }


    // Validación de errores de formulario
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return errors;
    }

    // Eliminar (desactivar) cliente
    @PatchMapping("/desactivar/{id}")
    public ResponseEntity<String> desactivarCliente(@PathVariable Integer id) {
        try {
            clienteService.desactivarCliente(id);
            return ResponseEntity.ok("Cliente desactivado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al desactivar cliente: " + e.getMessage());
        }
    }


    @GetMapping("/verificar-token")
public ResponseEntity<String> verificarToken(@RequestHeader("Authorization") String authHeader) {
    try {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);
        return ResponseEntity.ok("Token válido. Email: " + email);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
    }
}



}