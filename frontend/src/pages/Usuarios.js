// src/pages/Usuarios.js
import React, { useEffect, useState } from 'react';
import UsuarioService from '../services/UsuarioService';
import Swal from 'sweetalert2';
import './Usuarios.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [emailSeleccionado, setEmailSeleccionado] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Cargar la lista de usuarios activos desde el backend
  const cargarUsuarios = async () => {
    try {
      const res = await UsuarioService.getUsuarios();
      setUsuarios(res.data);
      console.log('Usuarios cargados:', res.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    }
  };

  // Asignar un rol (si el email existe)
  const handleAsignarRol = async () => {
    if (!emailSeleccionado || !rolSeleccionado) {
      Swal.fire('Faltan datos', 'Selecciona usuario y rol', 'warning');
      return;
    }

    try {
      await UsuarioService.getUsuarioPorEmail(emailSeleccionado); // valida existencia
      await UsuarioService.asignarRol(emailSeleccionado, rolSeleccionado);
      Swal.fire('Éxito', 'Rol asignado correctamente', 'success');
      setEmailSeleccionado('');
      setRolSeleccionado('');
      cargarUsuarios();
    } catch (error) {
      console.error('Error al asignar rol:', error);
      Swal.fire('Error', 'No se pudo asignar el rol', 'error');
    }
  };

  // Registro de nuevo usuario
  const handleRegistrarUsuario = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Registrar nuevo usuario',
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="contrasena" class="swal2-input" type="password" placeholder="Contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('contrasena').value;

        // Validación: campos vacíos
        if (!nombre || !email || !password) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return;
        }

        // Validación: contraseña segura
        const regex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!regex.test(password)) {
          Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres y un carácter especial');
          return;
        }

        return { nombre, email, password, rolId: 2 }; // rolId 2: Repostero por defecto
      }
    });

    if (formValues) {
      try {
        // Validar si el email ya existe
        await UsuarioService.getUsuarioPorEmail(formValues.email);
        return Swal.fire('Error', 'El email ya existe, intente con otro', 'error');
      } catch {
        console.log('Email validado: no existe, continuar...');
      }

      try {
        await UsuarioService.registrarUsuario(formValues);
        Swal.fire('Usuario registrado', '', 'success');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    }
  };

  // Desactivación (lógica de eliminación)
  const handleDesactivarUsuario = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se desactivará el usuario y no podrá iniciar sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await UsuarioService.eliminarUsuario(id);
        Swal.fire('Desactivado', 'El usuario ha sido desactivado', 'success');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al desactivar usuario:', error);
        Swal.fire('Error', 'No se pudo desactivar el usuario', 'error');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="usuarios-container">
        <h2>👥 Gestión de Usuarios</h2>
        <button className="btn-crear" onClick={handleRegistrarUsuario}>
          ➕ Nuevo Usuario
        </button>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol?.nombre || 'Sin rol'}</td>
                <td>
                  <button className="btn-desactivar" onClick={() => handleDesactivarUsuario(u.id)}>
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="asignar-rol-box">
          <h3>Asignar Rol</h3>
          <input
            type="email"
            placeholder="Correo electrónico del usuario"
            value={emailSeleccionado}
            onChange={(e) => setEmailSeleccionado(e.target.value)}
          />
          <select
            value={rolSeleccionado}
            onChange={(e) => setRolSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccionar rol --</option>
            <option value="1">Administrador</option>
            <option value="2">Vendedor</option>
            <option value="3">Repostero</option>
          </select>
          <button className="btn-asignar" onClick={handleAsignarRol}>
            Asignar Rol
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Usuarios;
