import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../utils/UserContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useContext(UserContext);

  //  Navegación según el rol del usuario autenticado
  const irAMiPerfil = () => {
    if (!usuario || usuario.rol === undefined || usuario.rol === null) return;

    switch (usuario.rol) {
      case 0: navigate('/perfil-cliente'); break;
      case 1: navigate('/perfil-admin'); break;
      case 2: navigate('/perfil-repostero'); break;
      case 3: navigate('/perfil-vendedor'); break;
      default: navigate('/');
    }
  };

  // Cierre de sesión y limpieza del estado + notificación
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('carrito');
    setUsuario(null);

    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Estado local para mostrar cuántos productos distintos hay en el carrito
  const [carrito, setCarrito] = useState([]);

  // Escucha cambios en localStorage y mantiene el carrito actualizado
  useEffect(() => {
    const obtenerCarrito = () => {
      const data = JSON.parse(localStorage.getItem('carrito')) || [];
      setCarrito(data);
    };

    obtenerCarrito();

    // Se actualiza al cambiar pestaña o en cualquier modificación
    const listener = () => obtenerCarrito();
    window.addEventListener('storage', listener);

    return () => window.removeEventListener('storage', listener);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span>Bakery Shop</span>
        </Link>
      </div>

      {/* Navegación */}
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>

      {/* Sección de sesión / carrito */}
      <div className="navbar-auth">
        {usuario ? (
          <>
            {usuario.rol === 0 && (
              <div className="navbar-cart">
                <Link to="/carrito" className="icono-carrito">
                  🛒
                  {carrito.length > 0 && (
                    <span className="burbuja-carrito">{carrito.length}</span>
                  )}
                </Link>
              </div>
            )}
            <button className="btn-profile" onClick={irAMiPerfil}>Mi Perfil</button>
            <button className="btn-logout" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/iniciar-sesion" className="btn-login">Iniciar Sesión</Link>
            <Link to="/registro" className="btn-register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
