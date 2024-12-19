import express from 'express';
import { renderDashboard, renderAddPais, addPais } from '../controllers/countryController.mjs';
import { validateCountry } from '../validators/countryValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router();

// Ruta para listar países en el dashboard2
router.get('/', (req, res, next) => {
  console.log('Solicitud recibida en la ruta /api/paises');
  next();
}, renderDashboard);

// Ruta para renderizar el formulario de agregar un nuevo país
router.get('/agregar', renderAddPais);

// Ruta para manejar la lógica de agregar un nuevo país
router.post('/agregar', validateCountry, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('addpais', {
      layout: 'layout2',
      errors: errors.array(),
    });
  }
  next();
}, addPais);

export default router;
