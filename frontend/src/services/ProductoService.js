import axios from 'axios';

const API_URL = 'http://localhost:8080';

const ProductoService = {
  /**
   * Obtiene todos los productos asignados al repostero
   * @returns {Promise} Promise con la respuesta de la API o datos de respaldo
   */
  obtenerProductosRepostero: async () => {
    try {
      const response = await axios.get(`${API_URL}/productos/repostero`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos del repostero:', error);
      
      // Datos de respaldo en caso de error
      return [
        {
          id: 1,
          nombre: 'Pastel de Chocolate',
          estado: 'PENDIENTE',
          tiempoPreparacion: 45,
          fechaCreacion: new Date().toISOString(),
          ingredientes: ['Harina', 'Chocolate', 'Huevos', 'Azúcar']
        },
        {
          id: 2,
          nombre: 'Croissants',
          estado: 'COMPLETADO',
          tiempoPreparacion: 120,
          fechaCreacion: new Date(Date.now() - 86400000).toISOString(),
          ingredientes: ['Harina', 'Mantequilla', 'Levadura', 'Sal']
        }
      ];
    }
  },

  /**
   * Marca un producto como preparado
   * @param {number} id ID del producto
   * @returns {Promise} Promise con la respuesta de la API
   */
  marcarProductoPreparado: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/productos/${id}/completar`);
      return response.data;
    } catch (error) {
      console.error(`Error marcando producto #${id} como preparado:`, error);
      throw error;
    }
  },

  /**
   * Obtiene los ingredientes con bajo stock
   * @returns {Promise} Promise con la respuesta de la API o datos de respaldo
   */
  obtenerIngredientesBajoStock: async () => {
    try {
      const response = await axios.get(`${API_URL}/inventario/bajo-stock`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ingredientes con bajo stock:', error);
      
      // Datos de respaldo en caso de error
      return [
        { id: 1, nombre: 'Harina', cantidad: 2.5, unidad: 'kg' },
        { id: 2, nombre: 'Chocolate', cantidad: 0.8, unidad: 'kg' }
      ];
    }
  }
};

export default ProductoService;