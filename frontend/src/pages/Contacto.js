import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Contacto.css';

const Contacto = () => {
  return (
    <>
      <Navbar />
      <div className="contacto-background">
        <div className="contacto-container">
          <h1 className="contacto-titulo">Contáctanos</h1>
          <p className="contacto-subtitulo">Estamos aquí para escucharte con amor y azúcar ✉️🍰</p>

          <form className="contacto-form">
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu correo electrónico" required />
            <textarea placeholder="Tu mensaje..." rows="5" required></textarea>
            <button type="submit">Enviar Mensaje</button>
          </form>

          <div className="contacto-info">
            <p><strong>📧 Email:</strong> contacto@bakeryshop.com</p>
            <p><strong>📞 Teléfono:</strong> +506 8888-8888</p>
            <p><strong>🕗 Horario:</strong> Martes a Domingo, 8:00 am - 6:00 pm</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contacto;
