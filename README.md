# 🧁 Bakery Shop

Proyecto final del curso **Programación con Patrones** en la Universidad CENFOTEC.  
Desarrollado por **Isayana Murillo**.

## 📌 Descripción

**Bakery Shop** es una aplicación web desarrollada con Spring Boot y React.js que permite gestionar de forma eficiente los pedidos, productos, usuarios y clientes de una pastelería. El sistema sigue el patrón de arquitectura MVC, conectándose con una base de datos relacional MySQL y utilizando JWT para el control de acceso por roles.

---

## ⚙️ Tecnologías utilizadas

### Backend
- Java 17
- Spring Boot 3+
- Spring Data JPA
- Spring Security + JWT
- MySQL
- Maven

### Frontend
- React.js
- Axios
- SweetAlert2
- CSS nativo

---

## 🧠 Funcionalidades

### ✅ Implementadas
- Registro e inicio de sesión con roles (`Cliente`, `Administrador`, `Repostero`, `Vendedor`)
- Visualización de productos (con imagen, descripción, precio)
- Carrito de compras y confirmación de pedidos
- Gestión de clientes y usuarios (desde el perfil administrador)
- Selección de método de pago
- Estructura modular con componentes reutilizables

### ⚠️ En proceso o por mejorar
- Historial de pedidos por cliente
- Asignación de pedidos a vendedor/repostero
- Vista de dashboard administrativo
- Pruebas unitarias e integración
- Despliegue en producción

---

## 🗂️ Estructura del Proyecto

BakeryShop/ │ ├── frontend/ # Aplicación React │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ ├── services/ │ │ └── utils/ │ └── package.json │ ├── src/ │ └── main/ │ ├── java/com/bakeryshop/ │ │ ├── config/ │ │ ├── controller/ │ │ ├── dto/ │ │ ├── exception/ │ │ ├── model/ │ │ ├── repository/ │ │ ├── security/ │ │ └── service/ │ └── resources/ │ ├── static/ │ ├── templates/ │ └── application.yml │ ├── pom.xml └── README.md


---

## 🚀 Cómo ejecutar el proyecto localmente

### 1. Backend (Spring Boot)

```bash
cd BakeryShop
./mvnw spring-boot:run

cd frontend
npm install
npm start

