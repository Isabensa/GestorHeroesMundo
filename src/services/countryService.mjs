import SuperHero from '../models/SuperHero.mjs';

/**
 * Obtiene todos los países guardados con el autor ISABENSA y los transforma al formato esperado por la vista.
 * @returns {Promise<Array>} - Lista de países transformados.
 */
export const fetchCountries = async () => {
  const countries = await SuperHero.find({ autor: 'ISABENSA' });
  const transformed = countries.map(country => ({
    name: country.nombreSuperHeroe,
    officialName: country.nombreReal,
    borders: country.aliados.join(', '),
    gini: country.edad !== undefined && country.edad !== null ? country.edad : 'No especificado',
    population: country.poderes[0]?.split(': ')[1] || 'No disponible',
    area: country.poderes[1]?.split(': ')[1] || 'No disponible',
    timezones: country.enemigos.join(', '),
    region: country.planetaOrigen || 'No especificado',
    subregion: country.debilidad || 'No especificado',
    creador: country.autor,
  }));
  console.log('Datos transformados:', transformed); // TEMPORAL PARA DEPURACIÓN
  return transformed;
};

/**
 * Mapea los datos ingresados en el formulario al formato esperado por el modelo SuperHero.
 * @param {Object} data - Datos del formulario.
 * @returns {Object} - Datos mapeados para el modelo SuperHero.
 */
export const mapCountryToSuperHero = (data) => {
  return {
    nombreSuperHeroe: data.name,
    nombreReal: data.name,
    aliados: data.borders ? data.borders.split(',').map(border => border.trim()) : [],
    edad: data.gini !== undefined && data.gini !== null ? parseFloat(data.gini) : 0,
    planetaOrigen: data.region || 'No especificado',
    debilidad: data.subregion || 'No especificado',
    poderes: [`Población: ${data.population}`, `Área: ${data.area} km²`],
    enemigos: data.timezones ? data.timezones.split(',').map(zone => zone.trim()) : ['Sin información'],
    autor: 'ISABENSA',
  };
};

/**
 * Guarda un nuevo país en la base de datos.
 * @param {Object} data - Datos del formulario.
 * @returns {Promise<{success: boolean, message: string, country?: Object}>} - Resultado del guardado.
 */
export const saveCountry = async (data) => {
  try {
    const mappedData = mapCountryToSuperHero(data);
    const newCountry = new SuperHero(mappedData);
    const savedCountry = await newCountry.save();
    return { success: true, message: 'País guardado exitosamente.', country: savedCountry };
  } catch (error) {
    console.error('Error al guardar el país:', error.message);
    return { success: false, message: 'Error al guardar el país. Por favor, intente nuevamente.' };
  }
};
