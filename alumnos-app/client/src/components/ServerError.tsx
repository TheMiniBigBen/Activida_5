import React from 'react';

const ServerError = () => (
  <div style={{
    padding: 40,
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#444',
  }}>
    <h1 style={{ fontSize: 48, marginBottom: 20, color: '#e67e22' }}>500</h1>
    <h2 style={{ marginBottom: 10 }}>Error Interno del Servidor</h2>
    <p style={{ fontSize: 18 }}>
      Algo salió mal en nuestro servidor. Por favor, intenta más tarde.
    </p>
  </div>
);

export default ServerError;
