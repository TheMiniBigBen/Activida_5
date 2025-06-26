import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    padding: 40,
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#444',
  }}>
    <h1 style={{ fontSize: 64, marginBottom: 20, color: '#e74c3c' }}>404</h1>
    <h2 style={{ marginBottom: 10 }}>Página no encontrada</h2>
    <p style={{ marginBottom: 30, fontSize: 18 }}>
      Lo sentimos, la página que buscas no existe.
    </p>
    <Link
      to="/dashboard"
      style={{
        fontSize: 18,
        color: '#1a73e8',
        textDecoration: 'none',
        border: '1px solid #1a73e8',
        padding: '10px 20px',
        borderRadius: 6,
        transition: 'background-color 0.3s, color 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#1a73e8';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#1a73e8';
      }}
    >
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
