package com.bakeryshop.service;

import com.bakeryshop.dto.LoginDTO;
import com.bakeryshop.dto.UsuarioDTO;
import com.bakeryshop.model.Rol;
import com.bakeryshop.model.Usuario;
import com.bakeryshop.repository.UsuarioRepository;
import com.bakeryshop.security.JwtUtil;
import org.springframework.transaction.annotation.Transactional;


import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolService rolService;

    @Autowired
    private JwtUtil jwtUtil;

    public void registrarUsuario(UsuarioDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        Rol rol = rolService.buscarPorId(dto.getRolId());

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        usuario.setPassword(encoder.encode(dto.getPassword()));
        usuario.setRol(rol);

        usuarioRepository.save(usuario);
    }

    public String login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        return jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().getNombre());
    }

    public Usuario obtenerPorEmail(String email) {
    return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
        }

    @Transactional
    public void desactivarUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado");
        }
        usuarioRepository.desactivarUsuario(id);
    }

    public List<Usuario> listarUsuariosActivos() {
        return usuarioRepository.findUsuariosActivos();
    }
    

}
