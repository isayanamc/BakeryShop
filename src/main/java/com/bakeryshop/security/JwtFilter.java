package com.bakeryshop.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("Auth Header: " + authHeader);
        String path = request.getRequestURI();

        // Rutas públicas que no deben pasar por validación JWT
        if (path.equals("/metodos-pago") ||
            path.startsWith("/roles") ||
            path.startsWith("/productos") ||
            path.equals("/clientes/login") ||
            path.equals("/clientes/registrar") ||
            path.startsWith("/clientes") ||
            path.startsWith("/checkout") ||
            path.startsWith("/usuarios") ||
            path.startsWith("/auth") ||
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui") ||
            (path.startsWith("/pedidos") && !path.equals("/pedidos/confirmar"))) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                email = jwtUtil.getEmailFromToken(token);
            }
        }

        // Si hay email válido y no hay autenticación activa, autenticamos
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Obtener rol desde el token
            String rol = jwtUtil.getRolFromToken(token);

            if (rol == null) {
                filterChain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(rol),
                                    new SimpleGrantedAuthority("ROLE_" + rol)
                            )
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continuar con el filtro
        filterChain.doFilter(request, response);
    }
}
