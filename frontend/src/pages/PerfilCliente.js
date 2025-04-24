import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './PerfilCliente.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PerfilCliente = () => {
  const navigate = useNavigate();
  const cliente = JSON.parse(localStorage.getItem('usuario'));

  const [nombre, setNombre] = useState(cliente?.nombre || '');
  const [email, setEmail] = useState(cliente?.email || '');
  const [telefono, setTelefono] = useState(cliente?.telefono || '');
  const [calle, setCalle] = useState(cliente?.calle || '');
  const [ciudad, setCiudad] = useState(cliente?.ciudad || '');
  const [codigoPostal, setCodigoPostal] = useState(cliente?.codigoPostal || '');
  const [modoEdicion, setModoEdicion] = useState(false);

  const [pedidos, setPedidos] = useState([]);

  // Cargar pedidos del cliente
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/pedidos/cliente/${cliente.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPedidos(res.data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);

        //  Manejo de sesión expirada
        if (error.response?.status === 401) {
          Swal.fire('Sesión expirada', 'Por favor inicia sesión nuevamente.', 'warning').then(() => {
            localStorage.clear();
            navigate('/iniciar-sesion');
          });
        }
      }
    };

    if (cliente?.id && localStorage.getItem('token')) {
      cargarPedidos();
    }
  }, [cliente, navigate]);

  const handleEditar = () => setModoEdicion(true);

  const handleCancelar = () => {
    setNombre(cliente?.nombre || '');
    setEmail(cliente?.email || '');
    setTelefono(cliente?.telefono || '');
    setCalle(cliente?.calle || '');
    setCiudad(cliente?.ciudad || '');
    setCodigoPostal(cliente?.codigoPostal || '');
    setModoEdicion(false);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !telefono || !calle || !ciudad || !codigoPostal) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de guardar.'
      });
      return;
    }

    try {
      const clienteActualizado = {
        id: cliente.id,
        nombre,
        email,
        telefono,
        calle,
        ciudad,
        codigoPostal
      };

      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/clientes/actualizar', clienteActualizado, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Tu información ha sido actualizada correctamente.'
      });

      localStorage.setItem('usuario', JSON.stringify(clienteActualizado));
      setModoEdicion(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar tu información. Intenta nuevamente.'
      });
    }
  };

  const formatearEstado = (estado) => {
    return estado.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <Navbar />

      <div className="perfil-wrapper">
        {/* Tarjeta del perfil */}
        <div className="perfil-container">
          <h2 className="perfil-titulo">Mi Perfil</h2>
          <form className="perfil-formulario" onSubmit={handleActualizar}>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!modoEdicion} />

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!modoEdicion} />

            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              pattern="[0-9]{4}-[0-9]{4}"
              placeholder="8888-8888"
              onChange={(e) => setTelefono(e.target.value)}
              disabled={!modoEdicion}
            />

            <label>Calle:</label>
            <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} disabled={!modoEdicion} />

            <label>Ciudad:</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} disabled={!modoEdicion} />

            <label>Código Postal:</label>
            <input
              type="text"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              disabled={!modoEdicion}
            />

            {!modoEdicion ? (
              <button type="button" className="perfil-boton editar" onClick={handleEditar}>
                Editar Perfil
              </button>
            ) : (
              <div className="botones-accion">
                <button type="submit" className="perfil-boton guardar">Guardar Cambios</button>
                <button type="button" className="perfil-boton cancelar" onClick={handleCancelar}>Cancelar</button>
              </div>
            )}
          </form>
        </div>

        {/* Tarjeta de pedidos */}
        <div className="perfil-container pedidos-box">
          <h2 className="perfil-titulo">Mis Pedidos</h2>
          {pedidos.length === 0 ? (
            <div className="sin-pedidos">
              <p>Aún no has realizado ningún pedido.</p>
              <button className="perfil-boton guardar" onClick={() => navigate('/productos')}>
                Empezar a Comprar
              </button>
            </div>
          ) : (
            <ul className="lista-pedidos">
              {pedidos
                .sort((a, b) => new Date(b.fechaEntrega) - new Date(a.fechaEntrega))
                .map((pedido) => (
                  <li key={pedido.id} className={`pedido-item ${pedido.estado === 'Cancelado' ? 'pedido-cancelado' : ''}`}>
                    <p><strong>Fecha:</strong> {new Date(pedido.fechaEntrega).toLocaleDateString('es-CR')}</p>
                    <p><strong>Total:</strong> ₡{pedido.total}</p>
                    <p><strong>Estado:</strong> {formatearEstado(pedido.estado)}</p>

                    {pedido.estado === 'Pendiente' && (
                      <button className="btn-checkout" onClick={() => navigate(`/checkout/${pedido.id}`)}>
                        Ir a Checkout
                      </button>
                    )}

                    {pedido.estado === 'Cancelado' && (
                      <p className="texto-cancelado">Este pedido fue cancelado por el administrador.</p>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PerfilCliente;
