import { fetchCountries, saveCountry } from '../services/countryService.mjs';

export const renderDashboard = async (req, res) => {
  try {
    const countries = await fetchCountries();
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

export const renderAddPais = (req, res) => {
  res.render('addpais', {
    layout: 'layout2',
    errors: null,
    success: req.query.success || null,
    error: req.query.error || null,
  });
};

export const addPais = async (req, res) => {
  try {
    const { name, capital, borders, area, population, gini, timezones, region, subregion } = req.body;

    // Guardar el país en la base de datos
    const result = await saveCountry({
      name,
      capital,
      borders,
      area,
      population,
      gini,
      timezones,
      region,
      subregion,
    });

    // Renderizar con mensaje de éxito si el país se guardó correctamente
    if (result.success) {
      res.render('addpais', {
        layout: 'layout2',
        success: 'País guardado exitosamente.',
        errors: null,
        error: null,
      });
    } else {
      res.render('addpais', {
        layout: 'layout2',
        success: null,
        errors: [{ msg: result.message }],
        error: result.message,
      });
    }
  } catch (error) {
    console.error('Error al agregar el país:', error.message);
    res.render('addpais', {
      layout: 'layout2',
      success: null,
      errors: [{ msg: 'Error interno del servidor.' }],
      error: 'Error interno del servidor.',
    });
  }
};
