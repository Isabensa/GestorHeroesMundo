import express from 'express';
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

const router = express.Router();

/* ============================================================
   🏠 Redirección principal
   ============================================================ */
router.get('/', (req, res) => {
  console.log('➡️ Redirigiendo desde /paises a /paises/dashboard');
  res.redirect('/paises/dashboard');
});

/* ============================================================
   🌍 Dashboard principal
   ============================================================ */
router.get('/dashboard', (req, res, next) => {
  console.log('📥 Solicitud recibida en /paises/dashboard');
  next();
}, renderDashboard);

/* ============================================================
   ➕ Agregar país
   ============================================================ */
router.get('/agregar', renderAddPais);

router.post('/agregar', validateCountry, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('⚠️ Errores de validación al agregar país:', errors.array());
    return res.render('views2/layouts/layout2', {
      title: 'Agregar País',
      content: '../addpais',
      errors: errors.array(),
      success: null,
      pais: req.body,
    });
  }

  next();
}, addPais);

/* ============================================================
   ✏️ Editar país
   ============================================================ */
router.get('/editar', renderEditPais);                // Muestra formulario de búsqueda
router.post('/editar/buscar', buscarPais);            // Busca país por ID
router.post('/editar/:id', guardarPais);              // Guarda los cambios

/* ============================================================
   ❌ Eliminar país
   ============================================================ */
router.get('/eliminar', renderDeletePais);            // Muestra formulario para eliminar
router.post('/eliminar/buscar', buscarPaisParaEliminar); // Busca país antes de eliminar
router.post('/eliminar/:id', eliminarPais);           // Elimina el país

export default router;
