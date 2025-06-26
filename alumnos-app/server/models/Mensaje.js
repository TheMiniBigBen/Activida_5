import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  contenido: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Mensaje', mensajeSchema);
