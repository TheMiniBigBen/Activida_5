// src/components/EstudiantesList.tsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Estudiante {
  _id: string;
  nombre: string;
  apellido: string;
  Carrera: string;
  matricula: string;
  fechaCreacion?: string;
}

const CarrerasOpciones = ['Sistemas', 'Electrónica', 'Industrial', 'Civil'];

const EstudiantesList: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [CarreraFiltro, setCarreraFiltro] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Formulario para crear nuevo estudiante
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');
  const [nuevoCarrera, setNuevoCarrera] = useState(CarrerasOpciones[0]);
  const [creando, setCreando] = useState(false);

  // Modo edición
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editApellido, setEditApellido] = useState('');
  const [editCarrera, setEditCarrera] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

    const cargarEstudiantes = async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    try {
        const query = new URLSearchParams();
        if (debouncedSearch) query.append('search', debouncedSearch);
        if (CarreraFiltro) query.append('Carrera', CarreraFiltro);  // Cambié 'Carrera' a 'Carrera'

        const url = `http://localhost:5000/api/estudiantes?${query.toString()}`;
        console.log('URL consulta estudiantes:', url);

        const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al obtener estudiantes');

        const data = await res.json();
        setEstudiantes(data);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
    };


  useEffect(() => {
    cargarEstudiantes();
  }, [debouncedSearch, CarreraFiltro, token]);

  const crearEstudiante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoApellido.trim()) {
      setError('Nombre y apellido son obligatorios');
      return;
    }

    setCreando(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoNombre.trim(),
          apellido: nuevoApellido.trim(),
          Carrera: nuevoCarrera,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || 'Error al crear estudiante');
      }

      setNuevoNombre('');
      setNuevoApellido('');
      setNuevoCarrera(CarrerasOpciones[0]);
      cargarEstudiantes();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  };

  const eliminarEstudiante = async (id: string) => {
    if (!window.confirm('¿Eliminar este estudiante?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/estudiantes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar estudiante');
      cargarEstudiantes();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const comenzarEdicion = (e: Estudiante) => {
    setEditandoId(e._id);
    setEditNombre(e.nombre);
    setEditApellido(e.apellido);
    setEditCarrera(e.Carrera);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const guardarEdicion = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/estudiantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          apellido: editApellido.trim(),
          Carrera: editCarrera,
        }),
      });
      if (!res.ok) throw new Error('Error al actualizar estudiante');
      setEditandoId(null);
      cargarEstudiantes();
    } catch (e: any) {
      setError(e.message);
    }
  };

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
      <h2 style={{ color: '#333', marginBottom: 20 }}>Estudiantes</h2>

      {/* Filtros */}
      <div style={{ marginBottom: 25, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o matrícula"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: 10, flexGrow: 1, borderRadius: 5,
            border: '1px solid #ccc', fontSize: 16, outlineColor: '#4a90e2'
          }}
        />
        <select
          value={CarreraFiltro}
          onChange={e => setCarreraFiltro(e.target.value)}
          style={{
            padding: 10, borderRadius: 5, border: '1px solid #ccc',
            fontSize: 16, minWidth: 160, outlineColor: '#4a90e2'
          }}
        >
          <option value="">Todos los Carreras</option>
          {CarrerasOpciones.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Formulario nuevo estudiante */}
      <form onSubmit={crearEstudiante} style={{
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: 15 }}>Agregar nuevo estudiante</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required />
          <input type="text" placeholder="Apellido" value={nuevoApellido} onChange={e => setNuevoApellido(e.target.value)} required />
          <select value={nuevoCarrera} onChange={e => setNuevoCarrera(e.target.value)}>
            {CarrerasOpciones.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button type="submit" disabled={creando}>
            {creando ? 'Creando...' : 'Agregar'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red', fontWeight: '600' }}>{error}</p>}

      {/* Lista estudiantes */}
      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <div style={{ maxHeight: 450, overflowY: 'auto', backgroundColor: '#fff', padding: 10 }}>
          {estudiantes.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777' }}>No se encontraron estudiantes.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {estudiantes.map(e => (
                <li key={e._id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                  {editandoId === e._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <input value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                      <input value={editApellido} onChange={e => setEditApellido(e.target.value)} />
                      <select value={editCarrera} onChange={e => setEditCarrera(e.target.value)}>
                        {CarrerasOpciones.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => guardarEdicion(e._id)}>Guardar</button>
                        <button onClick={cancelarEdicion}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{e.nombre} {e.apellido}</strong>
                      <div>Matrícula: {e.matricula}</div>
                      <div>Carrera: {e.Carrera}</div>
                      <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                        <button onClick={() => comenzarEdicion(e)}>Editar</button>
                        <button onClick={() => eliminarEstudiante(e._id)} style={{ backgroundColor: '#e84141', color: '#fff' }}>Eliminar</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EstudiantesList;
