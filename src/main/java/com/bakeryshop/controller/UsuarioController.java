package com.bakeryshop.controller;

import com.bakeryshop.dto.LoginDTO;
import com.bakeryshop.dto.UsuarioDTO;
import com.bakeryshop.model.Usuario;
import com.bakeryshop.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // POST: Registrar usuario
    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@Valid @RequestBody UsuarioDTO dto) {
        usuarioService.registrarUsuario(dto);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }

    //POST: Login de usuario (retorna token)
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO dto) {
        String token = usuarioService.login(dto); 
        Usuario usuario = usuarioService.obtenerPorEmail(dto.getEmail());

        // Evitar enviar la contraseña
        usuario.setPassword(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", usuario);

        return ResponseEntity.ok(response);
    }


    //Obtener usuario por email (incluye rol)
    @GetMapping("/por-email")
    public ResponseEntity<?> obtenerUsuarioPorEmail(@RequestParam String email) {
        try {
            Usuario usuario = usuarioService.obtenerPorEmail(email);

            if (usuario != null) {
                return ResponseEntity.ok(usuario); // Incluye su objeto Rol
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado con el email: " + email);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar el usuario: " + e.getMessage());
        }
    }

    @PatchMapping("/desactivar/{id}")
    public ResponseEntity<String> desactivarUsuario(@PathVariable Integer id) {
        usuarioService.desactivarUsuario(id);
        return ResponseEntity.ok("Usuario desactivado correctamente");
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(usuarioService.listarUsuariosActivos());
    }

}
