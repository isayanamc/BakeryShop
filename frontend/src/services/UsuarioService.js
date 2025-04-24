// src/services/UsuarioService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/usuarios';

// Datos mock para usar si el backend no está disponible
const usuariosMock = [
  {
    id: 1,
    nombre: 'Admin Sistema',
    email: 'admin@bakeryshop.com',
    rol: { id: 1, nombre: 'Administrador' }
  },
  {
    id: 2,
    nombre: 'Carlos Repostero',
    email: 'carlos@bakeryshop.com',
    rol: { id: 2, nombre: 'Repostero' }
  },
  {
    id: 3,
    nombre: 'María Vendedora',
    email: 'maria@bakeryshop.com',
    rol: { id: 3, nombre: 'Vendedor' }
  }
];

// Función para determinar si usar datos mock o hacer petición real
const deberiaUsarMock = () => {
  // Puedes cambiar esta lógica según necesites
  return false; // Cambiar a true para usar datos mock
};

// Obtener la lista de usuarios activos
const getUsuarios = async () => {
  if (deberiaUsarMock()) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: usuariosMock,
      status: 200
    };
  }
  
  try {
    const response = await axios.get(`${API_URL}/listar`);
    return response;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    
    // Si falla la petición real, usamos los datos mock como respaldo
    return {
      data: usuariosMock,
      status: 200
    };
  }
};

// Registrar un nuevo usuario
const registrarUsuario = async (usuario) => {
  if (deberiaUsarMock()) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: { mensaje: "Usuario registrado correctamente" },
      status: 200
    };
  }
  
  try {
    return await axios.post(`${API_URL}/registrar`, usuario);
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
};

// Asignar rol a un usuario
const asignarRol = async (email, idRol) => {
  if (deberiaUsarMock()) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: { mensaje: "Rol asignado correctamente" },
      status: 200
    };
  }
  
  try {
    return await axios.post(`${API_URL}/asignar-rol`, { email, idRol });
  } catch (error) {
    console.error("Error asignando rol:", error);
    throw error;
  }
};

// Obtener un usuario por su email
const getUsuarioPorEmail = async (email) => {
  if (deberiaUsarMock()) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    const usuario = usuariosMock.find(u => u.email === email);
    
    if (usuario) {
      return {
        data: usuario,
        status: 200
      };
    } else {
      throw new Error("Usuario no encontrado");
    }
  }
  
  try {
    return await axios.get(`${API_URL}/por-email`, { params: { email } });
  } catch (error) {
    console.error("Error obteniendo usuario por email:", error);
    throw error;
  }
};

// "Eliminar" (desactivar) usuario - simulado
const eliminarUsuario = async (id) => {
  // Solo devolvemos una promesa resuelta para simular éxito
  return Promise.resolve({
    data: { mensaje: "Usuario eliminado correctamente" },
    status: 200
  });
};

export default {
  getUsuarios,
  registrarUsuario,
  asignarRol,
  eliminarUsuario,
  getUsuarioPorEmail
};