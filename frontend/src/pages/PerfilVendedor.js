import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import './PerfilVendedor.css';

const PerfilVendedor = () => {
  const [usuario, setUsuario] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    productosVendidos: 0,
    pedidosPendientes: 0,
    ingresosSemanales: 0
  });
  const navigate = useNavigate();

  // Función para datos de demostración
  const cargarDatosDemostracion = () => {
    const datosDemo = [
      {
        id: 1,
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString(),
        total: 2500,
        cliente: { nombre: 'Juan', apellido: 'Pérez' },
        detalles: [{ cantidad: 2, producto: { nombre: 'Pan de chocolate' } }, { cantidad: 1, producto: { nombre: 'Torta de vainilla' } }]
      },
      {
        id: 2,
        estado: 'COMPLETADO',
        fechaCreacion: new Date(Date.now() - 86400000).toISOString(), // Ayer
        total: 1800,
        cliente: { nombre: 'María', apellido: 'González' },
        detalles: [{ cantidad: 3, producto: { nombre: 'Croissants' } }]
      }
    ];

    setVentas(datosDemo);
    
    // Calcular estadísticas de demostración
    setEstadisticas({
      totalVentas: 2,
      productosVendidos: 6,
      pedidosPendientes: 1,
      ingresosSemanales: 4300
    });
  };
  
  // Configurar token y cargar usuario
  useEffect(() => {
    // Configurar token para las peticiones
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token establecido en cabeceras');
    } else {
      console.warn('No se encontró token en localStorage');
      // Solo para desarrollo - usar datos de demostración
      // En producción, debería redirigir al login
      cargarDatosDemostracion();
      return;
    }

    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      console.log('✅ Componente PerfilVendedor montado correctamente');
    } else {
      // Solo para desarrollo - usar datos demo sin redirigir
      const usuarioDemo = { nombre: 'Camila', apellido: 'Benavidez' };
      setUsuario(usuarioDemo);
    }

    // Simulando la carga de datos de ventas (para desarrollo)
    cargarDatosDemostracion();

    // Comentado para desarrollo - descomentar para usar la API real
    /*
    axios.get('http://localhost:8080/ventas/vendedor')
      .then(response => {
        setVentas(response.data);
        
        // Calcular estadísticas
        const totalVentas = response.data.length;
        const productosVendidos = response.data.reduce((total, venta) => 
          total + venta.detalles.reduce((t, d) => t + d.cantidad, 0), 0);
        const pendientes = response.data.filter(v => v.estado === 'PENDIENTE').length;
        const ingresos = response.data
          .filter(v => {
            const fechaVenta = new Date(v.fechaCreacion);
            const hoy = new Date();
            const unaSemanaAtras = new Date();
            unaSemanaAtras.setDate(hoy.getDate() - 7);
            return fechaVenta >= unaSemanaAtras && v.estado !== 'CANCELADO';
          })
          .reduce((total, venta) => total + venta.total, 0);

        setEstadisticas({
          totalVentas,
          productosVendidos,
          pedidosPendientes: pendientes,
          ingresosSemanales: ingresos
        });
      })
      .catch(err => {
        console.error('Error cargando ventas:', err);
        cargarDatosDemostracion();
      });
    */
  }, []);

  // Cambiar estado de una venta (simulado para desarrollo)
  const actualizarEstadoVenta = async (idVenta, nuevoEstado) => {
    try {
      // Simulación para desarrollo - en producción usar la API real
      // await axios.put(`http://localhost:8080/ventas/${idVenta}/estado`, { estado: nuevoEstado });
      
      // Actualizar ventas en el estado (simulación)
      const ventasActualizadas = ventas.map(venta => 
        venta.id === idVenta ? { ...venta, estado: nuevoEstado } : venta
      );
      setVentas(ventasActualizadas);
      
      // Actualizar estadísticas
      const pendientes = ventasActualizadas.filter(v => v.estado === 'PENDIENTE').length;
      setEstadisticas(prev => ({
        ...prev,
        pedidosPendientes: pendientes
      }));
    } catch (err) {
      console.error('Error al actualizar estado de venta:', err);
    }
  };

  // Acciones rápidas para el vendedor
  const tarjetas = [
    { titulo: '🛒 Nueva Venta', descripcion: 'Registrar una nueva venta en el sistema', ruta: '#' },
    { titulo: '📋 Historial', descripcion: 'Ver historial completo de ventas', ruta: '#' },
    { titulo: '🧾 Reportes', descripcion: 'Generar informes de ventas y estadísticas', ruta: '#' },
    { titulo: '🔔 Notificaciones', descripcion: 'Ver avisos de stock bajo y pedidos pendientes', ruta: '#' },
  ];

  return (
    <>
      <Navbar />
      <div className="perfil-vendedor-container">
        <div className="vendedor-header">
          <h2 className="saludo-vendedor">
            ¡Hola, <span className="vendedor-nombre">{usuario?.nombre} {usuario?.apellido}</span>! 🛍️
          </h2>
          <p className="subtitulo">Panel de Vendedor</p>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="estadisticas-container">
          <div className="stat-card">
            <h3>Ventas Totales</h3>
            <p className="stat-number">{estadisticas.totalVentas}</p>
          </div>
          <div className="stat-card">
            <h3>Productos Vendidos</h3>
            <p className="stat-number">{estadisticas.productosVendidos}</p>
          </div>
          <div className="stat-card">
            <h3>Pedidos Pendientes</h3>
            <p className="stat-number">{estadisticas.pedidosPendientes}</p>
          </div>
          <div className="stat-card">
            <h3>Ingresos Semanales</h3>
            <p className="stat-number">${estadisticas.ingresosSemanales.toFixed(2)}</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <h3 className="seccion-titulo">Acciones rápidas</h3>
        <div className="acciones-grid">
          {tarjetas.map((tarjeta, idx) => (
            <div key={idx} className="card-accion" onClick={() => navigate(tarjeta.ruta)}>
              <h3>{tarjeta.titulo}</h3>
              <p>{tarjeta.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Ventas recientes */}
        <h3 className="seccion-titulo">Ventas recientes</h3>
        {ventas.length === 0 ? (
          <p className="sin-ventas">No hay ventas registradas recientes</p>
        ) : (
          <div className="lista-ventas">
            {ventas.slice(0, 5).map((venta) => (
              <div className="card-venta" key={venta.id}>
                <div className="venta-header">
                  <h4>Venta #{venta.id}</h4>
                  <span className={`estado-venta ${venta.estado.toLowerCase()}`}>
                    {venta.estado}
                  </span>
                </div>
                <p>Cliente: {venta.cliente.nombre} {venta.cliente.apellido}</p>
                <p>Fecha: {new Date(venta.fechaCreacion).toLocaleDateString()}</p>
                <p>Total: ${venta.total.toFixed(2)}</p>
                
                {venta.estado === 'PENDIENTE' && (
                  <div className="acciones-venta">
                    <button 
                      className="btn-completar"
                      onClick={() => actualizarEstadoVenta(venta.id, 'COMPLETADO')}
                    >
                      Completar
                    </button>
                    <button 
                      className="btn-cancelar"
                      onClick={() => actualizarEstadoVenta(venta.id, 'CANCELADO')}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button 
              className="btn-ver-todas" 
              onClick={() => navigate('#')}
            >
              Ver todas las ventas
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PerfilVendedor;