import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccesoDenegado = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/iniciar-sesion');
    }, 5000); // Espera de 5 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img
        src="/acceso-denegado.png"
        alt="Acceso Denegado"
        style={styles.image}
      />
      <h1 style={styles.title}>Acceso Denegado</h1>
      <p style={styles.text}>Serás redirigido a iniciar sesión...</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff0f0',
    height: '100vh',
  },
  image: {
    maxWidth: '300px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '36px',
    color: '#cc0000',
    marginBottom: '10px',
  },
  text: {
    fontSize: '18px',
    color: '#555',
  },
};

export default AccesoDenegado;
