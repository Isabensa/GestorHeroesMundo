import express from 'express';
import {
  obtenerSuperheroePorIdController,
  obtenerTodosLosSuperheroesController,
  buscarSuperheroesPorAtributoController,
  obtenerSuperheroesMayoresDe30YConFiltrosController,
  crearSuperheroeController,
  actualizarSuperheroeController,
  buscarSuperheroeParaEliminarController,
  eliminarSuperheroeController,
} from '../controllers/superheroesController.mjs';

import {
  crearSuperHeroeValidation,
  actualizarSuperHeroeValidation,
  eliminarSuperheroeValidation,
} from '../validators/superHeroValidator.mjs';

import { validationHandler } from '../validators/validationHandler.mjs';
import SuperHero from '../models/SuperHero.mjs';

const router = express.Router();

// -------------------------------
// HOME
// -------------------------------
router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Inicio' });
});

// -------------------------------
// GET
// -------------------------------
router.get('/heroes', obtenerTodosLosSuperheroesController);
router.get('/heroes/:id', obtenerSuperheroePorIdController);
router.get('/heroes/buscar/:atributo/:valor', buscarSuperheroesPorAtributoController);
router.get('/superheroes/filtros', obtenerSuperheroesMayoresDe30YConFiltrosController);

// -------------------------------
// CREATE - API
// -------------------------------
router.post(
  "/superheroes",
  crearSuperHeroeValidation,
  validationHandler,
  async (req, res) => {
    try {
      const {
        nombreSuperHeroe,
        nombreReal,
        edad,
        planetaOrigen,
        debilidad,
        poderes,
        aliados,
        enemigos,
      } = req.body;

      const nuevoSuperHeroe = new SuperHero({
        nombreSuperHeroe,
        nombreReal,
        edad: Number(edad),
        planetaOrigen,
        debilidad,
        poderes,
        aliados,
        enemigos,
      });

      await nuevoSuperHeroe.save();

      res.status(201).json({
        message: "Superhéroe creado correctamente",
        data: nuevoSuperHeroe,
      });
    } catch (error) {
      console.error("Error al crear el superhéroe:", error);
      res.status(500).json({ error: "Error al crear el superhéroe." });
    }
  }
);

// -------------------------------
// UPDATE - API
// -------------------------------
router.put(
  '/heroes/:id',
  actualizarSuperHeroeValidation,
  validationHandler,
  actualizarSuperheroeController
);

// -------------------------------
// DELETE REAL - API
// -------------------------------
router.delete(
  '/heroes/:id',
  eliminarSuperheroeValidation,
  validationHandler,
  eliminarSuperheroeController
);

// -------------------------------
// LISTADO WEB
// -------------------------------
router.get('/listado', async (req, res) => {
  try {
    const superheroes = await SuperHero.find();
    res.render('pages/listado', {
      title: 'Listado de Superhéroes',
      superheroes,
    });
  } catch (error) {
    console.error('Error al obtener los superhéroes:', error);
    res.status(500).send('Error al cargar la lista de superhéroes');
  }
});

// -------------------------------
// FORMULARIO CREATE
// -------------------------------
router.get('/add', (req, res) => {
  res.render('pages/add', { title: 'Agregar Superhéroe' });
});

// -------------------------------
// CREATE DESDE FORMULARIO
// -------------------------------
router.post('/add',
  crearSuperHeroeValidation,
  validationHandler,
  async (req, res) => {
    try {
      const {
        nombreSuperHeroe,
        nombreReal,
        edad,
        planetaOrigen,
        debilidad,
        poderes,
        aliados,
        enemigos,
      } = req.body;

      const nuevoSuperHeroe = new SuperHero({
        nombreSuperHeroe,
        nombreReal,
        edad: Number(edad),
        planetaOrigen,
        debilidad,
        poderes: poderes || [],
        aliados: aliados || [],
        enemigos: enemigos || [],
      });

      await nuevoSuperHeroe.save();

      res.render('pages/add', {
        title: 'Agregar Superhéroe',
        successMessage: 'El superhéroe fue guardado correctamente en la base de datos',
        errorMessages: [],
      });

    } catch (error) {
      console.error('Error al guardar el superhéroe:', error);
      const errorMessages = Object.values(error.errors || {}).map(err => err.message);

      res.render('pages/add', {
        title: 'Agregar Superhéroe',
        successMessage: null,
        errorMessages,
      });
    }
  }
);

// -------------------------------
// FORMULARIO EDITAR
// -------------------------------
router.get('/edit', (req, res) => {
  res.render('pages/edit', {
    title: 'Editar Superhéroe',
    superhero: null,
    error: null,
    success: null
  });
});

// BUSCAR ID PARA EDITAR
router.post('/edit/find', async (req, res) => {
  try {
    const { id } = req.body;
    const superhero = await SuperHero.findById(id);

    if (!superhero) {
      return res.render('pages/edit', {
        title: 'Editar Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado',
        success: null
      });
    }

    res.render('pages/edit', {
      title: 'Editar Superhéroe',
      superhero,
      error: null,
      success: null
    });

  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    res.status(500).send('Error al buscar el superhéroe.');
  }
});

// GUARDAR CAMBIOS DE EDICIÓN
router.post(
  '/edit/:id/save',
  actualizarSuperHeroeValidation,
  validationHandler,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombreSuperHeroe,
        nombreReal,
        edad,
        planetaOrigen,
        debilidad,
        poderes,
        aliados,
        enemigos
      } = req.body;

      const updatedSuperhero = await SuperHero.findByIdAndUpdate(
        id,
        {
          nombreSuperHeroe,
          nombreReal,
          edad: Number(edad),
          planetaOrigen,
          debilidad,
          poderes: poderes || [],
          aliados: aliados || [],
          enemigos: enemigos || [],
        },
        { new: true }
      );

      if (!updatedSuperhero) {
        return res.status(404).send({ message: 'Superhéroe no encontrado' });
      }

      res.render('pages/edit', {
        title: 'Editar Superhéroe',
        superhero: updatedSuperhero,
        success: 'Superhéroe editado con éxito',
        error: null,
      });

    } catch (error) {
      console.error('Error al guardar el superhéroe:', error);
      res.status(500).send({ error: 'Error al guardar el superhéroe.' });
    }
  }
);

// -------------------------------
// ELIMINAR - FORMULARIO
// -------------------------------
router.get('/delete', (req, res) => {
  res.render('pages/delete', {
    title: 'Eliminación de Superhéroe',
    superhero: null,
    error: null,
    successMessage: null
  });
});

// BUSCAR ID PARA ELIMINAR
router.post('/delete/find', async (req, res) => {
  try {
    await buscarSuperheroeParaEliminarController(req, res);
  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: error.message,
      successMessage: null
    });
  }
});

// CONFIRMAR ELIMINACIÓN - FORMULARIO
router.post('/delete/:id/confirm', eliminarSuperheroeController);

export default router;
