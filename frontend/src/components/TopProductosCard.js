import React, { useEffect, useState } from 'react';
import { obtenerProductosMasVendidos } from '../services/ReporteService';

const TopProductosCard = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerProductosMasVendidos();
      setProductos(data);
    };
    fetchData();
  }, []);

  return (
    <div className="reporte-card">
      <h3>🧁 Productos Más Vendidos</h3>
      {productos.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <ul>
          {productos.map((p, index) => (
            <li key={index}>
              <strong>{p.nombreProducto}</strong> — {p.cantidadVendida} vendidos
              {p.totalGenerado && <> — ₡{p.totalGenerado.toLocaleString()}</>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopProductosCard;
