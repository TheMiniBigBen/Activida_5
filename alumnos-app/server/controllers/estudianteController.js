import Estudiante from '../models/Estudiante.js';

// Crear estudiante con matrícula automática
export const crearEstudiante = async (req, res) => {
  try {
    const { nombre, apellido, Carrera } = req.body;
    const anio = new Date().getFullYear();
    const matricula = `${Carrera}-${anio}-${Math.floor(Math.random() * 10000)}`;

    const nuevo = new Estudiante({ nombre, apellido, Carrera, matricula });
    await nuevo.save();

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear estudiante', error: error.message });
  }
};

// Listar todos o buscar estudiantes por nombre o apellido
export const obtenerEstudiantes = async (req, res) => {
  try {
    const { search, Carrera } = req.query;
    const filtro = {};

    if (search) {
      filtro.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellido: { $regex: search, $options: 'i' } },
        { matricula: { $regex: search, $options: 'i' } },
      ];
    }

    if (Carrera) {
      if (filtro.$or) {
        filtro.$and = [
          { $or: filtro.$or },
          { Carrera: { $regex: `^${Carrera}$`, $options: 'i' } }
        ];
        delete filtro.$or;
      } else {
        filtro.Carrera = { $regex: `^${Carrera}$`, $options: 'i' };
      }
    }

    const estudiantes = await Estudiante.find(filtro);
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estudiantes', error: error.message });
  }
};



// Editar estudiante
export const actualizarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!estudiante) return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estudiante', error: error.message });
  }
};

// Eliminar estudiante
export const eliminarEstudiante = async (req, res) => {
  try {
    await Estudiante.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Estudiante eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar estudiante', error: error.message });
  }
};
