import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CrearPedido.css';

const CrearPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [detalles, setDetalles] = useState([]);

  // Cargar clientes y productos al montar
  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/clientes/listar');
      setClientes(res.data);
      console.log('✔️ Clientes cargados', res.data);
    } catch (err) {
      console.error('❌ Error al cargar clientes', err);
      Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:8080/productos');
      setProductos(res.data);
      console.log('✔️ Productos cargados', res.data);
    } catch (err) {
      console.error('❌ Error al cargar productos', err);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
  };

  const handleAgregarProducto = (idProducto) => {
    const yaExiste = detalles.some((d) => d.idProducto === idProducto);
    if (!yaExiste) {
      setDetalles([...detalles, { idProducto, cantidad: 1 }]);
    } else {
      Swal.fire('Atención', 'Este producto ya fue agregado', 'info');
    }
  };

  const handleCantidad = (idProducto, nuevaCantidad) => {
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;

    setDetalles(
      detalles.map((d) =>
        d.idProducto === idProducto
          ? { ...d, cantidad: nuevaCantidad }
          : d
      )
    );
  };

  const handleEliminarProducto = (idProducto) => {
    setDetalles(detalles.filter((d) => d.idProducto !== idProducto));
  };

  const handleCrearPedido = async () => {
    if (!clienteId || !fechaEntrega || detalles.length === 0) {
      Swal.fire('Campos requeridos', 'Selecciona cliente, fecha y productos', 'warning');
      return;
    }

    try {
      const pedidoDTO = {
        idCliente: parseInt(clienteId),
        idMetodoPago: 1, // hardcodeado por ahora
        fechaEntrega,
        detalles
      };

      const res = await axios.post('http://localhost:8080/pedidos/crear', pedidoDTO);
      console.log('✅ Pedido creado correctamente:', res.data);

      Swal.fire({
        icon: 'success',
        title: '¡Pedido creado!',
        text: `Pedido #${res.data.idPedido} creado con éxito`
      });

      // Limpiar formulario
      setClienteId('');
      setFechaEntrega('');
      setDetalles([]);
    } catch (error) {
      console.error('❌ Error al crear pedido:', error.response?.data || error.message);
      Swal.fire('Error', error.response?.data || 'No se pudo crear el pedido', 'error');
    }
  };

  return (
    <>
      <Navbar />

      <div className="crear-pedido-container">
        <h2>📋 Crear Pedido Manual</h2>

        <div className="formulario-crear">
          <label>Cliente:</label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="">-- Selecciona un cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.email})
              </option>
            ))}
          </select>

          <label>Fecha de entrega:</label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // evitar fechas pasadas
          />
        </div>

        <h3>🍰 Productos disponibles</h3>
        <div className="productos-grid">
          {productos.map((p) => (
            <div key={p.id} className="producto-card">
              <h4>{p.nombre}</h4>
              <p>₡{p.precio}</p>
              <button onClick={() => handleAgregarProducto(p.id)}>Agregar</button>
            </div>
          ))}
        </div>

        <h3>🧺 Productos agregados</h3>
        {detalles.length > 0 ? (
          <table className="tabla-detalles">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d) => {
                const producto = productos.find((p) => p.id === d.idProducto);
                return (
                  <tr key={d.idProducto}>
                    <td>{producto?.nombre || 'Producto eliminado'}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={d.cantidad}
                        onChange={(e) => handleCantidad(d.idProducto, parseInt(e.target.value))}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEliminarProducto(d.idProducto)}>❌</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="no-detalles">No has agregado productos aún</p>
        )}

        <button className="btn-crear-pedido" onClick={handleCrearPedido}>
          Crear Pedido
        </button>
      </div>

      <Footer />
    </>
  );
};

export default CrearPedido;
