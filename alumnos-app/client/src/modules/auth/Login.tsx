import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleLogin } from '@react-oauth/google';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      contraseña: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo no válido').required('El correo es obligatorio'),
      contraseña: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values) => {
      setError('');
      if (!captchaToken) {
        setError('Por favor completa el reCAPTCHA.');
        return;
      }

      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: values.email,
          contraseña: values.contraseña,
          captchaToken,
        });

        login(res.data.token, res.data.usuario);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al iniciar sesión.');
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = async (credentialResponse: any) => {
    setError('');
    setLoading(true);
    try {
      const token = credentialResponse.credential;
      if (!token) {
        setError('No se recibió token de Google');
        setLoading(false);
        return;
      }

      const res = await axios.post('http://localhost:5000/api/auth/google-login', { token });

      login(res.data.token, res.data.usuario);
      navigate('/dashboard');
    } catch {
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
        maxWidth: 400,
        margin: 'auto',
        padding: 20,
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        borderRadius: 8,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 6px 20px',
        backgroundColor: '#fff',
        color: '#333',
        height: 'calc(100vh - 120px)',  // 120px para el margin vertical
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
      <h2 style={{ marginBottom: 25, textAlign: 'center', color: '#1a73e8' }}>Iniciar Sesión</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          style={{
            width: '100%',
            marginBottom: formik.touched.email && formik.errors.email ? 2 : 12,
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
            outlineColor: '#1a73e8',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#1a73e8')}
          onBlurCapture={e => {
            formik.handleBlur(e);
            e.currentTarget.style.borderColor = formik.errors.email ? 'red' : '#ccc';
          }}
        />
        {formik.touched.email && formik.errors.email && (
          <div style={{ color: 'red', marginBottom: 10 }}>{formik.errors.email}</div>
        )}

        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.contraseña}
          style={{
            width: '100%',
            marginBottom: formik.touched.contraseña && formik.errors.contraseña ? 2 : 12,
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
            outlineColor: '#1a73e8',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#1a73e8')}
          onBlurCapture={e => {
            formik.handleBlur(e);
            e.currentTarget.style.borderColor = formik.errors.contraseña ? 'red' : '#ccc';
          }}
        />
        {formik.touched.contraseña && formik.errors.contraseña && (
          <div style={{ color: 'red', marginBottom: 10 }}>{formik.errors.contraseña}</div>
        )}

        <div style={{ marginBottom: 15 }}>
          <ReCAPTCHA
            sitekey="6Lect20rAAAAAOOOehm0s0VANiio-c6bwZJwQMaj"
            onChange={setCaptchaToken}
            ref={recaptchaRef}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            fontSize: 18,
            fontWeight: '600',
            backgroundColor: loading ? '#999' : '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.backgroundColor = '#155ab6';
          }}
          onMouseLeave={e => {
            if (!loading) e.currentTarget.style.backgroundColor = '#1a73e8';
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => setError('Error al iniciar sesión con Google')}
      />

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>{error}</p>
      )}

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
