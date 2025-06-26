import Usuario from '../models/Usuario.js';

export const listarAlumnos = async (req, res) => {
  const { search } = req.query;

  let filtro = {};

  if (search) {
    filtro = {
      $or: [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };
  }

  try {
    const alumnos = await Usuario.find(filtro).select('nombre email rol').limit(50);
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener alumnos', error: error.message });
  }
};
