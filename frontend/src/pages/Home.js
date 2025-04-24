import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/productos/destacados")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Productos destacados:", data);
        setProductos(data);
      })
      .catch((error) => {
        console.error("❌ Error al obtener productos:", error);
        setError("No se pudieron cargar los productos destacados.");
      });
  }, []);

  return (
    <>
      <Navbar />
  
      <div className="home-container">
        {/* Hero */}
        <section className="hero-section" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bakery-hero.png)` }}>
      <div className="hero-content">
        <h1>Tu antojo acaba de encontrar su lugar</h1>
        <p>
          Brownies, panes y dulces recién horneados que enamoran<br />
          ¡Descubrí nuestros productos destacados y llevate tu favorito hoy mismo!
        </p>
        <a href="#destacados" className="btn-shop-now">Comprar Ahora</a>
      </div>
    </section>

  

      {/* Productos Destacados */}
      <section className="featured-products" id="destacados">
        <h2>Productos Destacados</h2>

        {error && <div className="error-alert">{error}</div>}

        <div className="products-grid">
          {productos.length > 0 ? (
            productos.map(producto => (
              <div className="product-card" key={producto.id_producto}>
                <div className="product-image">
                <img
                  src={producto.imagen_url || "/productos/default.jpg"}
                  alt={producto.nombre}
                  onError={(e) => {
                    console.warn(`[Home] Imagen no encontrada para ${producto.nombre}, usando default.jpg`);
                    e.target.onerror = null;
                    e.target.src = "/productos/default.jpg";
                  }}
                />
                </div>
                <div className="product-details">
                  <h3>{producto.nombre}</h3>
                  <p className="product-price">₡{producto.precio.toFixed(2)}</p>
                  <a href={`/producto/${producto.id_producto}`} className="btn-view-product">Ver Detalles</a>
                </div>
              </div>
            ))
          ) : (
            !error && <p className="error-message">Cargando productos...</p>
          )}
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <div className="about-content">
          <h2>Sobre Nosotros</h2>
          <p>
            En Bakery Shop nos especializamos en crear momentos dulces. Nuestros productos son preparados con ingredientes frescos y mucho amor. Ya sea un pan artesanal, una galleta chispas o un pastel para una ocasión especial, cada bocado está pensado para dejarte con una sonrisa.
          </p>
          <a href="/nosotros" className="btn-learn-more">Conocé más</a>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials-section">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>“¡El pan de yema es mi favorito! Sabe igual que el de mi abuelita. 💛”</p>
            <span className="customer-name">– Marcela C.</span>
          </div>
          <div className="testimonial-card">
            <p>“Los brownies me cambiaron la vida. Suaves, húmedos y perfectos.”</p>
            <span className="customer-name">– Diego R.</span>
          </div>
          <div className="testimonial-card">
            <p>“El pedido llegó rápido y todo estaba fresco. Repetiré sin duda.”</p>
            <span className="customer-name">– Laura M.</span>
          </div>
        </div>
        </section>
      <Footer />
    </div>
  </>
);
}
export default Home;

