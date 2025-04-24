import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';

// Contexto de usuario
import { UserProvider } from './utils/UserContext';

// Páginas públicas
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';

// Autenticación
import InicioSesion from './pages/InicioSesion';
import Registro from './pages/Registro';

// Seguridad y protección
import withAuth from './utils/withAuth';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import AccesoDenegado from './pages/AccesoDenegado';

// Paneles de usuario
import PerfilCliente from './pages/PerfilCliente';
import PerfilRepostero from './pages/PerfilRepostero';
import PerfilVendedor from './pages/PerfilVendedor';
import PerfilAdmin from './pages/PerfilAdmin';

//Checkout
import CheckoutSimple from './pages/CheckoutSimple';


// Componentes de administración
import UsuariosAdmin from './components/admin/UsuariosAdmin';
import ClientesAdmin from './components/admin/ClientesAdmin';
import PedidosAdmin from './components/admin/PedidosAdmin';
import ProductosAdmin from './components/admin/ProductosAdmin';
import InventarioAdmin from './components/admin/InventarioAdmin';

// Proteccion de perfiles
const WithAuthAdmin = withAuth(PerfilAdmin, 'Administrador');
const WithAuthRepostero = withAuth(PerfilRepostero, 'Repostero');
const WithAuthVendedor = withAuth(PerfilVendedor, 'Vendedor');

// Cargar token si existe
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Autenticación */}
          <Route path="/iniciar-sesion" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />

          {/* Paneles de usuario */}
          <Route path="/perfil-cliente" element={<PerfilCliente />} />
          <Route path="/perfil-repostero" element={<WithAuthRepostero />} />
          <Route path="/perfil-vendedor" element={<WithAuthVendedor />} />
          <Route path="/perfil-admin" element={<WithAuthAdmin />} />

          {/* Secciones de administración */}
          <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
          <Route path="/admin/clientes" element={<ClientesAdmin />} />
          <Route path="/admin/pedidos" element={<PedidosAdmin />} />
          <Route path="/admin/productos" element={<ProductosAdmin />} />
          <Route path="/admin/inventario" element={<InventarioAdmin />} />

          {/* Seguridad y errores */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="*" element={<PaginaNoEncontrada />} />

          {/* Checkout */}
          <Route path="/checkout/:id" element={<CheckoutSimple />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;