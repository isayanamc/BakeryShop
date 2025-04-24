import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutSimple.css';

const CheckoutSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [metodosDisponibles, setMetodosDisponibles] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarMetodosPago = async () => {
      try {
        const response = await axios.get('http://localhost:8080/metodos-pago');
        setMetodosDisponibles(response.data);
      } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        Swal.fire('Error', 'No se pudieron cargar los métodos de pago', 'error');
      }
    };

    cargarMetodosPago();
  }, []);

  const confirmarPedido = async () => {
    if (!metodoPago) {
      Swal.fire('Error', 'Por favor selecciona un método de pago', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8080/pedidos/${id}/checkout-publico`,
        { idMetodoPago: parseInt(metodoPago, 10) }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Pedido confirmado!',
        text: 'Tu pedido ha sido procesado exitosamente.'
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      let mensaje = 'Ocurrió un error al procesar tu pedido.';
      if (error.response) {
        mensaje = `Error ${error.response.status}: ${error.response.data}`;
      }

      Swal.fire('Error', mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-simple-wrapper">
        <h1>Confirmar Pedido #{id}</h1>

        <label htmlFor="metodoPago">Seleccione método de pago:</label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Seleccionar --</option>
          {metodosDisponibles.map((metodo) => (
            <option key={metodo.id} value={metodo.id}>
              {metodo.metodo}
            </option>
          ))}
        </select>

        <button
          onClick={confirmarPedido}
          disabled={loading}
          className="btn-confirmar"
        >
          {loading ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutSimple;
