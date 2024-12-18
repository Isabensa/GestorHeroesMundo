import { fetchCountries } from '../services/countryService.mjs';

export const renderDashboard = async (req, res) => {
  try {
    const countries = await fetchCountries();
    res.render('dashboard2', {
      layout: 'layout2',
      paises: countries,
    });
  } catch (error) {
    console.error('Error al renderizar el dashboard:', error.message);
    res.status(500).send('Error al cargar el dashboard.');
  }
};
