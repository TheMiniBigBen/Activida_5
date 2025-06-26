import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');  // Redirige a login
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#2c3e50' }}>Bienvenido, {usuario?.nombre || 'Usuario'}</h1>
      <p style={{ color: '#555', marginBottom: 40 }}>Email: {usuario?.email}</p>
      <button
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#e74c3c', border: 'none', borderRadius: 5, color: '#fff', cursor: 'pointer', fontSize: 16, transition: 'background-color 0.3s' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c0392b')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e74c3c')}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
