import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
}

interface Mensaje {
  _id: string;
  remitente: Usuario;
  destinatario: Usuario;
  contenido: string;
  createdAt: string;
}

const Mensajes: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [destinatariosIds, setDestinatariosIds] = useState<string[]>([]);
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  const cargarUsuarios = async () => {
    if (!token) return;
    setLoadingUsuarios(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/alumnos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const cargarMensajes = async () => {
    if (!token) return;
    setLoadingMensajes(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/mensajes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error cargando mensajes');
      const data = await res.json();
      setMensajes(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMensajes(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarMensajes();
  }, [token]);

  const toggleDestinatario = (id: string) => {
    setDestinatariosIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

    const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (destinatariosIds.length === 0 || !contenido.trim()) {
        setError('Selecciona al menos un destinatario y escribe un mensaje.');
        return;
    }
    setError('');
    try {
        const res = await fetch('http://localhost:5000/api/mensajes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinatarios: destinatariosIds, contenido }),
        });
        if (!res.ok) throw new Error('Error enviando mensaje');

        setContenido('');
        setDestinatariosIds([]);
        cargarMensajes();
    } catch (e: any) {
        setError(e.message);
    }
    };

  return (
    <div style={{
      maxWidth: 650,
      margin: '40px auto',
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#fefefe',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: '#333',
    }}>
      <h2 style={{ marginBottom: 25, color: '#1a73e8' }}>Mensajes</h2>

      <form onSubmit={handleEnviar}>
        <fieldset style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 15,
          marginBottom: 20,
          backgroundColor: '#fafafa'
        }}>
          <legend style={{ fontWeight: 'bold', marginBottom: 12 }}>Selecciona destinatarios:</legend>

          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: 6,
              maxHeight: 140,
              overflowY: 'auto',
              padding: 12,
              marginBottom: 12,
              backgroundColor: '#fff',
            }}
          >
            {loadingUsuarios ? (
              <p style={{ color: '#666' }}>Cargando usuarios...</p>
            ) : usuarios.length === 0 ? (
              <p style={{ color: '#999' }}>No hay usuarios disponibles</p>
            ) : (
              usuarios.map(u => (
                <label
                  key={u._id}
                  style={{
                    display: 'block',
                    marginBottom: 6,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={destinatariosIds.includes(u._id)}
                    onChange={() => toggleDestinatario(u._id)}
                    style={{ marginRight: 8, cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '600' }}>{u.nombre}</span> ({u.email})
                </label>
              ))
            )}
          </div>

          <textarea
            placeholder="Escribe tu mensaje aquí..."
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            required
            style={{
              width: '100%',
              height: 90,
              padding: 12,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 16,
              resize: 'vertical',
              outlineColor: '#1a73e8',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#1a73e8')}
            onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            disabled={loadingUsuarios || loadingMensajes}
            style={{
              marginTop: 12,
              padding: '12px 0',
              width: '100%',
              backgroundColor: '#1a73e8',
              color: 'white',
              fontWeight: '600',
              fontSize: 18,
              border: 'none',
              borderRadius: 6,
              cursor: loadingUsuarios || loadingMensajes ? 'not-allowed' : 'pointer',
              opacity: loadingUsuarios || loadingMensajes ? 0.6 : 1,
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => {
              if (!loadingUsuarios && !loadingMensajes) e.currentTarget.style.backgroundColor = '#155ab6';
            }}
            onMouseLeave={e => {
              if (!loadingUsuarios && !loadingMensajes) e.currentTarget.style.backgroundColor = '#1a73e8';
            }}
          >
            Enviar
          </button>
        </fieldset>
      </form>

      {error && <p style={{ color: 'red', marginTop: 10, fontWeight: '600' }}>{error}</p>}

      {loadingMensajes ? (
        <p style={{ color: '#666', fontSize: 18 }}>Cargando mensajes...</p>
      ) : (
        <ul style={{ marginTop: 20, maxHeight: 300, overflowY: 'auto', paddingLeft: 0, listStyle: 'none' }}>
          {mensajes.length === 0 ? (
            <li style={{ textAlign: 'center', color: '#777' }}>No hay mensajes para mostrar.</li>
          ) : (
            mensajes.map(m => (
              <li
                key={m._id}
                style={{
                  marginBottom: 20,
                  padding: 12,
                  borderRadius: 8,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  backgroundColor: '#fafafa',
                  border: '1px solid #ddd',
                  fontSize: 15,
                  lineHeight: 1.4,
                }}
              >
                <b>De:</b> <span style={{ color: '#1a73e8' }}>{m.remitente.nombre}</span> (<i>{m.remitente.email}</i>)<br />
                <b>Para:</b> <span style={{ color: '#1a73e8' }}>{m.destinatario.nombre}</span> (<i>{m.destinatario.email}</i>)<br />
                <b>Mensaje:</b> {m.contenido} <br />
                <small style={{ color: '#555' }}>{new Date(m.createdAt).toLocaleString()}</small>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Mensajes;
