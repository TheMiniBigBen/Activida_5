import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String }, // 🔄 ya no es "required"
  rol: { type: String, default: 'alumno' },
  googleId: { type: String }, // ✅ nuevo campo opcional
}, { timestamps: true });

export default mongoose.model('Usuario', usuarioSchema);
