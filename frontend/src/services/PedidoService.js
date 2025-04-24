import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const PedidoService = {
  /**
   * Obtiene todos los pedidos
   * @returns {Promise} Promise con la respuesta de la API
   */
  getTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/listar`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error('Error al obtener pedidos');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en el servicio de pedidos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un pedido por su ID
   * @param {number} id - ID del pedido
   * @returns {Promise} Promise con la respuesta de la API
   */
  getPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al obtener pedido con ID ${id}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un pedido
   * @param {number} id - ID del pedido
   * @returns {Promise} Promise con la respuesta de la API
   */
  getDetalles: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${id}/detalles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al obtener detalles del pedido ${id}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo detalles del pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de un pedido
   * @param {number} id - ID del pedido
   * @param {string} estado - Nuevo estado (Pendiente, En_proceso, Entregado, Cancelado)
   * @returns {Promise} Promise con la respuesta de la API
   */
  actualizarEstado: async (id, estado) => {
    try {
      const response = await axios.patch(
        `${API_URL}/pedidos/${id}/estado?nuevoEstado=${estado}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Error al actualizar estado del pedido ${id}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error actualizando estado del pedido ${id}:`, error);
      throw error;
    }
  },

  /**
   * Asigna un repostero a un pedido
   * @param {number} idPedido - ID del pedido
   * @param {number} idRepostero - ID del repostero a asignar
   * @returns {Promise} Promise con la respuesta de la API
   */
  asignarRepostero: async (idPedido, idRepostero) => {
    try {
      const response = await axios.post(
        `${API_URL}/pedidos/${idPedido}/asignar-repostero`,
        { idUsuario: idRepostero },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Error al asignar repostero al pedido ${idPedido}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error asignando repostero al pedido ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene pedidos filtrados por estado
   * @param {string} estado - Estado de los pedidos a filtrar
   * @returns {Promise} Promise con la respuesta de la API
   */
  filtrarPorEstado: async (estado) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/filtrar?estado=${estado}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al filtrar pedidos por estado ${estado}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error filtrando pedidos por estado ${estado}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene pedidos asignados a un usuario específico
   * @param {number} idUsuario - ID del usuario (repostero)
   * @returns {Promise} Promise con la respuesta de la API
   */
  getPedidosAsignados: async (idUsuario) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/asignados/${idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Error al obtener pedidos asignados al usuario ${idUsuario}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo pedidos asignados al usuario ${idUsuario}:`, error);
      throw error;
    }
  }
};

export default PedidoService;