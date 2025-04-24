package com.bakeryshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PedidoException extends RuntimeException {
    
    public PedidoException(String message) {
        super(message);
    }
    
    public PedidoException(String message, Throwable cause) {
        super(message, cause);
    }
}