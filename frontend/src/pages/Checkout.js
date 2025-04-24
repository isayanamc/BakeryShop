import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Checkout.css';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [metodosDisponibles, setMetodosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  console.log('Token que se está enviando:', token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Inicia carga

        const token = localStorage.getItem('token');

        // Métodos de pago
        const resMetodos = await axios.get('http://localhost:8080/metodos-pago', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetodosDisponibles(resMetodos.data);

        // Pedido
        const resPedido = await axios.get(`http://localhost:8080/pedidos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPedido(resPedido.data);

        // Detalles
        const resDetalles = await axios.get(`http://localhost:8080/pedidos/${id}/detalles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(resDetalles.data);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        let mensaje = 'No se pudo cargar la información del pedido o los métodos de pago';
        if (err.response) {
          mensaje = `Error ${err.response.status}: ${err.response.data.message || err.response.data || mensaje}`;
        }
        Swal.fire('Error', mensaje, 'error');
      } finally {
        setLoading(false); //  Finaliza carga
      }
    };

    fetchData();
  }, [id]);

  const usarCheckoutSimple = () => {
    navigate(`/checkout-simple/${id}`);
  };

  if (!pedido) return <div className="loading">Cargando información del pedido...</div>;

  const formatearNombre = (metodo) =>
    metodo.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <Navbar />
      <div className="checkout-wrapper">
        <h2 className="checkout-title">Confirmar Pedido</h2>
  
        <div className="checkout-info">
          <p><strong>Fecha de entrega:</strong> {new Date(pedido.fechaEntrega).toLocaleDateString('es-CR')}</p>
          <p><strong>Estado actual:</strong> {pedido.estado}</p>
          <p><strong>Total:</strong> ₡{pedido.total}</p>
        </div>
  
        <h3 className="checkout-subtitle">Productos en tu pedido</h3>
        <div className="checkout-productos">
          {productos.map((prod, idx) => (
            <div key={idx} className="checkout-card">
              <p><strong>{prod.producto.nombre}</strong></p>
              <p>Cantidad: {prod.cantidad}</p>
              <p>Subtotal: ₡{prod.subtotal}</p>
            </div>
          ))}
        </div>

  
        <div className="checkout-container">
          <h2 className="checkout-title-centered">Confirmación de Pedido #{id}</h2>
          <div className="btn-wrapper">
            <button className="btn btn-confirmar" onClick={usarCheckoutSimple}>
              Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}  
export default Checkout;
