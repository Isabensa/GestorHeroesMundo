import express from 'express'; // Asegúrate de importar Express
import {
  renderDashboard,
  renderAddPais,
  addPais,
  renderEditPais,
  buscarPais,
  guardarPais,
  renderDeletePais,
  buscarPaisParaEliminar,
  eliminarPais,
} from '../controllers/countryController.mjs';

import { validateCountry } from '../validators/countryValidator.mjs';
import { validationResult } from 'express-validator';

const router = express.Router(); // Define el router

// Ruta para listar países en el dashboard2
router.get('/', (req, res, next) => {
  console.log('Solicitud recibida en la ruta /api/paises');
  next();
}, renderDashboard);

// Ruta para renderizar el formulario de agregar un nuevo país
router.get('/agregar', renderAddPais);

// Ruta para manejar la lógica de agregar o actualizar un país
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

// Ruta para renderizar el formulario de edición de países
router.get('/editar', renderEditPais);

// Ruta para buscar un país por ID en la vista edit2
router.post('/buscar', buscarPais);

// Ruta para guardar los cambios realizados a un país
router.post('/editar/:id', guardarPais); // Ajuste: Se añade :id como parámetro en la URL

// Ruta para renderizar la vista de eliminar país
router.get('/eliminar', renderDeletePais);

// Ruta para buscar un país por ID en la vista de eliminar
router.post('/eliminar/buscar', buscarPaisParaEliminar);

// Ruta para borrar un país por ID
router.post('/eliminar/:id', eliminarPais);

export default router;
