import SuperHero from '../models/SuperHero.mjs';

/**
 * Obtiene los datos filtrados de la colección de superhéroes donde el autor es "ISABENSA".
 * @returns {Promise<Array>} - Lista de datos filtrados.
 */
export const getAllCountries = async () => {
  try {
    console.log('Consultando la colección superheroes con filtro autor: "ISABENSA"');
    const countries = await SuperHero.find({ autor: 'ISABENSA' });
    console.log('Datos obtenidos de MongoDB:', countries);
    return countries;
  } catch (error) {
    console.error('Error al consultar la base de datos:', error.message);
    throw error;
  }
};
