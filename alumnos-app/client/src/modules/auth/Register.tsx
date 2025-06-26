import React, { useContext, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      contraseña: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').required('El nombre es obligatorio'),
      email: Yup.string().email('Correo no válido').required('El correo es obligatorio'),
      contraseña: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    }),
    onSubmit: async values => {
      if (!captchaToken) {
        setError('Por favor completa el reCAPTCHA.');
        return;
      }

      setLoading(true);
      try {
        await axios.post('http://localhost:5000/api/auth/registro', {
          ...values,
          captchaToken,
        });

        const resLogin = await axios.post('http://localhost:5000/api/auth/login', {
          email: values.email,
          contraseña: values.contraseña,
        });

        login(resLogin.data.token, resLogin.data.usuario);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al registrar.');
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{
      maxWidth: 400,
      margin: '60px auto',
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      borderRadius: 8,
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      color: '#333',
    }}>
      <h2 style={{ marginBottom: 25, textAlign: 'center', color: '#1a73e8' }}>Registro de Alumno</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.nombre}
          style={{
            width: '100%',
            marginBottom: formik.touched.nombre && formik.errors.nombre ? 2 : 12,
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
            e.currentTarget.style.borderColor = formik.errors.nombre ? 'red' : '#ccc';
          }}
        />
        {formik.touched.nombre && formik.errors.nombre && (
          <div style={{ color: 'red', marginBottom: 10 }}>{formik.errors.nombre}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
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
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: 12, fontWeight: '600', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Register;
