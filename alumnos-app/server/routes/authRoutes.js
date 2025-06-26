import express from 'express';
import { registrar, login, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);
router.post('/google-login', googleLogin);  // nueva ruta para login con Google

export default router;
