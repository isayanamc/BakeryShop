import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './InventarioAdmin.css';

const InventarioAdmin = () => {
  return (
    <>
      <Navbar />
      <div className="admin-section">
        <h2>Gestión de Inventario</h2>
      </div>
      <Footer />
    </>
  );
};

export default InventarioAdmin;
