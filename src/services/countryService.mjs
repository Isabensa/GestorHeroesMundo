
import { getAllCountries } from '../repositories/countryRepository.mjs';

export const fetchCountries = async () => {
  try {
    console.log('Ejecutando servicio: fetchCountries');

    // Obtener datos desde la base de datos
    const rawCountries = await getAllCountries({ autor: 'ISABENSA' });
    console.log('Datos CRUDOS obtenidos de la base de datos:', JSON.stringify(rawCountries, null, 2)); // <-- LOG IMPORTANTE

    // Mapeo de los datos
    const mappedCountries = rawCountries.map(country => ({
      name: country.nombreSuperHeroe || 'Desconocido',
      officialName: country.nombreReal || 'N/A',
      borders: Array.isArray(country.aliados) ? country.aliados.join(', ') : 'N/A',
      gini: country.edad || 'N/A',
      population: country.poderes?.[0]?.split(': ')[1] || 'N/A',
      area: country.poderes?.[1]?.split(': ')[1]?.replace(' km²', '') || 'N/A',
      timezones: Array.isArray(country.enemigos) ? country.enemigos.join(', ') : 'N/A',
      region: country.planetaOrigen || 'Desconocido',
      subregion: country.debilidad || 'No especificada',
      creador: country.autor || 'N/A',
    }));

    console.log('Datos MAPEADOS para la vista:', mappedCountries); // Log del mapeo final
    return mappedCountries;
  } catch (error) {
    console.error('Error al mapear los datos de países:', error.message);
    throw error;
  }
};
