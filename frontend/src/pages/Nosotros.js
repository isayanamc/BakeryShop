import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Nosotros.css';

const Nosotros = () => {
  return (
    <>
      <Navbar />
      <div className="nosotros-background">
        <div className="nosotros-container">
          <h1 className="nosotros-titulo">Nuestra historia, nuestra pasión</h1>
          <div className="nosotros-image-container">
            <img
              src="/about-bakery.jpg"
              alt="Panadería artesanal"
              className="nosotros-image"
            />
          </div>
          <h2 className="nosotros-subtitulo">Más que pan, creamos momentos</h2>
          <p className="nosotros-texto">
            En <strong>Bakery Shop</strong> horneamos memorias dulces y momentos inolvidables desde hace más de una década...
          </p>
          <p className="nosotros-texto">
            Somos una panadería familiar que combina recetas de antaño con el toque innovador de nuestras manos...
          </p>
          <p className="nosotros-texto">
            Creemos en la magia de compartir: un pan es más rico cuando une personas...
          </p>
          <div className="nosotros-firma">
            Gracias por confiar en nosotros y ser parte de esta historia que cada día seguimos horneando contigo 🥐✨
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Nosotros;
