import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registrar = async (req, res) => {
  const { nombre, email, contraseña, captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ mensaje: 'Captcha token es requerido' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

  try {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ mensaje: 'Fallo la verificación del captcha.' });
    }

    // Verificar si ya existe el usuario
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo.' });
    }

    // Crear nuevo usuario
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({ nombre, email, contraseña: contraseñaHash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error del servidor.', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: { nombre: usuario.nombre, email: usuario.email }
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error del servidor.', error: err.message });
  }
};

// Nueva función para login con Google
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ mensaje: 'Token de Google es requerido' });
  }

  try {
    // Verificar token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Buscar usuario por email
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Si no existe, crear usuario nuevo
      usuario = new Usuario({
        nombre: name,
        email,
        contraseña: '', // Contraseña vacía porque es login con Google
        googleId,
      });
      await usuario.save();
    }

    // Crear JWT
    const jwtToken = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: jwtToken, usuario: { nombre: usuario.nombre, email: usuario.email } });

  } catch (error) {
    console.error(error);
    res.status(401).json({ mensaje: 'Token de Google inválido' });
  }
};
