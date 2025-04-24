import React, { useEffect, useState } from 'react';
import ClienteService from '../services/ClienteService';
import Swal from 'sweetalert2';
import './Clientes.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  // Función para cargar clientes del backend
  const cargarClientes = async () => {
    try {
      const res = await ClienteService.listarClientes();
      setClientes(res.data);
      console.log('[✅] Clientes cargados:', res.data);
    } catch (error) {
      console.error('[❌] Error al cargar clientes:', error);
      Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
    }
  };

  // Función para desactivar un cliente
  const handleDesactivar = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'El cliente será desactivado y no podrá iniciar sesión.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await ClienteService.desactivarCliente(id);
        console.log(`[🧹] Cliente ID ${id} desactivado correctamente`);
        Swal.fire('Cliente desactivado', '', 'success');
        cargarClientes();
      } catch (error) {
        console.error('[❌] Error al desactivar cliente:', error);
        Swal.fire('Error', 'No se pudo desactivar el cliente', 'error');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="clientes-container">
        <h2>📋 Gestión de Clientes</h2>

        <table className="tabla-clientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td>{c.ciudad}</td>
                <td>{new Date(c.fechaRegistro).toLocaleDateString('es-CR')}</td>
                <td>
                  <button
                    className="btn-desactivar"
                    onClick={() => handleDesactivar(c.id)}>
                    ❌ Eliminar 
                  </button>
                  <button onClick={() => navigate(`/admin/pedidos?clienteId=${c.id}`)}>
                    📦 Ver Pedidos
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Clientes;
