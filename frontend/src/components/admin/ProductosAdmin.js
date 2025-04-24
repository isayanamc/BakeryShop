import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './ProductosAdmin.css';

const ProductosAdmin = () => {
  return (
    <>
      <Navbar />
      <div className="admin-section">
        <h2>Gestión de Productos</h2>
      </div>
      <Footer />
    </>
  );
};

export default ProductosAdmin;
