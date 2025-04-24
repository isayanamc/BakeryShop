package com.bakeryshop.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component  // Marca esta clase como un componente para que Spring la detecte
public class JwtUtil {

    // Clave secreta usada para firmar el token (puede estar en application.properties idealmente)
    private final String SECRET_KEY = "mi_clave_supersecreta";

    // Método para generar un token JWT
    public String generateToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)                    // El usuario que está autenticado
                .claim("authorities", "ROLE_" + rol.toUpperCase())                
                .setIssuedAt(new Date())              // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Expira en 1 día
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Algoritmo y clave
                .compact();                           
    }

    // Método para extraer el email del token
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Recupera el "subject", que es el email
    }

    // Método para extraer el rol del token
    public String getRolFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
    
            String rol = claims.get("rol", String.class);
            System.out.println("🧩 ROL EXTRAÍDO DEL TOKEN: " + rol);
    
            return rol;
        } catch (Exception e) {
            System.out.println("❌ Error extrayendo rol: " + e.getMessage());
            return null;
        }
    }
    

    // Método para validar si un token es correcto (no está alterado ni expirado)
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Si algo falla, el token no es válido
            return false;
        }
    }
}
