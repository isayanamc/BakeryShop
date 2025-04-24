import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Carrito.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Cargar productos del carrito desde localStorage al montar el componente
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(data);
  }, []);

  // Actualiza el estado del carrito y localStorage
  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  // Cambia la cantidad de un producto (+ o -)
  const cambiarCantidad = (id, cantidad) => {
    const actualizado = carrito.map((p) => {
      if (p.id_producto === id) {
        return { ...p, cantidad: Math.max(1, p.cantidad + cantidad) };
      }
      return p;
    });
    actualizarCarrito(actualizado);
  };

  // Elimina un producto con confirmación
  const eliminarProducto = (id) => {
    const producto = carrito.find(p => p.id_producto === id);
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Seguro que deseas eliminar "${producto.nombre}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const filtrado = carrito.filter(p => p.id_producto !== id);
        actualizarCarrito(filtrado);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto fue eliminado del carrito.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Cancela toda la compra (vacía el carrito)
  const cancelarCompra = () => {
    Swal.fire({
      title: '¿Cancelar compra?',
      text: 'Esto vaciará todo el carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('carrito');
        setCarrito([]);
        Swal.fire('Carrito eliminado', '', 'success');
      }
    });
  };

  // Calcula el total del carrito
  const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

// Realiza el pedido y redirige al checkout (NO lo confirma todavía)
function realizarPedido() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  if (!usuario || !token) {
    navigate('/iniciar-sesion');
    return;
  }

  if (carrito.length === 0) {
    Swal.fire("Tu carrito está vacío");
    return;
  }
  
  Swal.fire({
    title: '¿Confirmar pedido?',
    text: '¿Estás seguro de procesar este pedido?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      const fechaEntrega = new Date();
      fechaEntrega.setDate(fechaEntrega.getDate() + 2);

      const resPedido = await fetch('http://localhost:8080/pedidos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idCliente: usuario.id,
          idMetodoPago: 1,
          fechaEntrega: fechaEntrega.toISOString().split('T')[0],
          detalles: carrito.map(p => ({
            idProducto: p.id_producto,
            cantidad: p.cantidad
          }))
        })
      });

      let data;
      const contentType = resPedido.headers.get("content-type");

      if (resPedido.ok && contentType && contentType.includes("application/json")) {
        data = await resPedido.json();
      } else {
        const errorText = await resPedido.text();
        throw new Error(errorText);
      }

      const idPedido = data.idPedido;

      Swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        text: 'Falta confirmar el método de pago',
        confirmButtonText: 'Ir al checkout'
      }).then(() => {
        localStorage.removeItem('carrito');
        setCarrito([]);
        navigate(`/checkout/${idPedido}`);
      });

    } catch (err) {
      console.error('[Error Pedido]', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Algo salió mal al procesar tu pedido'
      });
    }
  });
}


  return (
    <>
      <Navbar />
      <div className="carrito-container">
        <h2 className="titulo-carrito">🛒 Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">
            Tu carrito está vacío <br />
            <button className="btn-volver-a-productos" onClick={() => navigate('/productos')}>
              Empezar a comprar
            </button>
          </p>
        ) : (
          <>
            <div className="carrito-grid">
              {carrito.map((p) => (
                <div className="carrito-card" key={p.id_producto}>
                  <img
                    src={p.imagen_url || '/productos/default.jpg'}
                    alt={p.nombre}
                    className="img-carrito"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/productos/default.jpg';
                    }}
                  />
                  <h3>{p.nombre}</h3>
                  <p>₡{p.precio}</p>
                  <p>Cantidad:</p>
                  <div className="cantidad-btns">
                    <button onClick={() => cambiarCantidad(p.id_producto, -1)}>-</button>
                    <span>{p.cantidad}</span>
                    <button onClick={() => cambiarCantidad(p.id_producto, 1)}>+</button>
                  </div>
                  <p className="subtotal">Subtotal: ₡{p.precio * p.cantidad}</p>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(p.id_producto)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {/* Total y botones */}
            <div className="resumen-total">
              <h3>Total: ₡{total}</h3>
              <div className="botones-finales">
              <button className="btn-cancelar" onClick={cancelarCompra}>
                Cancelar compra
              </button>
              <button className="btn-realizar" onClick={realizarPedido}>
                Realizar pedido
              </button>
            </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Carrito;
