import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import './PerfilAdmin.css';

const PerfilAdmin = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }


  // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      console.log('✅ Componente PerfilAdmin montado correctamente');
    }
  }, []);

  // Lista de accesos rápidos para el panel del administrador
  const tarjetas = [
    { titulo: '👥 Usuarios', descripcion: 'Crear, editar o eliminar usuarios y asignar roles', ruta: '/admin/usuarios' },
    { titulo: '🧁 Clientes', descripcion: 'Ver clientes, historial y eliminar cuentas', ruta: '/admin/clientes' },
    { titulo: '📦 Pedidos', descripcion: 'Ver todos los pedidos y cambiar su estado', ruta: '/admin/pedidos' },
    { titulo: '🍰 Productos', descripcion: 'Crear, editar y eliminar productos del catálogo', ruta: '/admin/productos' },
    { titulo: '🥣 Inventario', descripcion: 'Administrar ingredientes disponibles', ruta: '/admin/inventario' },
    { titulo: '📊 Reportes', descripcion: 'Ver ventas por fecha y productos más vendidos', ruta: '/admin/reportes' },
    { titulo: '➕ Nuevo Pedido', descripcion: 'Registrar manualmente un pedido nuevo', ruta: '/admin/crear-pedido' },
  ];

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h2 className="saludo-admin">
          Hola, <span className="admin-nombre">{usuario?.nombre} {usuario?.apellido}</span> 💼<br />
          <span className="subtitulo">(Administrador de la Bakery Shop)</span>
        </h2>

        {/* Tarjetas de gestión */}
        <div className="dashboard-grid">
          {tarjetas.map((tarjeta, idx) => (
            <div key={idx} className="card-admin" onClick={() => navigate(tarjeta.ruta)}>
              <h3>{tarjeta.titulo}</h3>
              <p>{tarjeta.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PerfilAdmin;
