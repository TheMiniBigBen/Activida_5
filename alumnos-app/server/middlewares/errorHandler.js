// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor, intenta más tarde.' });
};
