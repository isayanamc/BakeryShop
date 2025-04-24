package com.bakeryshop.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    // Configuración principal de Swagger
    @Bean
    public OpenAPI bakeryShopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                    .title("API - Bakery Shop")
                    .description("Sistema de pedidos para panadería artesanal")
                    .version("1.0"));
    }
}
