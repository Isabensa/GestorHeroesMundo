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
router.get(
  '/dashboard',
  (req, res, next) => {
    console.log('📥 Solicitud recibida en /paises/dashboard');
    next();
  },
  renderDashboard
);

/* ============================================================
   ➕ Agregar país
   ============================================================ */
router.get('/agregar', (req, res) => {
  console.log('🟢 Renderizando formulario para agregar país');
  renderAddPais(req, res);
});

router.post('/agregar', validateCountry, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('⚠️ Errores de validación al agregar país:', errors.array());
    return res.render('addpais', {
      layout: 'layouts/layout2',
      title: 'Agregar País',
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
// Renderiza la vista de búsqueda
router.get('/editar', (req, res) => {
  console.log('✏️ Mostrando formulario de edición de país');
  renderEditPais(req, res);
});

// Busca país por ID
router.post('/editar/buscar', (req, res) => {
  console.log('🔍 Buscando país por ID...');
  buscarPais(req, res);
});

// Guarda los cambios del país editado
router.post('/editar/:id', (req, res) => {
  console.log(`💾 Guardando cambios del país con ID: ${req.params.id}`);
  guardarPais(req, res);
});

/* ============================================================
   ❌ Eliminar país
   ============================================================ */
// Renderiza formulario de eliminación
router.get('/eliminar', (req, res) => {
  console.log('🗑️ Mostrando formulario para eliminar país');
  renderDeletePais(req, res);
});

// Busca país antes de eliminarlo
router.post('/eliminar/buscar', (req, res) => {
  console.log('🔎 Buscando país para eliminar...');
  buscarPaisParaEliminar(req, res);
});

// Elimina país por ID
router.post('/eliminar/:id', (req, res) => {
  console.log(`❌ Eliminando país con ID: ${req.params.id}`);
  eliminarPais(req, res);
});

export default router;
//probando clave