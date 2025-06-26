import express from 'express';
import { enviarMensaje, obtenerMensajes } from '../controllers/mensajeController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/mensajes', verificarToken, obtenerMensajes);
router.post('/mensajes', verificarToken, enviarMensaje);

export default router;
