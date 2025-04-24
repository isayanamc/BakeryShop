import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './PedidosAdmin.css';
import PedidoService from '../../services/PedidoService';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [reposteros, setReposteros] = useState([]);
  const [selectedRepostero, setSelectedRepostero] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const navigate = useNavigate();

  // Token para autenticación
  const token = localStorage.getItem('token');
  
  // Headers para las peticiones
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Cargar pedidos al iniciar
  useEffect(() => {
    cargarPedidos();
    cargarReposteros();
  }, []);

  // Función para cargar pedidos
  const cargarPedidos = async () => {
    setIsLoading(true);
    try {
      let endpoint = 'http://localhost:8080/pedidos/listar';
      
      const response = await axios.get(endpoint, { headers });
      
      if (response.status === 200) {
        console.log("Pedidos cargados:", response.data);
        setPedidos(response.data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los pedidos. Intente nuevamente más tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar reposteros (usuarios con rol de repostero)
  const cargarReposteros = async () => {
    try {
      // Suponiendo que el ID del rol de repostero es 2
      const response = await axios.get('http://localhost:8080/usuarios/por-rol/2', { headers });
      
      if (response.status === 200) {
        console.log("Reposteros cargados:", response.data);
        setReposteros(response.data);
      }
    } catch (error) {
      console.error("Error al cargar reposteros:", error);
      // No mostramos alerta aquí para no sobrecargar al usuario
    }
  };

  // Aplicar filtro de pedidos
  useEffect(() => {
    if (filtro !== 'todos') {
      cargarPedidosFiltrados();
    } else {
      cargarPedidos();
    }
  }, [filtro]);

  // Cargar pedidos con filtro
  const cargarPedidosFiltrados = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/pedidos/filtrar?estado=${filtro}`, { headers });
      
      if (response.status === 200) {
        setPedidos(response.data);
      }
    } catch (error) {
      console.error("Error al filtrar pedidos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al filtrar pedidos. Por favor, intente nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar estado de pedido
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`,
        {},
        { headers }
      );
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: `El pedido ha sido marcado como ${nuevoEstado.replace('_', ' ')}`,
          timer: 1500,
          showConfirmButton: false
        });
        
        // Recargar pedidos
        if (filtro !== 'todos') {
          cargarPedidosFiltrados();
        } else {
          cargarPedidos();
        }
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado del pedido'
      });
    }
  };

  // Asignar pedido a repostero
  const asignarRepostero = async () => {
    if (!pedidoSeleccionado || !selectedRepostero) {
      Swal.fire({
        icon: 'warning',
        title: 'Información incompleta',
        text: 'Selecciona un pedido y un repostero'
      });
      return;
    }

    try {
      // Llamada al backend para asignar repostero
      const response = await axios.post(
        `http://localhost:8080/pedidos/${pedidoSeleccionado}/asignar-repostero`,
        { idUsuario: selectedRepostero },
        { headers }
      );
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Pedido asignado',
          text: 'El pedido ha sido asignado al repostero correctamente'
        });
        
        // Limpiar selección y recargar datos
        setPedidoSeleccionado(null);
        setSelectedRepostero('');
        cargarPedidos();
      }
    } catch (error) {
      console.error("Error al asignar repostero:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo asignar el repostero al pedido. Por favor, intente nuevamente.'
      });
    }
  };

  // Ver detalles del pedido
  const verDetalles = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/pedidos/${id}/detalles`, { headers });
      
      if (response.status === 200) {
        const detalles = response.data;
        
        let detallesHtml = '<div class="detalles-pedido-table">';
        detallesHtml += `
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        detalles.forEach(item => {
          detallesHtml += `
            <tr>
              <td>${item.producto.nombre}</td>
              <td>${item.cantidad}</td>
              <td>₡${item.producto.precio.toFixed(2)}</td>
              <td>₡${item.subtotal.toFixed(2)}</td>
            </tr>
          `;
        });
        
        detallesHtml += '</tbody></table></div>';
        
        Swal.fire({
          title: `Detalles del Pedido #${id}`,
          html: detallesHtml,
          width: 600,
          showCloseButton: true,
          showCancelButton: false,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#e83e8c'
        });
      }
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los detalles del pedido'
      });
    }
  };

  // Seleccionar pedido para asignar
  const seleccionarPedido = (id) => {
    setPedidoSeleccionado(id === pedidoSeleccionado ? null : id);
  };

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'No disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determinar clase de estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'estado-pendiente';
      case 'En_proceso': return 'estado-proceso';
      case 'Entregado': return 'estado-entregado';
      case 'Cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  // Mapear estado a texto amigable
  const formatearEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'Pendiente';
      case 'En_proceso': return 'En proceso';
      case 'Entregado': return 'Entregado';
      case 'Cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  return (
    <>
      <Navbar />
      <div className="pedidos-admin-container">
        <div className="header-container">
          <h2>Gestión de Pedidos</h2>
          <div className="filtros-container">
            <label>Filtrar por estado:</label>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos los pedidos</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En_proceso">En proceso</option>
              <option value="Entregado">Entregados</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Sección para asignar repostero */}
        <div className="asignar-repostero-container">
          <h3>Asignar pedido a repostero</h3>
          <div className="asignar-controles">
            <select
              value={selectedRepostero}
              onChange={(e) => setSelectedRepostero(e.target.value)}
              className="repostero-select"
            >
              <option value="">Seleccionar repostero</option>
              {reposteros.map(repostero => (
                <option key={repostero.id} value={repostero.id}>
                  {repostero.nombre}
                </option>
              ))}
            </select>
            <button 
              onClick={asignarRepostero}
              disabled={!pedidoSeleccionado || !selectedRepostero}
              className="btn-asignar"
            >
              Asignar
            </button>
          </div>
          <p className="instruccion-asignar">
            {pedidoSeleccionado 
              ? `Pedido #${pedidoSeleccionado} seleccionado para asignación` 
              : 'Selecciona un pedido de la lista para asignarlo'}
          </p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Cargando pedidos...</p>
          </div>
        ) : (
          <div className="tabla-container">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Entrega</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Repostero</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <tr 
                      key={pedido.id}
                      className={pedidoSeleccionado === pedido.id ? 'fila-seleccionada' : ''}
                      onClick={() => seleccionarPedido(pedido.id)}
                    >
                      <td>#{pedido.id}</td>
                      <td>{pedido.cliente ? pedido.cliente.nombre : 'N/A'}</td>
                      <td>{formatearFecha(pedido.fecha)}</td>
                      <td>{formatearFecha(pedido.fechaEntrega)}</td>
                      <td>
                        <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                          {formatearEstado(pedido.estado)}
                        </span>
                      </td>
                      <td>₡{pedido.total?.toFixed(2)}</td>
                      <td>{pedido.usuario ? pedido.usuario.nombre : 'No asignado'}</td>
                      <td className="acciones-column">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            verDetalles(pedido.id);
                          }}
                          className="btn-detalles"
                        >
                          Ver
                        </button>
                        
                        <div className="dropdown">
                          <button className="btn-estado">
                            Estado ▼
                          </button>
                          <div className="dropdown-content">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cambiarEstado(pedido.id, 'Pendiente');
                              }}
                            >
                              Pendiente
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cambiarEstado(pedido.id, 'En_proceso');
                              }}
                            >
                              En proceso
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cambiarEstado(pedido.id, 'Entregado');
                              }}
                            >
                              Entregado
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cambiarEstado(pedido.id, 'Cancelado');
                              }}
                            >
                              Cancelado
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-pedidos">
                      No hay pedidos disponibles para esta selección
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PedidosAdmin;