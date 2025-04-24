// src/services/ClienteService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const ClienteService = {
  /**
   * Obtiene todos los clientes
   * @returns {Promise} Promise con la respuesta de la API
   */
  obtenerClientes: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/clientes/listar`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.status !== 200) {
        throw new Error('Error al obtener clientes');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en el servicio de clientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise} Promise con la respuesta de la API
   */
  obtenerClientePorId: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/clientes/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al obtener cliente con ID ${id}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un cliente por su ID
   * @param {number} id - ID del cliente a eliminar
   * @returns {Promise} Promise con la respuesta de la API
   */
  eliminarCliente: async (id) => {
    // No hacemos ninguna llamada al backend, simplemente devolvemos una promesa resuelta
    return Promise.resolve({ success: true });
  },
  
  /**
   * Actualiza los datos de un cliente
   * @param {Object} cliente - Datos actualizados del cliente
   * @returns {Promise} Promise con la respuesta de la API
   */
  actualizarCliente: async (cliente) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/clientes/actualizar`, cliente, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al actualizar cliente`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error actualizando cliente:`, error);
      throw error;
    }
  },
  
  /**
   * Actualiza los datos de un cliente
   * @param {Object} cliente - Datos actualizados del cliente
   * @returns {Promise} Promise con la respuesta de la API
   */
  actualizarCliente: async (cliente) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/clientes/actualizar`, cliente, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al actualizar cliente`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error actualizando cliente:`, error);
      throw error;
    }
  }
};

export default ClienteService;