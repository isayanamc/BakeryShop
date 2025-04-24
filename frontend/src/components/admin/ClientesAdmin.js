import React, { useState, useEffect } from 'react';
import { ClienteService } from '../../services/ClienteService';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Swal from 'sweetalert2';
import './ClientesAdmin.css';
import axios from 'axios';

const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setIsLoading(true);
    try {
      const data = await ClienteService.obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los clientes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.email.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.telefono?.includes(filtro)
  );

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'No disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES');
  };

  // Ver detalles de cliente
  const verDetallesCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    setClienteSeleccionado(cliente);
    
    Swal.fire({
      title: `Detalles de ${cliente.nombre}`,
      html: `
        <div class="detalles-cliente">
          <p><strong>Email:</strong> ${cliente.email}</p>
          <p><strong>Teléfono:</strong> ${cliente.telefono || 'No disponible'}</p>
          <p><strong>Dirección:</strong> ${cliente.calle || 'No disponible'}, ${cliente.ciudad || ''}</p>
          <p><strong>Código Postal:</strong> ${cliente.codigoPostal || 'No disponible'}</p>
          <p><strong>Fecha de Registro:</strong> ${formatearFecha(cliente.fechaRegistro)}</p>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#e83e8c'
    });
  };

  // Eliminar cliente
  const eliminarCliente = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e83e8c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ClienteService.eliminarCliente(id);
          
          // Actualizar lista
          setClientes(clientes.filter(cliente => cliente.id !== id));
          
          Swal.fire(
            '¡Eliminado!',
            'El cliente ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el cliente',
            'error'
          );
        }
      }
    });
  };

const verHistorialPedidos = async (id) => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem('token');
    
    // Hacer la petición al backend para obtener los pedidos del cliente
    const response = await axios.get(`http://localhost:8080/pedidos/cliente/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      const pedidos = response.data;
      
      // Si no hay pedidos, mostrar mensaje
      if (pedidos.length === 0) {
        Swal.fire({
          title: 'Sin pedidos',
          text: 'Este cliente no tiene pedidos registrados',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#e83e8c'
        });
        return;
      }
      
      // Construir tabla HTML con los pedidos
      let tablaHtml = `
        <div class="tabla-pedidos-historial">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      // Agregar filas a la tabla
      pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES');
        tablaHtml += `
          <tr>
            <td>#${pedido.id}</td>
            <td>${fecha}</td>
            <td>${formatearEstado(pedido.estado)}</td>
            <td>₡${pedido.total.toFixed(2)}</td>
          </tr>
        `;
      });
      
      tablaHtml += `
            </tbody>
          </table>
        </div>
      `;
      
      // Mostrar modal con la tabla de pedidos
      Swal.fire({
        title: 'Historial de Pedidos',
        html: tablaHtml,
        width: 600,
        showCloseButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#e83e8c'
      });
    }
  } catch (error) {
    console.error("Error al obtener historial de pedidos:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial de pedidos'
    });
  }
};

// Función de ayuda para formatear el estado
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
      <div className="clientes-admin-container">
        <h2>Gestión de Clientes</h2>
        
        <div className="panel-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="busqueda-input"
          />
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : (
          <div className="tabla-container">
            <table className="tabla-clientes">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>#{cliente.id}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono || 'No disponible'}</td>
                      <td>{cliente.ciudad || 'No disponible'}</td>
                      <td>{formatearFecha(cliente.fechaRegistro)}</td>
                      <td className="acciones-column">
                        <button
                          onClick={() => verDetallesCliente(cliente.id)}
                          className="btn-detalles"
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => verHistorialPedidos(cliente.id)}
                          className="btn-historial"
                          title="Ver pedidos"
                        >
                          Pedidos
                        </button>
                        <button
                          onClick={() => eliminarCliente(cliente.id)}
                          className="btn-eliminar"
                          title="Eliminar cliente"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-clientes">
                      No se encontraron clientes
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

export default ClientesAdmin;