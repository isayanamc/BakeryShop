import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import './PerfilRepostero.css';

const PerfilRepostero = () => {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    recetasCreadas: 0,
    productosPendientes: 0,
    ingredientesBajoStock: 0
  });
  const navigate = useNavigate();

  // Función para cargar datos de demostración
  const cargarDatosDemostracion = () => {
    const datosDemo = [
      {
        id: 1,
        estado: 'PENDIENTE',
        nombre: 'Pastel de Chocolate',
        fechaCreacion: new Date().toISOString(),
        tiempoPreparacion: 45,
        ingredientes: ['Harina', 'Chocolate', 'Huevos', 'Azúcar']
      },
      {
        id: 2,
        estado: 'COMPLETADO',
        nombre: 'Croissants',
        fechaCreacion: new Date(Date.now() - 86400000).toISOString(), // Ayer
        tiempoPreparacion: 120,
        ingredientes: ['Harina', 'Mantequilla', 'Levadura', 'Sal']
      },
      {
        id: 3,
        estado: 'COMPLETADO',
        nombre: 'Pan de Banana',
        fechaCreacion: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        tiempoPreparacion: 60,
        ingredientes: ['Harina', 'Bananas', 'Huevos', 'Azúcar', 'Nueces']
      }
    ];

    setProductos(datosDemo);
    
    // Calcular estadísticas de demostración
    setEstadisticas({
      totalProductos: 12,
      recetasCreadas: 8,
      productosPendientes: 3,
      ingredientesBajoStock: 2
    });
    setCargando(false);
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
      setError('Sesión no iniciada. Por favor inicia sesión para acceder a tu panel.');
      // Para demostración, cargamos datos de ejemplo en vez de redirigir
      cargarDatosDemostracion();
      return;
    }

    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
      console.log('✅ Componente PerfilRepostero montado correctamente');
    } else {
      // Verificar si hay datos en userInfo o userEmail
      const userInfo = localStorage.getItem('userInfo');
      const userEmail = localStorage.getItem('usuarioEmail');
      
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUsuario(user);
        } catch (e) {
          console.error('Error al parsear userInfo', e);
          const usuarioDemo = { nombre: 'José', apellido: 'Torres' };
          setUsuario(usuarioDemo);
        }
      } else if (userEmail) {
        // Intentar obtener datos del usuario por email
        axios.get(`http://localhost:8080/usuarios/por-email?email=${userEmail}`)
          .then(res => setUsuario(res.data))
          .catch(err => {
            console.error('Error al obtener usuario por email', err);
            const usuarioDemo = { nombre: 'José', apellido: 'Torres' };
            setUsuario(usuarioDemo);
          });
      } else {
        // Datos demo para visualización
        const usuarioDemo = { nombre: 'José', apellido: 'Torres' };
        setUsuario(usuarioDemo);
      }
    }

    // CONEXIÓN A BASE DE DATOS REAL
    // Esta sección debe estar activada en producción
    try {
      setCargando(true);
      
      // Obtener productos asignados al repostero
      axios.get('http://localhost:8080/productos/repostero')
        .then(response => {
          if (response.status === 200) {
            console.log('✅ Conexión exitosa a la base de datos');
            setProductos(response.data);
            
            // Calcular estadísticas
            const totalProductos = response.data.length;
            const recetasCreadas = response.data.filter(p => p.estado === 'COMPLETADO').length;
            const pendientes = response.data.filter(p => p.estado === 'PENDIENTE').length;
            
            // Obtener ingredientes bajo stock
            axios.get('http://localhost:8080/inventario/bajo-stock')
              .then(res => {
                setEstadisticas({
                  totalProductos,
                  recetasCreadas,
                  productosPendientes: pendientes,
                  ingredientesBajoStock: res.data.length
                });
                setCargando(false);
              })
              .catch(err => {
                console.error('Error cargando inventario:', err);
                setEstadisticas({
                  totalProductos,
                  recetasCreadas,
                  productosPendientes: pendientes,
                  ingredientesBajoStock: 0
                });
                setCargando(false);
              });
          } else {
            throw new Error(`Error de respuesta del servidor: ${response.status}`);
          }
        })
        .catch(err => {
          console.error('Error cargando productos:', err);
          setError('No se pudieron cargar los datos. Usando información de demostración.');
          
          // En caso de error, mostrar datos demo
          cargarDatosDemostracion();
          
          // Mostrar notificación de error de conexión
          Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con la base de datos. Mostrando datos de demostración.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
          });
        });
    } catch (error) {
      console.error('Error general en la carga de datos:', error);
      setError('Error inesperado. Usando información de demostración.');
      cargarDatosDemostracion();
    }
  }, []);

  // Cambiar estado de un producto (simulado para desarrollo)
  const actualizarEstadoProducto = async (idProducto, nuevoEstado) => {
    try {
      // Simulación para desarrollo - en producción usar la API real
      // await axios.put(`http://localhost:8080/productos/${idProducto}/estado`, { estado: nuevoEstado });
      
      // Actualizar productos en el estado (simulación)
      const productosActualizados = productos.map(producto => 
        producto.id === idProducto ? { ...producto, estado: nuevoEstado } : producto
      );
      setProductos(productosActualizados);
      
      // Actualizar estadísticas
      const pendientes = productosActualizados.filter(p => p.estado === 'PENDIENTE').length;
      const completados = productosActualizados.filter(p => p.estado === 'COMPLETADO').length;
      setEstadisticas(prev => ({
        ...prev,
        productosPendientes: pendientes,
        recetasCreadas: completados
      }));
    } catch (err) {
      console.error('Error al actualizar estado del producto:', err);
    }
  };

  // Acciones rápidas para el repostero
  const tarjetas = [
    { titulo: '🧁 Nueva Receta', descripcion: 'Crear y registrar una nueva receta', ruta: '#' },
    { titulo: '🥖 Productos', descripcion: 'Administrar catálogo de productos', ruta: '#' },
    { titulo: '🥣 Inventario', descripcion: 'Verificar existencias de ingredientes', ruta: '#' },
    { titulo: '📊 Producción', descripcion: 'Ver estadísticas de producción', ruta: '#' },
  ];

  return (
    <>
      <Navbar />
      <div className="perfil-repostero-container">
        <div className="repostero-header">
          <h2 className="saludo-repostero">
            ¡Hola, <span className="repostero-nombre">{usuario?.nombre} {usuario?.apellido}</span>! 🧁
          </h2>
          <p className="subtitulo">Tus pedidos asignados</p>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="estadisticas-container">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{estadisticas.totalProductos}</p>
          </div>
          <div className="stat-card">
            <h3>Recetas Creadas</h3>
            <p className="stat-number">{estadisticas.recetasCreadas}</p>
          </div>
          <div className="stat-card">
            <h3>Pedidos Pendientes</h3>
            <p className="stat-number">{estadisticas.productosPendientes}</p>
          </div>
          <div className="stat-card">
            <h3>Ingredientes Bajo Stock</h3>
            <p className="stat-number">{estadisticas.ingredientesBajoStock}</p>
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

        {/* Productos pendientes */}
        <h3 className="seccion-titulo">Productos pendientes de preparación</h3>
        {productos.length === 0 ? (
          <p className="sin-productos">No tenés pedidos pendientes 🎉</p>
        ) : (
          <div className="lista-productos">
            {productos.filter(p => p.estado === 'PENDIENTE').map((producto) => (
              <div className="card-producto" key={producto.id}>
                <div className="producto-header">
                  <h4>{producto.nombre}</h4>
                  <span className={`estado-producto ${producto.estado.toLowerCase()}`}>
                    {producto.estado}
                  </span>
                </div>
                <p><strong>Tiempo de preparación:</strong> {producto.tiempoPreparacion} minutos</p>
                <p><strong>Fecha asignada:</strong> {new Date(producto.fechaCreacion).toLocaleDateString()}</p>
                <p><strong>Ingredientes:</strong> {producto.ingredientes.join(', ')}</p>
                
                <div className="acciones-producto">
                  <button 
                    className="btn-completar"
                    onClick={() => actualizarEstadoProducto(producto.id, 'COMPLETADO')}
                  >
                    Marcar como preparado
                  </button>
                  <button 
                    className="btn-detalles"
                    onClick={() => navigate(`/productos/${producto.id}`)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
            
            {productos.filter(p => p.estado === 'PENDIENTE').length === 0 && (
              <p className="sin-productos">No tenés pedidos pendientes 🎉</p>
            )}
            
            <button 
              className="btn-ver-todos" 
              onClick={() => navigate('#')}
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PerfilRepostero;