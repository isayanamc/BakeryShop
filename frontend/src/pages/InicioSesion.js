import React, { useState, useContext } from 'react';
import { UserContext } from '../utils/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import './InicioSesion.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InicioSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUsuario } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor ingresa tu correo y contraseña.'
      });
      return;
    }

    const loginData = { email, password };

    try {
      const respuesta = await axios.get(`http://localhost:8080/auth/tipo-usuario?email=${email}`);
      const tipo = respuesta.data.tipo;

      if (tipo === 'usuario') {
        const loginResponse = await axios.post('http://localhost:8080/usuarios/login', loginData);
        const datos = loginResponse.data.usuario;
        const token = loginResponse.data.token;

        if (!datos.rol?.nombre) throw new Error('El usuario no tiene rol asignado');

        const datosNormalizados = { ...datos, rol: datos.rol.id };

        localStorage.setItem('usuario', JSON.stringify(datosNormalizados));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUsuario(datosNormalizados);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada como ${datos.rol.nombre}`,
          showConfirmButton: false,
          timer: 2000
        });

        setTimeout(() => {
          const rol = datos.rol.nombre.toUpperCase();
          if (rol === 'ADMINISTRADOR') window.location.href = '/perfil-admin';
          else if (rol === 'VENDEDOR') window.location.href = '/perfil-vendedor';
          else if (rol === 'REPOSTERO') window.location.href = '/perfil-repostero';
          else window.location.href = '/';
        }, 2000);

      } else if (tipo === 'cliente') {
        const clienteResponse = await axios.post('http://localhost:8080/clientes/login', loginData);
        const datos = clienteResponse.data.usuario;
        const token = clienteResponse.data.token;

        // Asegurarse de guardar y configurar correctamente
        const datosConRol = { ...datos, rol: 0 };

        localStorage.setItem('usuario', JSON.stringify(datosConRol));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUsuario(datosConRol);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Sesión iniciada correctamente',
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => {
          window.location.href = '/perfil-cliente';
        }, 1500);
      }

    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'El correo no está registrado o las credenciales son inválidas.'
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">Ingresar</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default InicioSesion;
