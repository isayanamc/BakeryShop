import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const navigate = useNavigate();

  // Obtener el producto por ID
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/productos/${id}`);
        console.log('[Detalle] Producto encontrado:', res.data);
        setProducto(res.data);
      } catch (error) {
        console.error('[Detalle] Error al obtener el producto:', error);
        navigate('/pagina-no-encontrada');
      }
    };

    obtenerProducto();
  }, [id, navigate]);

  // Agregar al carrito
  const agregarAlCarrito = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      console.warn('[Detalle] Usuario no autenticado. Redirigiendo...');
      navigate('/iniciar-sesion');
      return;
    }

    try {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const existe = carrito.find((p) => p.id_producto === producto.id_producto);

      if (existe) {
        existe.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: 'Producto agregado al carrito ✅',
        timer: 1500,
        showConfirmButton: false,
      });
      
    } catch (err) {
      console.error('[Detalle] Error al añadir al carrito:', err);
    }
  };

  if (!producto) return null;

  return (
    <>
      <Navbar />
  
      <div className="detalle-container">
        <div className="detalle-card">
          
          {/* 🖼️ Imagen */}
          <div className="detalle-img-container">
            <img
              src={producto.imagen_url || '/productos/default.jpg'}
              alt={producto.nombre}
              className="detalle-img"
              onError={(e) => {
                console.warn(`[Detalle] Imagen rota de ${producto.nombre}`);
                e.target.onerror = null;
                e.target.src = '/productos/default.jpg';
              }}
            />
          </div>
  
          {/* 📄 Info */}
          <div className="detalle-info">
            <h2>{producto.nombre}</h2>
            <p className="precio">₡{producto.precio}</p>
            <p>{producto.descripcion}</p>
  
            {producto.tiempoPreparacion && (
              <p><strong>⏱ Tiempo de preparación:</strong> {producto.tiempoPreparacion} minutos</p>
            )}
  
            {producto.ingredientes && producto.ingredientes.length > 0 && (
              <div className="ingredientes">
                <strong>Este producto contiene:</strong>
                <ul>
                  {producto.ingredientes.map((ing, idx) => (
                    <li key={idx}>{ing.nombre}</li>
                  ))}
                </ul>
              </div>
            )}
  
            {/* Botones alineados */}
            <div className="botones-detalle">
              <button className="btn-volver" onClick={() => navigate(-1)}>
                ⬅️ Volver
              </button>
              <button className="btn-carrito-detalle" onClick={agregarAlCarrito}>
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <Footer />
    </>
  );
}  
export default ProductoDetalle;
