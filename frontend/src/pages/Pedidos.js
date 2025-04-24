import React, { useEffect, useState } from 'react';
import PedidoService from '../services/PedidoService';
import Swal from 'sweetalert2';
import './Pedidos.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  useEffect(() => {
    cargarPedidos();
  }, [estadoFiltro]);

  const cargarPedidos = async () => {
    try {
      const res = estadoFiltro
        ? await PedidoService.filtrarPorEstado(estadoFiltro)
        : await PedidoService.getTodos();
      setPedidos(res.data);
      console.log('📦 Pedidos cargados:', res.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await PedidoService.cambiarEstado(id, nuevoEstado);
      Swal.fire('Éxito', `Pedido marcado como ${nuevoEstado}`, 'success');
      cargarPedidos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pedidos-container">
        <h2>📑 Gestión de Pedidos</h2>

        <div className="filtro-estado">
          <label>Filtrar por estado:</label>
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En_proceso">En proceso</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente?.nombre || 'N/A'}</td>
                <td>{new Date(p.fechaEntrega).toLocaleDateString('es-CR')}</td>
                <td>₡{p.total}</td>
                <td>{p.estado}</td>
                <td>
                  {p.estado === 'Pendiente' && (
                    <>
                      <button onClick={() => cambiarEstado(p.id, 'En_proceso')} className="btn-accion verde">Procesar</button>
                      <button onClick={() => cambiarEstado(p.id, 'Cancelado')} className="btn-accion rojo">Cancelar</button>
                    </>
                  )}
                  {p.estado === 'En_proceso' && (
                    <button onClick={() => cambiarEstado(p.id, 'Entregado')} className="btn-accion azul">Entregado</button>
                  )}
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

export default Pedidos;
