import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Alumno {
  _id: string;
  nombre: string;
  email: string;
  carrera?: string;
  semestre?: string;
}

const AlumnosList: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const cargarAlumnos = async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (debouncedSearch) query.append('search', debouncedSearch);
      if (carrera) query.append('carrera', carrera);
      if (semestre) query.append('semestre', semestre);

      const res = await fetch(`http://localhost:5000/api/alumnos?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al obtener alumnos');
      const data = await res.json();
      setAlumnos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, [debouncedSearch, carrera, semestre, token]);

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ color: '#333', marginBottom: 20 }}>Lista de Usuarios</h2>

      <div style={{
        marginBottom: 25,
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: 10,
            flexGrow: 1,
            borderRadius: 5,
            border: '1px solid #ccc',
            fontSize: 16,
            outlineColor: '#4a90e2',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#4a90e2'}
          onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
        />


      </div>

      {error && <p style={{ color: 'red', fontWeight: '600' }}>{error}</p>}

      {loading ? (
        <p style={{ fontSize: 18, color: '#666' }}>Cargando...</p>
      ) : (
        <div style={{
          maxHeight: 450,
          overflowY: 'auto',
          borderRadius: 6,
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          boxShadow: 'inset 0 1px 4px rgb(0 0 0 / 0.1)',
          padding: 10
        }}>
          {alumnos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777', fontSize: 16, marginTop: 40 }}>
              No se encontraron alumnos.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {alumnos.map(a => (
                <li
                  key={a._id}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    fontSize: 16,
                    color: '#222'
                  }}
                >
                  <strong style={{ fontSize: 18, color: '#1a73e8' }}>{a.nombre}</strong>
                  <span>{a.email}</span>
                  <span style={{ fontStyle: 'italic', color: '#555' }}>
                    {a.carrera ?? 'Carrera no especificada'} {a.semestre ? `- ${a.semestre}° semestre` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AlumnosList;
