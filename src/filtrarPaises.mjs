import SuperHero from './models/SuperHero.mjs';
import { connectDB } from './config/dbConfig.mjs';
import axios from 'axios';

const filtrarPaises = async () => {
  try {
    // Conexión a la base de datos
    await connectDB();

    // Llamada a la API externa
    const response = await axios.get('https://restcountries.com/v3.1/all', {
      timeout: 15000,
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'application/json',
      },
    });

    const paises = response.data;

    // Filtrar países hispanohablantes
    const paisesHispanohablantes = paises.filter(pais =>
      pais.languages && Object.keys(pais.languages).includes('spa')
    );

    // Mapear datos según el modelo SuperHero
    const paisesAdaptados = paisesHispanohablantes.map(pais => {
      const { name, capital, population, region, subregion, languages, flags } = pais;

      return {
        nombreSuperHeroe: name.common, // Nombre del país
        nombreReal: capital?.[0] || 'Desconocido', // Capital del país
        edad: population || 0, // Población como edad
        planetaOrigen: region || 'Desconocido', // Región como planeta de origen
        debilidad: subregion || 'Desconocido', // Subregión como debilidad
        poderes: Object.values(languages || {}), // Idiomas como poderes
        aliados: capital || ['Sin aliados'], // Capital como aliados
        enemigos: [flags?.svg || 'Sin bandera'], // Bandera como enemigos
        autor: 'Isabel',
      };
    });

    // Guardar en la base de datos (colección Grupo-02)
    await SuperHero.insertMany(paisesAdaptados);

    console.log('Países adaptados y guardados correctamente:', paisesAdaptados.length);
  } catch (error) {
    console.error('Error al procesar y guardar países:', error.message);
  } finally {
    process.exit(0);
  }
};

filtrarPaises();
