package com.bakeryshop.controller;

import com.bakeryshop.model.Cliente;
import com.bakeryshop.model.Usuario;
import com.bakeryshop.service.ClienteService;
import com.bakeryshop.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/tipo-usuario")
    public ResponseEntity<?> verificarTipoUsuario(@RequestParam String email) {
        try {
            // Primero intentamos encontrar un usuario del sistema
            Usuario usuario = null;
            try {
                usuario = usuarioService.obtenerPorEmail(email);
            } catch (Exception ignored) {}

            if (usuario != null) {
                Map<String, Object> res = new HashMap<>();
                res.put("tipo", "usuario");
                res.put("rol", usuario.getRol().getNombre());
                return ResponseEntity.ok(res);
            }

            // Si no es usuario, intentamos encontrar un cliente
            Cliente cliente = clienteService.obtenerPorEmail(email);
            if (cliente != null) {
                Map<String, Object> res = new HashMap<>();
                res.put("tipo", "cliente");
                return ResponseEntity.ok(res);
            }

            // No existe en ninguna tabla
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró ninguna cuenta con ese email");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al verificar el tipo de usuario: " + e.getMessage());
        }
    }
}
