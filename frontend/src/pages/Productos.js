import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const navigate = useNavigate();
  const location = useLocation();

  //Obtener productos del backend al cargar la página
  useEffect(() => {
    console.log('[Productos] Solicitando productos al backend...');
    axios.get('http://localhost:8080/productos/listar')
      .then((res) => {
        console.log('[Productos] Productos obtenidos:', res.data);
        setProductos(res.data);
      })
      .catch((err) => console.error('[Productos] Error al cargar productos:', err));
  }, []);

  // Detectar la categoría en la URL (?categoria=postres, por ejemplo)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('categoria');
    if (cat) {
      console.log('[Productos] Categoría desde URL:', cat);
      setCategoriaSeleccionada(cat);
    }
  }, [location.search]);

  // Obtener todas las categorías únicas
  const obtenerCategorias = () => {
    const categorias = productos.map(p => p.categoria);
    return ['todas', ...new Set(categorias)];
  };

  // Cuando el usuario selecciona otra categoría desde el dropdown
  const handleCategoriaChange = (e) => {
    const nuevaCategoria = e.target.value;
    console.log('[Productos] Cambio manual de categoría:', nuevaCategoria);
    setCategoriaSeleccionada(nuevaCategoria);
    navigate(`/productos?categoria=${nuevaCategoria}`);
  };

  // Filtrado real de productos por categoría
  const productosFiltrados = categoriaSeleccionada === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  // Acción al hacer clic en "Comprar"
  const handleComprar = (producto) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      console.log('[Productos] Usuario no autenticado → redirigiendo...');
      navigate('/iniciar-sesion');
      return;
    }

    try {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const existe = carrito.find(p => p.id_producto === producto.id_producto);

      if (existe) {
        existe.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: 'Producto agregado al carrito ✔️',
        timer: 1500,
        showConfirmButton: false
      });
      
      console.log('[Productos] Producto agregado al carrito:', producto);
    } catch (err) {
      console.error('[Productos] Error al agregar al carrito:', err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="productos-background">
        <div className="productos-container">
          <h2 className="productos-titulo">Nuestros Productos</h2>

          {/* Filtro por categoría */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="filtroCategoria">Filtrar por categoría: </label>
            <select
              id="filtroCategoria"
              value={categoriaSeleccionada}
              onChange={handleCategoriaChange}
              style={{ padding: '0.5rem', borderRadius: '8px' }}
            >
              {obtenerCategorias().map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de productos filtrados */}
          <div className="productos-grid">
            {productosFiltrados.map((producto, index) => {
              console.log(`[Productos] Producto #${index + 1}:`, producto);

              if (!producto.id_producto) {
                console.warn('[Productos] ❌ Producto sin id_producto:', producto);
              }

              return (
                <div key={producto.id_producto} className="producto-card">
                  <img
                    src={producto.imagen_url || '/productos/default.jpg'}
                    alt={producto.nombre}
                    className="imagen-producto"
                    onError={(e) => {
                      console.warn(`[Productos] Imagen rota: ${producto.nombre}, usando default`);
                      e.target.onerror = null;
                      e.target.src = '/productos/default.jpg';
                    }}
                  />

                  <h3>{producto.nombre}</h3>
                  <span>₡{producto.precio}</span>

                  <div className="botones-producto">
                    <Link to={`/productos/${producto.id_producto}`}>
                      <button className="btn-detalle">Detalles</button>
                    </Link>
                    <button className="btn-carrito" onClick={() => handleComprar(producto)}>
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Productos;
