// En server/routes/prueba.js o en tu archivo de rutas
const express = require('express');
const router = express.Router();

router.get('/error500', (req, res, next) => {
  // Forzar un error para probar manejo de error 500
  const err = new Error('Error interno simulado para prueba');
  err.status = 500;
  next(err); // Llama al middleware de errores
});

module.exports = router;
