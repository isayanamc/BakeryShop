-- Creación de la base de datos
CREATE DATABASE bakeryshop;
USE bakeryshop;

-- Tabla de Clientes
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    calle VARCHAR(255),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Métodos de Pago
CREATE TABLE Metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metodo VARCHAR(50) NOT NULL
);

-- Tabla de Pedidos
CREATE TABLE Pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    estado ENUM('Pendiente', 'En preparación', 'Entregado') DEFAULT 'Pendiente',
    total DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id)
);

-- Tabla de Productos
CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(50),
    imagen_url VARCHAR(255),
    tiempo_preparacion INT COMMENT 'Tiempo en minutos'
);

-- Tabla de Detalle de Pedidos (relación muchos a muchos entre pedidos y productos)
CREATE TABLE Detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Tabla de Inventario
CREATE TABLE Inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,

    cantidad INT NOT NULL,
    
    unidad VARCHAR(20),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Usuarios (Administradores y reposteros)
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Repostero') NOT NULL
);

CREATE TABLE Pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    estado ENUM('Pendiente', 'En preparación', 'Entregado') DEFAULT 'Pendiente',
    total DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodos_pago(id)
);

CREATE TABLE Detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);
