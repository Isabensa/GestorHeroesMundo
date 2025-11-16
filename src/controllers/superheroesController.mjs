// Importaciones necesarias
import mongoose from 'mongoose';
import {
  obtenerSuperheroePorId,
  obtenerTodosLosSuperheroes,
  buscarSuperheroesPorAtributo,
  obtenerSuperheroesMayoresDe30YconFiltros,
} from '../services/superheroesService.mjs';

import superHeroRepository from '../repositories/SuperHeroRepository.mjs';
import { validationResult } from 'express-validator';
import {
  renderizarSuperheroe,
  renderizarListaSuperheroes,
} from '../views/responseView.mjs';

// ================================
// OBTENER POR ID
// ================================
export async function obtenerSuperheroePorIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: 'ID no válido' });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id);

    if (superheroe) {
      return res.send(renderizarSuperheroe(superheroe));
    }

    return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });

  } catch (error) {
    console.error('Error al obtener el superhéroe:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// OBTENER TODOS
// ================================
export async function obtenerTodosLosSuperheroesController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperheroes();

    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes' });
    }

    return res.send(renderizarListaSuperheroes(superheroes));

  } catch (error) {
    console.error('Error al obtener todos los superhéroes:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// BUSCAR POR ATRIBUTO
// ================================
export async function buscarSuperheroesPorAtributoController(req, res) {
  const { atributo, valor } = req.params;

  if (!atributo || !valor) {
    return res.status(400).send({ mensaje: 'Faltan parámetros requeridos' });
  }

  try {
    const superheroes = await buscarSuperheroesPorAtributo(atributo, valor);

    if (superheroes.length > 0) {
      return res.send(renderizarListaSuperheroes(superheroes));
    }

    return res.status(404).send({ mensaje: 'No se encontraron superhéroes con ese atributo' });

  } catch (error) {
    console.error('Error al buscar superhéroes:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// MAYORES DE 30 + FILTROS
// ================================
export async function obtenerSuperheroesMayoresDe30YConFiltrosController(req, res) {
  try {
    const superheroes = await obtenerSuperheroesMayoresDe30YconFiltros();

    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
    }

    return res.send(renderizarListaSuperheroes(superheroes));

  } catch (error) {
    console.error('Error al obtener superhéroes:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// CREAR SUPERHÉROE
// ================================
export async function crearSuperheroeController(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

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

  try {
    const nuevoSuperheroe = await superHeroRepository.crearSuperheroe({
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    });

    return res.status(201).send({
      mensaje: 'Superhéroe creado correctamente',
      superhéroe: nuevoSuperheroe
    });

  } catch (error) {
    console.error('Error al crear superhéroe:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// ACTUALIZAR SUPERHÉROE
// ================================
export async function actualizarSuperheroeController(req, res) {
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

  try {
    const superheroeActualizado = await superHeroRepository.actualizarSuperheroe(id, {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    });

    if (superheroeActualizado) {
      return res.send(renderizarSuperheroe(superheroeActualizado));
    }

    return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });

  } catch (error) {
    console.error('Error al actualizar superhéroe:', error);
    return res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// ================================
// ELIMINAR SUPERHÉROE
// ================================
export async function eliminarSuperheroeController(req, res) {
  const { id } = req.params;

  try {
    const superheroeEliminado = await superHeroRepository.eliminarSuperheroe(id);

    if (!superheroeEliminado) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado para eliminar',
        successMessage: null,
      });
    }

    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: null,
      successMessage: 'Superhéroe eliminado con éxito.',
    });

  } catch (error) {
    console.error('Error al eliminar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    });
  }
}

// ================================
// BUSCAR PARA CONFIRMAR ELIMINACIÓN
// ================================
export async function buscarSuperheroeParaEliminarController(req, res) {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'ID no válido',
      successMessage: null,
    });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id);

    if (!superheroe) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado',
        successMessage: null,
      });
    }

    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: superheroe,
      error: null,
      successMessage: null,
    });

  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    });
  }
}
