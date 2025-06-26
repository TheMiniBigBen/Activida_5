import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { verificarToken } from './middlewares/authMiddleware.js';
import alumnosRoutes from './routes/alumnosRoutes.js';
import mensajesRoutes from './routes/mensajesRoutes.js';




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/api/privado', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Ruta protegida accedida correctamente',
    usuario: req.usuario,
  });
});
app.use('/api', alumnosRoutes);
app.use('/api', mensajesRoutes);




app.get('/', (req, res) => res.send('API funcionando'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Servidor en http://localhost:5000'));
  })
  .catch((err) => console.error(err));
