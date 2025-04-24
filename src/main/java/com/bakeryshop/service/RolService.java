package com.bakeryshop.service;

import java.util.List;
import com.bakeryshop.model.Rol;
import com.bakeryshop.repository.RolRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public Rol buscarPorId(Integer id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));
    }

    public List<Rol> obtenerTodos() {
        return rolRepository.findAll();
    }
    
}
