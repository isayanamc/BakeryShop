import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Registro.css";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


function Registro() {
  // Estados
  const [tipo, setTipo] = useState("cliente");
  const [roles, setRoles] = useState([]);
  const [rol, setRol] = useState("");
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    calle: "",
    ciudad: "",
    codigoPostal: "",
  });

  // Cargar roles cuando se selecciona tipo "usuario"
  useEffect(() => {
    if (tipo === "usuario") {
      axios
        .get("http://localhost:8080/roles")
        .then((res) => setRoles(res.data))
        .catch((err) => {
          console.error("Error al cargar roles:", err);
          setError("No se pudieron cargar los roles. Intente más tarde.");
        });
    }
  }, [tipo]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Formateo para teléfono (solo permitir números y guion)
    if (name === "telefono") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) {
        value = value.slice(0, 4) + "-" + value.slice(4, 8);
      }
    }

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validar campos antes de enviar
  const validarCampos = () => {
    const nuevosErrores = {};
    
    // Validaciones básicas
    if (!formulario.nombre.trim())
      nuevosErrores.nombre = "El nombre es obligatorio";
    
    if (!formulario.email.trim())
      nuevosErrores.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formulario.email))
      nuevosErrores.email = "El formato de email no es válido";
    
    if (!formulario.password.trim())
      nuevosErrores.password = "La contraseña es obligatoria";
    else if (formulario.password.length < 6)
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    
    if (!formulario.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio";
    
    if (!formulario.calle.trim())
      nuevosErrores.calle = "La calle es obligatoria";
    
    if (!formulario.ciudad.trim())
      nuevosErrores.ciudad = "La ciudad es obligatoria";
    
    if (!formulario.codigoPostal.trim())
      nuevosErrores.codigoPostal = "El código postal es obligatorio";
    
    // Validación adicional para usuarios
    if (tipo === "usuario" && !rol)
      nuevosErrores.rol = "Debe seleccionar un rol";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrores({});
    setError("");

    // Validar campos
    if (!validarCampos()) {
      setLoading(false);
      return;
    }

    try {
      // Limpiar teléfono (quitar guion)
      const telefonoLimpio = formulario.telefono.replace(/-/g, "");

      // Preparar datos según el tipo de registro
      let data = {
        nombre: formulario.nombre,
        email: formulario.email,
        password: formulario.password,
        telefono: telefonoLimpio,
        calle: formulario.calle,
        ciudad: formulario.ciudad,
        codigoPostal: formulario.codigoPostal 
      };

      let url = "";
      
      // Determinar URL y ajustar datos según tipo de registro
      if (tipo === "usuario") {
        data.rolId = parseInt(rol); 
        url = "http://localhost:8080/usuarios/registrar";
      } else {
        url = "http://localhost:8080/clientes/registrar";
      }

      console.log("Enviando datos:", data);
      
      // Realizar petición
      const response = await axios.post(url, data);
      console.log("Respuesta:", response.data);
      
      // Mostrar mensaje de éxito
      Swal.fire({
        title: "¡Registro exitoso!",
        text: tipo === "cliente" 
          ? "Cliente registrado correctamente" 
          : "Usuario del equipo registrado correctamente",
        icon: "success",
        confirmButtonText: "Continuar"
      }).then(() => {
        // Redireccionar a inicio de sesión
        window.location.href = "/iniciar-sesion";
      });
    } catch (err) {
      console.error("Error completo:", err);
      
      // Manejar diferentes tipos de respuestas de error
      if (err.response) {
        console.error("Respuesta de error:", err.response.data);
        
        if (typeof err.response.data === "object") {
          // Errores de validación de campos
          setErrores(err.response.data);
        } else if (typeof err.response.data === "string") {
          // Mensaje de error del servidor
          setError(err.response.data);
        } else {
          setError(`Error ${err.response.status}: No se pudo completar el registro`);
        }
      } else if (err.request) {
        // Error de conexión
        setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        // Otro tipo de error
        setError("Ocurrió un error inesperado. Intente nuevamente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="registro-container">
      <h2>{tipo === "cliente" ? "Registro de Cliente" : "Registro de Usuario del Equipo"}</h2>

      {error && <div className="error-general">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Tipo de cuenta */}
        <div className="form-group">
          <label>¿Quién eres?</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
          >
            <option value="cliente">Soy cliente</option>
            <option value="usuario">Soy parte del equipo</option>
          </select>
        </div>

        {/* Rol (solo para usuarios) */}
        {tipo === "usuario" && (
          <div className="form-group">
            <label>Rol:</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">-- Seleccionar rol --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
            {errores.rol && <span className="error">{errores.rol}</span>}
            {errores.rolId && <span className="error">{errores.rolId}</span>}
          </div>
        )}

        {/* Campos del formulario */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.email && <span className="error">{errores.email}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.password && <span className="error">{errores.password}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formulario.telefono}
            onChange={handleChange}
            maxLength={9} // 4 dígitos + guion + 4 dígitos
            placeholder="1234-5678"
            disabled={loading}
            required
          />
          {errores.telefono && <span className="error">{errores.telefono}</span>}
        </div>

        <div className="form-group">
          <label>Calle:</label>
          <input
            type="text"
            name="calle"
            value={formulario.calle}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.calle && <span className="error">{errores.calle}</span>}
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={formulario.ciudad}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.ciudad && <span className="error">{errores.ciudad}</span>}
        </div>

        <div className="form-group">
          <label>Código Postal:</label>
          <input
            type="text"
            name="codigoPostal"
            value={formulario.codigoPostal}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errores.codigoPostal && <span className="error">{errores.codigoPostal}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
    <Footer />
  </>
  );
}

export default Registro;