import { fetchCountries } from './services/countryService.mjs';

(async () => {
  try {
    const countries = await fetchCountries();
    console.log('Datos obtenidos del servicio:', JSON.stringify(countries, null, 2));
  } catch (error) {
    console.error('Error en la prueba del servicio:', error.message);
  }
})();
