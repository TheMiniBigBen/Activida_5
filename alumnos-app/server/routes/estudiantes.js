import express from 'express';
import {
  crearEstudiante,
  obtenerEstudiantes,
  actualizarEstudiante,
  eliminarEstudiante,
} from '../controllers/estudianteController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verificarToken, crearEstudiante);
router.get('/', verificarToken, obtenerEstudiantes);
router.put('/:id', verificarToken, actualizarEstudiante);
router.delete('/:id', verificarToken, eliminarEstudiante);

export default router;
