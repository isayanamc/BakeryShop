package com.bakeryshop.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPedidoConverter implements AttributeConverter<EstadoPedido, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPedido estado) {
        return estado != null ? estado.name() : null;
    }

    @Override
    public EstadoPedido convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return EstadoPedido.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Estado inválido encontrado en la base de datos: " + dbData);
        }
    }
}
