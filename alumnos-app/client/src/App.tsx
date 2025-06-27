import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './modules/auth/Login';
import Dashboard from './modules/dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './modules/auth/Register';
import AlumnosList from './components/AlumnosList';
import Mensajes from './modules/mensajes/Mensajes';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import EstudiantesList from './components/EstudiantesList';
import TestError500 from './components/TestError500'; // 👈 este

function App() {
  return (
    <GoogleOAuthProvider clientId="45364968687-f7t0sulvh4cnjoppqh2b0fppqu0bm7i3.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* ✅ RUTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/prueba500" element={<TestError500 />} /> {/* 👈 AQUÍ la mueves */}

          {/* 🔒 RUTAS PRIVADAS */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alumnos" element={<AlumnosList />} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/estudiantes" element={<EstudiantesList />} />
          </Route>

          {/* 🛑 RUTA 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
