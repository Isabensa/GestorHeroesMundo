import SuperHero from '../models/SuperHero.mjs';

/**
 * Obtiene todos los países guardados con el autor ISABENSA y los transforma al formato esperado por la vista.
 * @returns {Promise<Array>} - Lista de países transformados.
 */
export const fetchCountries = async () => {
  const countries = await SuperHero.find({ autor: 'ISABENSA' });
  return countries.map(country => {
    const areaFromPowers = country.poderes?.find(p => p.startsWith('Área:'));
    const areaValue = areaFromPowers ? parseFloat(areaFromPowers.split(': ')[1].replace(' km²', '')) : null; // Remover unidades si existen y convertir a número
    return {
      id: country._id ? country._id.toString() : 'No disponible', // Agregar el campo ID convertido a string
      name: country.nombreSuperHeroe || 'No especificado',
      capital: country.nombreReal || 'No especificado', // Cambiado de officialName a capital
      area: country.area || areaValue || 0, // Priorizar campo directo, luego área procesada
      borders: Array.isArray(country.aliados) ? country.aliados.join(', ') : 'Sin fronteras',
      gini: typeof country.edad === 'number' ? country.edad : 'No especificado',
      population: country.poderes?.find(p => p.startsWith('Población:'))?.split(': ')[1] || 'No disponible',
      timezones: Array.isArray(country.enemigos) ? country.enemigos.join(', ') : 'Sin información',
      region: country.planetaOrigen || 'No especificado',
      subregion: country.debilidad || 'No especificado',
      creador: country.autor || 'Desconocido',
    };
  });
};

/**
 * Busca un país en la colección por su ID.
 * @param {string} id - ID del país a buscar.
 * @returns {Promise<Object|null>} - Datos del país o null si no existe.
 */
/**
 * Busca un país por su ID y devuelve los datos completos.
 * @param {string} id - ID del país a buscar.
 * @returns {Promise<Object|null>} - País encontrado o null.
 */
export const fetchCountryById = async (id) => {
  try {
    const country = await SuperHero.findById(id);
    if (!country) return null;

    const areaFromPowers = country.poderes?.find(p => p.startsWith('Área:'));
    const areaValue = areaFromPowers ? parseFloat(areaFromPowers.split(': ')[1].replace(' km²', '')) : null;

    return {
      id: country._id ? country._id.toString() : 'No disponible',
      name: country.nombreSuperHeroe || 'No especificado',
      capital: country.nombreReal || 'No especificado',
      area: country.area || areaValue || 0, // Aquí priorizamos `area` del documento o procesada
      borders: Array.isArray(country.aliados) ? country.aliados.join(', ') : 'Sin fronteras',
      gini: typeof country.edad === 'number' ? country.edad : 'No especificado',
      population: country.poderes?.find(p => p.startsWith('Población:'))?.split(': ')[1] || 'No disponible',
      timezones: Array.isArray(country.enemigos) ? country.enemigos.join(', ') : 'Sin información',
      region: country.planetaOrigen || 'No especificado',
      subregion: country.debilidad || 'No especificado',
      creador: country.autor || 'Desconocido',
    };
  } catch (error) {
    console.error('Error al buscar país por ID:', error.message);
    throw error;
  }
};


/**
 * Mapea los datos ingresados en el formulario al formato esperado por el modelo SuperHero.
 * @param {Object} data - Datos del formulario.
 * @returns {Object} - Datos mapeados para el modelo SuperHero.
 */
export const mapCountryToSuperHero = (data) => {
  return {
    nombreSuperHeroe: data.name,
    nombreReal: data.capital || 'Desconocida', // Ajuste para mapear correctamente el nombre oficial
    aliados: Array.isArray(data.borders)
      ? data.borders
      : (data.borders ? data.borders.split(',').map(border => border.trim()) : []),
    edad: data.gini !== undefined && data.gini !== null ? parseFloat(data.gini) : 0,
    planetaOrigen: data.region || 'No especificado',
    debilidad: data.subregion || 'No especificado',
    area: data.area && !isNaN(data.area) ? parseFloat(data.area) : 0, // Validación adicional para números
    poderes: [
      `Población: ${data.population}`,
      `Área: ${data.area} km²` // Mantener área con unidades en poderes
    ],
    enemigos: Array.isArray(data.timezones)
      ? data.timezones
      : (data.timezones ? data.timezones.split(',').map(zone => zone.trim()) : ['Sin información']),
    autor: 'ISABENSA',
  };
};

/**
 * Guarda un nuevo país o actualiza uno existente en la base de datos.
 * @param {Object} data - Datos del formulario.
 * @returns {Promise<{success: boolean, message: string, country?: Object}>} - Resultado del guardado o actualización.
 */
export const saveCountry = async (data) => {
  try {
    if (data.id) {
      console.log('Intentando actualizar país con ID:', data.id);
      const updatedCountry = await SuperHero.findByIdAndUpdate(
        data.id.trim(),
        mapCountryToSuperHero(data),
        { new: true, runValidators: true } // Retornar documento actualizado y validar
      );
      if (!updatedCountry) {
        return { success: false, message: 'No se encontró el país para actualizar.' };
      }
      return { success: true, message: 'País actualizado exitosamente.', country: updatedCountry };
    } else {
      console.log('Creando un nuevo país...');
      const newCountry = new SuperHero(mapCountryToSuperHero(data));
      const savedCountry = await newCountry.save();
      return { success: true, message: 'País guardado exitosamente.', country: savedCountry };
    }
  } catch (error) {
    console.error('Error al guardar el país:', error.message);
    return { success: false, message: 'Error interno del servidor.' };
  }
};

/**
 * Elimina un país por su ID.
 * @param {string} id - ID del país a eliminar.
 * @returns {Promise<{success: boolean, message: string}>} - Resultado de la eliminación.
 */
export const deleteCountryById = async (id) => {
  try {
    const result = await SuperHero.findByIdAndDelete(id.trim());
    return result
      ? { success: true, message: 'País eliminado exitosamente.' }
      : { success: false, message: 'No se encontró el país.' };
  } catch (error) {
    console.error('Error al eliminar el país:', error.message);
    return { success: false, message: 'Error interno del servidor.' };
  }
};
