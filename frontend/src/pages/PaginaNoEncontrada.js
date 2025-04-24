import React from 'react';
import { Link } from 'react-router-dom';
import './PaginaNoEncontrada.css';

const PaginaNoEncontrada = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Página No Encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <div className="bakery-image">
      <img src="/errorpage.jpg" alt="Página no encontrada" />
      </div>
      <p>¿Quizás prefieras probar uno de nuestros deliciosos productos?</p>
      <div className="not-found-buttons">
        <Link to="/" className="btn-home">Volver al Inicio</Link>
        <Link to="/productos" className="btn-productos">Ver Productos</Link>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;