import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Clase de utilidad para verificar y gestionar la conexión a la base de datos
 */
class ConexionDB {
  constructor(baseURL = 'http://localhost:8080') {
    this.baseURL = baseURL;
    this.isConnected = false;
  }

  /**
   * Verifica la conexión a la base de datos
   * @returns {Promise<boolean>} True si la conexión es exitosa
   */
  async verificarConexion() {
    try {
      // Intentar una petición simple para verificar conectividad
      const response = await axios.get(`${this.baseURL}/estado`);
      this.isConnected = response.status === 200;
      return this.isConnected;
    } catch (error) {
      console.error('Error verificando conexión a la base de datos:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Muestra una notificación sobre el estado de la conexión
   * @param {boolean} exito - Si la conexión fue exitosa
   * @param {Function} callback - Función a ejecutar después de mostrar la notificación
   */
  mostrarNotificacion(exito, callback = null) {
    if (exito) {
      Swal.fire({
        icon: 'success',
        title: 'Conectado',
        text: 'Conexión a la base de datos establecida correctamente',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        if (callback) callback();
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Sin conexión',
        text: 'No se pudo conectar a la base de datos. Mostrando datos de demostración.',
        confirmButtonText: 'Entendido'
      }).then(() => {
        if (callback) callback();
      });
    }
  }

  /**
   * Inicializa la conexión y configura los interceptores de Axios
   * para manejo de errores de conexión
   */
  inicializar() {
    // Interceptor para peticiones
    axios.interceptors.request.use(
      config => {
        // Añadir token a las peticiones si existe
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Interceptor para respuestas
    axios.interceptors.response.use(
      response => {
        // La respuesta es correcta, actualizar estado de conexión
        this.isConnected = true;
        return response;
      },
      error => {
        if (!error.response) {
          // Error de red o servidor no disponible
          this.isConnected = false;
          console.error('Error de conexión:', error);
        } else if (error.response.status === 401) {
          // Error de autenticación
          localStorage.removeItem('token');
          window.location.href = '/iniciar-sesion';
        }
        return Promise.reject(error);
      }
    );

    // Verificar conexión al inicializar
    this.verificarConexion().then(conectado => {
      if (!conectado) {
        console.warn('No hay conexión inicial a la base de datos');
      }
    });
  }
}

// Exportar instancia única
export default new ConexionDB();