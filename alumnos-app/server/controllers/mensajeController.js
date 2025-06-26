import Mensaje from '../models/Mensaje.js';
import Usuario from '../models/Usuario.js';

export const enviarMensaje = async (req, res) => {
  const { destinatarios, contenido } = req.body; // Cambié 'destinatario' por 'destinatarios'
  const remitenteId = req.usuario.id;

  if (!Array.isArray(destinatarios) || destinatarios.length === 0) {
    return res.status(400).json({ mensaje: 'Debes enviar al menos un destinatario.' });
  }

  try {
    for (const destinatario of destinatarios) {
      const usuarioDest = await Usuario.findById(destinatario);
      if (!usuarioDest) {
        // Opcional: puedes omitir destinatarios no encontrados o devolver error
        continue; // O return res.status(404).json({ mensaje: `Destinatario ${destinatario} no encontrado` });
      }

      const nuevo = new Mensaje({
        remitente: remitenteId,
        destinatario,
        contenido,
      });
      await nuevo.save();
    }

    res.status(201).json({ mensaje: 'Mensaje(s) enviado(s)' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al enviar', error: error.message });
  }
};

export const obtenerMensajes = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const mensajes = await Mensaje.find({
      $or: [{ remitente: usuarioId }, { destinatario: usuarioId }]
    })
      .populate('remitente', 'nombre email')
      .populate('destinatario', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mensajes', error: error.message });
  }
};
