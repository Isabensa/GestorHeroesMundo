import axios from 'axios';
import mongoose from 'mongoose';
import { connectDB } from './config/dbConfig.mjs'; // Conexión a MongoDB
import SuperHero from './models/SuperHero.mjs'; // Modelo de Superhéroes

// Configuración de Axios con reintentos
const axiosInstance = axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: 30000, // Timeout extendido
    headers: {
        'Accept-Encoding': 'gzip, deflate, br', // Manejo de compresión
    },
});

// Reintentos en caso de errores de conexión
axiosInstance.interceptors.response.use(null, async (error) => {
    const config = error.config;
    if (!config || config._retry) {
        throw error;
    }
    config._retry = true;
    console.warn("Reintentando conexión con la API...");
    return axiosInstance(config);
});

console.log("Iniciando el script para adaptar países como superhéroes...");

/**
 * Mapea los datos de la API externa a la estructura del modelo SuperHero.
 * @param {Array} countries - Lista de países obtenidos de la API externa.
 * @returns {Array} - Lista de datos mapeados a superhéroes.
 */
function mapToSuperHeroes(countries) {
    console.log("Iniciando mapeo de países a superhéroes...");
    const filteredCountries = countries.filter(country => {
        const hasSpanish = country.languages && Object.values(country.languages).includes("Spanish");
        if (hasSpanish) {
            console.log(`País con español detectado: ${country.name?.common || "Desconocido"}`);
        }
        return hasSpanish;
    });

    console.log(`Total de países con español: ${filteredCountries.length}`);

    const mappedHeroes = filteredCountries.map(country => {
        return {
            nombreSuperHeroe: country.name?.common || "Desconocido",
            nombreReal: country.name?.official || "N/A",
            edad: Math.floor(Math.random() * 100),
            planetaOrigen: country.region || "Desconocido",
            debilidad: "Falta de recursos",
            poderes: [`Población de ${country.population}`, `Área de ${country.area || 0} km²`],
            aliados: country.capital || ["Sin Capital"],
            enemigos: ["Fronteras vecinas"],
            autor: "Isabel",
        };
    });

    console.log("Finalizó el mapeo de países a superhéroes.");
    return mappedHeroes;
}

/**
 * Procesa los países desde la API, los adapta a superhéroes y los almacena en la base de datos.
 */
async function processCountriesAsHeroes() {
    try {
        console.log("Consumiendo API externa...");

        // Hacer la solicitud con Axios configurado
        const response = await axiosInstance.get('/all');
        console.log("Respuesta recibida de la API.");

        const countries = response.data;
        console.log(`Total de países recibidos: ${countries.length}`);

        // Mapear los datos a superhéroes
        const mappedHeroes = mapToSuperHeroes(countries);

        console.log("Insertando superhéroes en la base de datos...");
        await SuperHero.insertMany(mappedHeroes);
        console.log("Superhéroes procesados y guardados en la base de datos exitosamente.");
    } catch (error) {
        console.error("Error procesando los países como superhéroes:", error.message);
        console.log("Detalles del error:", error);
    } finally {
        console.log("Cerrando la conexión a la base de datos...");
        mongoose.connection.close();
        console.log("Conexión cerrada.");
    }
}

// Ejecutar el script
(async () => {
    try {
        console.log("Conectando a la base de datos...");
        await connectDB(); // Llamar a la función de conexión
        console.log("Conexión a la base de datos establecida.");
        await processCountriesAsHeroes();
    } catch (dbError) {
        console.error("Error al conectar a la base de datos:", dbError.message);
    } finally {
        console.log("Script finalizado.");
    }
})();
