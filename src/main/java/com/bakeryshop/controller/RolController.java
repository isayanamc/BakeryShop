package com.bakeryshop.controller;

import com.bakeryshop.model.Rol;
import com.bakeryshop.service.RolService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = "http://localhost:3000")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<Rol> obtenerTodos() {
        return rolService.obtenerTodos();
    }

    
}