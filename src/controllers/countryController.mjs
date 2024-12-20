// Importa el servicio de países
import { fetchCountries, saveCountry, fetchCountryById, deleteCountryById } from '../services/countryService.mjs';

// Importa las reglas de validación para países
import { validateCountry } from '../validators/countryValidator.mjs';

// Importa el validador de resultados de Express
import { validationResult } from 'express-validator';

// Renderiza el dashboard de países
export const renderDashboard = async (req, res) => {
  try {
    const countries = await fetchCountries();
    console.log('Países enviados al dashboard:', countries);
    res.render('dashboard2', {
      layout: 'layout2',
      paises: countries,
      message: req.query.message || null,
    });
  } catch (error) {
    console.error('Error al renderizar el dashboard:', error.message);
    res.status(500).send('Error al cargar el dashboard.');
  }
};

// Renderiza la vista de agregar país
export const renderAddPais = (req, res) => {
  res.render('addpais', {
    layout: 'layout2',
    errors: null,
    success: req.query.success || null,
    error: req.query.error || null,
    pais: null, // Aseguramos que pais sea nulo.
  });
};

// Agrega o actualiza un país
export const addPais = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array());
    return res.render('addpais', {
      layout: 'layout2',
      errors: errors.array(), // Pasar los errores a la vista
      success: null,
      pais: req.body, // Mantener los datos ingresados en el formulario
    });
  }

  try {
    const { id, name, capital, borders, area, population, gini, timezones, region, subregion } = req.body;

    console.log('Datos recibidos para agregar/actualizar país:', req.body);

    const result = await saveCountry({
      id, // Si existe, actualiza; si no, crea un nuevo registro
      name,
      capital,
      borders,
      area: area ? parseFloat(area) : 0,
      population,
      gini,
      timezones,
      region,
      subregion,
    });

    if (result.success) {
      res.render('addpais', {
        layout: 'layout2',
        success: result.message,
        errors: null,
      });
    } else {
      res.render('addpais', {
        layout: 'layout2',
        success: null,
        errors: [{ msg: result.message }],
      });
    }
  } catch (error) {
    console.error('Error al agregar o actualizar el país:', error.message);
    res.render('addpais', {
      layout: 'layout2',
      success: null,
      errors: [{ msg: 'Error interno del servidor.' }],
    });
  }
};

// Renderiza la vista de edición
export const renderEditPais = async (req, res) => {
  res.render('edit2', {
    layout: 'layout2',
    errors: null,
    pais: null,
  });
};

// Busca un país por ID
export const buscarPais = async (req, res) => {
  try {
    const { idPais } = req.body;
    console.log('ID recibido para buscar:', idPais);

    // Validar que el ID no esté vacío
    if (!idPais || idPais.trim() === '') {
      return res.render('edit2', {
        layout: 'layout2',
        errors: [{ msg: 'Debe proporcionar un ID válido.' }],
        pais: null,
      });
    }

    // Buscar el país en la base de datos
    const pais = await fetchCountryById(idPais.trim());
    if (pais) {
      console.log('País encontrado:', pais);
      return res.render('edit2', {
        layout: 'layout2',
        pais, // Enviar el país encontrado a la vista
        errors: null,
      });
    } else {
      return res.render('edit2', {
        layout: 'layout2',
        errors: [{ msg: 'No se encontró un país con el ID proporcionado.' }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('Error al buscar el país:', error.message);
    return res.render('edit2', {
      layout: 'layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};

// Guarda los cambios realizados al país
export const guardarPais = [
  ...validateCountry,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('Errores de validación:', errors.array());
      return res.render('edit2', {
        layout: 'layout2',
        errors: errors.array(),
        pais: req.body, // Mostrar los datos ingresados en el formulario
      });
    }

    try {
      const id = req.params.id; // Obtener el ID desde los parámetros de la URL
      console.log('ID recibido en guardarPais:', id);

      if (!id || id.trim() === '') {
        return res.render('edit2', {
          layout: 'layout2',
          errors: [{ msg: 'Debe proporcionar un ID válido para actualizar.' }],
          pais: req.body,
        });
      }

      const updatedData = req.body; // Capturar los datos enviados desde el formulario
      console.log('Datos actualizados enviados al servicio:', updatedData);

      const updatedCountry = await saveCountry({ id, ...updatedData });
      if (updatedCountry.success) {
        console.log('País actualizado:', updatedCountry.country);
        return res.render('edit2', {
          layout: 'layout2',
          pais: updatedCountry.country, // Enviar los datos actualizados a la vista
          success: 'País actualizado exitosamente.',
          errors: null,
        });
      } else {
        return res.render('edit2', {
          layout: 'layout2',
          errors: [{ msg: updatedCountry.message }],
          pais: req.body,
        });
      }
    } catch (error) {
      console.error('Error al guardar el país:', error.message);
      return res.render('edit2', {
        layout: 'layout2',
        errors: [{ msg: 'Error interno del servidor.' }],
        pais: req.body,
      });
    }
  },
];

// Renderiza la vista de eliminar país
export const renderDeletePais = (req, res) => {
  res.render('delete2', {
    layout: 'layout2',
    errors: null,
    pais: null, // No hay datos iniciales del país
  });
};

// Busca un país por ID para eliminar
export const buscarPaisParaEliminar = async (req, res) => {
  try {
    const { idPais } = req.body;
    console.log('ID recibido para buscar en eliminación:', idPais);

    // Validar que el ID no esté vacío
    if (!idPais || idPais.trim() === '') {
      return res.render('delete2', {
        layout: 'layout2',
        errors: [{ msg: 'Debe proporcionar un ID válido.' }],
        pais: null,
      });
    }

    // Buscar el país en la base de datos
    const pais = await fetchCountryById(idPais.trim());
    if (pais) {
      console.log('País encontrado para eliminar:', pais);
      return res.render('delete2', {
        layout: 'layout2',
        errors: null,
        pais, // Pasar los datos del país a la vista
      });
    } else {
      return res.render('delete2', {
        layout: 'layout2',
        errors: [{ msg: 'No se encontró un país con el ID proporcionado.' }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('Error al buscar el país para eliminar:', error.message);
    return res.render('delete2', {
      layout: 'layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};

// Elimina un país por ID
export const eliminarPais = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID recibido para eliminar:', id);

    const result = await deleteCountryById(id);
    if (result.success) {
      res.redirect('/api/paises?message=' + result.message);
    } else {
      res.render('delete2', {
        layout: 'layout2',
        errors: [{ msg: result.message }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('Error al eliminar el país:', error.message);
    res.render('delete2', {
      layout: 'layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};
