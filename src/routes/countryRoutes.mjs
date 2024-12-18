import express from 'express';
import { renderDashboard } from '../controllers/countryController.mjs';

const router = express.Router();

// Ruta para listar países en el dashboard2
router.get('/', (req, res, next) => {
  console.log('Solicitud recibida en la ruta /api/paises');
  next();
}, renderDashboard);

export default router;
