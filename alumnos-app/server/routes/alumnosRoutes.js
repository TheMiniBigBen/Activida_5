import express from 'express';
import { listarAlumnos } from '../controllers/alumnosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/alumnos', verificarToken, listarAlumnos);

export default router;
