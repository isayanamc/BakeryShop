import React, { useState, useEffect } from 'react';
import UsuarioService from '../../services/UsuarioService';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Swal from 'sweetalert2';
import './UsuariosAdmin.css';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Cargar usuarios y roles al iniciar
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await UsuarioService.getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      // Asumiendo que tienes un endpoint para obtener roles
      // Si no lo tienes, puedes usar datos mockeados
      const rolesData = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Repostero' },
        { id: 3, nombre: 'Vendedor' }
      ];
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    (usuario.rol?.nombre && usuario.rol.nombre.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Ver detalles de usuario
  const verDetallesUsuario = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    setUsuarioSeleccionado(usuario);
    
    Swal.fire({
      title: `Detalles de ${usuario.nombre}`,
      html: `
        <div class="detalles-usuario">
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Rol:</strong> ${usuario.rol?.nombre || 'No asignado'}</p>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#e83e8c'
    });
  };

  // Eliminar usuario (solo lo ocultamos del frontend)
  const eliminarUsuario = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este usuario será ocultado de la lista",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e83e8c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Simulamos la eliminación (en realidad solo actualizamos la UI)
          await Promise.resolve();
          
          // Actualizamos la lista de usuarios en el frontend
          setUsuarios(usuarios.filter(usuario => usuario.id !== id));
          
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado de la lista.',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario'
          });
        }
      }
    });
  };

  // Mostrar formulario para asignar rol
  const mostrarAsignarRol = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    
    Swal.fire({
      title: `Asignar rol a ${usuario.nombre}`,
      html: `
        <div class="form-group">
          <label for="rol">Seleccione un rol:</label>
          <select id="rol" class="swal2-select">
            ${roles.map(rol => `
              <option value="${rol.id}" ${usuario.rol?.id === rol.id ? 'selected' : ''}>
                ${rol.nombre}
              </option>
            `).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const rolId = document.getElementById('rol').value;
        return { rolId };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // En un escenario real, aquí llamarías al servicio para asignar el rol
          // await UsuarioService.asignarRol(usuario.email, result.value.rolId);
          
          // Simulamos el cambio localmente
          const usuariosActualizados = usuarios.map(u => {
            if (u.id === usuario.id) {
              const rolSeleccionado = roles.find(r => r.id === parseInt(result.value.rolId));
              return { ...u, rol: rolSeleccionado };
            }
            return u;
          });
          
          setUsuarios(usuariosActualizados);
          
          Swal.fire({
            icon: 'success',
            title: 'Rol asignado',
            text: 'El rol ha sido asignado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Error al asignar rol:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo asignar el rol'
          });
        }
      }
    });
  };

  // Mostrar formulario para crear usuario
  const mostrarCrearUsuario = () => {
    Swal.fire({
      title: 'Crear Nuevo Usuario',
      html: `
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" class="swal2-input" placeholder="Nombre completo">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" class="swal2-input" placeholder="correo@ejemplo.com">
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
        </div>
        <div class="form-group">
          <label for="rolCrear">Rol:</label>
          <select id="rolCrear" class="swal2-select">
            ${roles.map(rol => `
              <option value="${rol.id}">${rol.nombre}</option>
            `).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rolId = document.getElementById('rolCrear').value;
        
        // Validaciones básicas
        if (!nombre) return Swal.showValidationMessage('El nombre es obligatorio');
        if (!email) return Swal.showValidationMessage('El email es obligatorio');
        if (!password) return Swal.showValidationMessage('La contraseña es obligatoria');
        if (password.length < 6) return Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
        
        return { nombre, email, password, rolId };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // En un escenario real, aquí llamarías al servicio para crear el usuario
          // await UsuarioService.registrarUsuario({
          //   nombre: result.value.nombre,
          //   email: result.value.email,
          //   password: result.value.password,
          //   rolId: parseInt(result.value.rolId)
          // });
          
          // Simulamos la creación del usuario
          const nuevoUsuario = {
            id: usuarios.length + 1, // Generamos un ID único temporal
            nombre: result.value.nombre,
            email: result.value.email,
            rol: roles.find(r => r.id === parseInt(result.value.rolId))
          };
          
          setUsuarios([...usuarios, nuevoUsuario]);
          
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario ha sido creado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Error al crear usuario:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el usuario'
          });
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="usuarios-admin-container">
        <h2>Gestión de Usuarios</h2>
        
        <div className="panel-control">
          <div className="panel-busqueda">
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="busqueda-input"
            />
          </div>
          <button onClick={mostrarCrearUsuario} className="btn-crear-usuario">
            Crear Usuario
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : (
          <div className="tabla-container">
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
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>#{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`rol-badge rol-${usuario.rol?.nombre?.toLowerCase() || 'default'}`}>
                          {usuario.rol?.nombre || 'No asignado'}
                        </span>
                      </td>
                      <td className="acciones-column">
                        <button
                          onClick={() => verDetallesUsuario(usuario.id)}
                          className="btn-detalles"
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => mostrarAsignarRol(usuario.id)}
                          className="btn-asignar-rol"
                          title="Asignar rol"
                        >
                          Rol
                        </button>
                        <button
                          onClick={() => eliminarUsuario(usuario.id)}
                          className="btn-eliminar"
                          title="Eliminar usuario"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-usuarios">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UsuariosAdmin;