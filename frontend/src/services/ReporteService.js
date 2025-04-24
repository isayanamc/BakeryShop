import axios from 'axios';

const API_URL = 'http://localhost:8080/reportes';

export const obtenerProductosMasVendidos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos/mas-vendidos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    return [];
  }
};
