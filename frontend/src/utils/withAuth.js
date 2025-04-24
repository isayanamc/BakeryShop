import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = {
  1: 'Administrador',
  2: 'Repostero',
  3: 'Vendedor'
};

const withAuth = (WrappedComponent, requiredRole = null) => {
  const AuthComponent = (props) => {
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const storedUser = localStorage.getItem('usuario');

      if (!storedUser) {
        console.warn('[withAuth] No hay sesión iniciada. Redirigiendo a /iniciar-sesion');
        navigate('/iniciar-sesion');
        return;
      }

      try {
        const usuario = JSON.parse(storedUser);
        const nombreRol = ROLES[usuario.rol];

        if (requiredRole) {
          if (nombreRol !== requiredRole) {
            console.warn(
              `[withAuth] Acceso denegado. Usuario con rol "${nombreRol}" intentó acceder a ruta protegida para "${requiredRole}"`
            );
            navigate('/acceso-denegado');
            return;
          } else {
            console.info(`[withAuth] Acceso autorizado como ${nombreRol}`);
          }
        } else {
          console.info(`[withAuth] Acceso autorizado sin requerir rol específico`);
        }

        setAuthorized(true);
      } catch (error) {
        console.error('[withAuth] Error al procesar usuario desde localStorage:', error);
        navigate('/iniciar-sesion');
      }
    }, [navigate]);

    if (authorized === null) return <p>Cargando...</p>;

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
