import mongoose from 'mongoose';

const EstudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  Carrera: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.model('Estudiante', EstudianteSchema);
