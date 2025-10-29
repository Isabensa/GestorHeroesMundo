import { fetchCountries, saveCountry, fetchCountryById, deleteCountryById } from '../services/countryService.mjs';
import { validateCountry } from '../validators/countryValidator.mjs';
import { validationResult } from 'express-validator';

// 🟢 Renderiza el dashboard de países
export const renderDashboard = async (req, res) => {
  try {
    const countries = await fetchCountries();
    console.log('Países enviados al dashboard:', countries);
    res.render('dashboard2', {
      layout: 'layouts/layout2',
      title: 'Dashboard de Países', // ✅ agregado
      paises: countries,
      message: req.query.message || null,
    });
  } catch (error) {
    console.error('Error al renderizar el dashboard:', error.message);
    res.status(500).send('Error al cargar el dashboard.');
  }
};


// 🟢 Renderiza la vista de agregar país
export const renderAddPais = (req, res) => {
  res.render('addpais', {
    layout: 'layouts/layout2',
    errors: null,
    success: req.query.success || null,
    error: req.query.error || null,
    pais: null,
  });
};

// 🟢 Agrega o actualiza un país
export const addPais = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('addpais', {
      layout: 'layouts/layout2',
      errors: errors.array(),
      success: null,
      pais: req.body,
    });
  }

  try {
    const { id, name, capital, borders, area, population, gini, timezones, region, subregion } = req.body;

    const result = await saveCountry({
      id,
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
        layout: 'layouts/layout2',
        success: result.message,
        errors: null,
        pais: null,
      });
    } else {
      res.render('addpais', {
        layout: 'layouts/layout2',
        success: null,
        errors: [{ msg: result.message }],
        pais: req.body,
      });
    }
  } catch (error) {
    console.error('❌ Error al agregar o actualizar el país:', error.message);
    res.render('addpais', {
      layout: 'layouts/layout2',
      success: null,
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: req.body,
    });
  }
};

// 🟢 Renderiza la vista de edición
export const renderEditPais = async (req, res) => {
  res.render('edit2', {
    layout: 'layouts/layout2',
    errors: null,
    pais: null,
  });
};

// 🟢 Busca un país por ID
export const buscarPais = async (req, res) => {
  try {
    const { idPais } = req.body;
    if (!idPais || idPais.trim() === '') {
      return res.render('edit2', {
        layout: 'layouts/layout2',
        errors: [{ msg: 'Debe proporcionar un ID válido.' }],
        pais: null,
      });
    }

    const pais = await fetchCountryById(idPais.trim());
    if (pais) {
      return res.render('edit2', {
        layout: 'layouts/layout2',
        pais,
        errors: null,
      });
    } else {
      return res.render('edit2', {
        layout: 'layouts/layout2',
        errors: [{ msg: 'No se encontró un país con el ID proporcionado.' }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('❌ Error al buscar el país:', error.message);
    return res.render('edit2', {
      layout: 'layouts/layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};

// 🟢 Guarda los cambios de un país
export const guardarPais = [
  ...validateCountry,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('edit2', {
        layout: 'layouts/layout2',
        errors: errors.array(),
        pais: req.body,
      });
    }

    try {
      const id = req.params.id;
      if (!id || id.trim() === '') {
        return res.render('edit2', {
          layout: 'layouts/layout2',
          errors: [{ msg: 'Debe proporcionar un ID válido.' }],
          pais: req.body,
        });
      }

      const updatedCountry = await saveCountry({ id, ...req.body });
      if (updatedCountry.success) {
        return res.render('edit2', {
          layout: 'layouts/layout2',
          pais: updatedCountry.country,
          success: 'País actualizado exitosamente.',
          errors: null,
        });
      } else {
        return res.render('edit2', {
          layout: 'layouts/layout2',
          errors: [{ msg: updatedCountry.message }],
          pais: req.body,
        });
      }
    } catch (error) {
      console.error('❌ Error al guardar el país:', error.message);
      return res.render('edit2', {
        layout: 'layouts/layout2',
        errors: [{ msg: 'Error interno del servidor.' }],
        pais: req.body,
      });
    }
  },
];

// 🟢 Renderiza la vista de eliminar país
export const renderDeletePais = (req, res) => {
  res.render('delete2', {
    layout: 'layouts/layout2',
    errors: null,
    pais: null,
  });
};

// 🟢 Busca país para eliminar
export const buscarPaisParaEliminar = async (req, res) => {
  try {
    const { idPais } = req.body;
    if (!idPais || idPais.trim() === '') {
      return res.render('delete2', {
        layout: 'layouts/layout2',
        errors: [{ msg: 'Debe proporcionar un ID válido.' }],
        pais: null,
      });
    }

    const pais = await fetchCountryById(idPais.trim());
    if (pais) {
      return res.render('delete2', {
        layout: 'layouts/layout2',
        errors: null,
        pais,
      });
    } else {
      return res.render('delete2', {
        layout: 'layouts/layout2',
        errors: [{ msg: 'No se encontró un país con el ID proporcionado.' }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('❌ Error al buscar el país para eliminar:', error.message);
    return res.render('delete2', {
      layout: 'layouts/layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};

// 🟢 Elimina un país por ID
export const eliminarPais = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCountryById(id);
    if (result.success) {
      res.redirect('/paises/dashboard?message=' + result.message); // ✅ ruta corregida
    } else {
      res.render('delete2', {
        layout: 'layouts/layout2',
        errors: [{ msg: result.message }],
        pais: null,
      });
    }
  } catch (error) {
    console.error('❌ Error al eliminar el país:', error.message);
    res.render('delete2', {
      layout: 'layouts/layout2',
      errors: [{ msg: 'Error interno del servidor.' }],
      pais: null,
    });
  }
};
