import axios from 'axios';
import mongoose from 'mongoose';
import { connectDB } from './config/dbConfig.mjs';
import SuperHero from './models/SuperHero.mjs';

const axiosInstance = axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: 120000, // Timeout aumentado a 2 minutos
    headers: { 'Accept-Encoding': 'gzip, deflate, br' },
});

// Interceptor para manejar reintentos en caso de error
axiosInstance.interceptors.response.use(null, async (error) => {
    const config = error.config;

    // Manejo del contador de reintentos
    if (!config || config._retryCount >= 5) { // Máximo 5 reintentos
        console.error("Error: Máximo de reintentos alcanzado.");
        throw error;
    }

    config._retryCount = (config._retryCount || 0) + 1;
    console.warn(`Reintento ${config._retryCount}: reconectando a la API...`);
    return axiosInstance(config);
});

/**
 * Mapea los países a la estructura del modelo SuperHero, adaptado para la vista dashboard.
 * @param {Array} countries - Lista de países desde la API externa.
 * @returns {Array} - Lista de superhéroes formateados.
 */
function mapToSuperHeroes(countries) {
    return countries
        .filter(country => country.languages && country.languages.spa) // Solo países con idioma "spa"
        .map(country => ({
            nombreSuperHeroe: country.name?.common || "Desconocido", // Nombre común
            nombreReal: country.name?.nativeName?.spa?.official || country.name?.official || "N/A", // Nombre oficial en español
            edad: country.gini && Object.values(country.gini).length > 0 
                ? Object.values(country.gini)[0] 
                : 0, // GINI como edad (número)
            planetaOrigen: country.region || "Desconocido", // Región
            debilidad: country.subregion || "No especificada", // Subregión
            poderes: [
                `Población: ${country.population}`,
                `Área: ${country.area} km²`
            ],
            aliados: country.borders || [], // Fronteras como array
            enemigos: country.timezones || ["Sin información"], // Timezones como array
            autor: "ISABENSA", // Autor fijo
        }));
}

/**
 * Procesa los países desde la API externa y los guarda en la base de datos.
 */
async function processCountriesAsHeroes() {
    try {
        console.log("Consumiendo API externa...");
        const response = await axiosInstance.get('/all');
        const countries = response.data;

        console.log(`Total de países recibidos: ${countries.length}`);
        const mappedHeroes = mapToSuperHeroes(countries);

        console.log("Insertando datos en la base de datos...");
        await SuperHero.insertMany(mappedHeroes);
        console.log("Datos guardados exitosamente.");
    } catch (error) {
        console.error("Error al procesar países como superhéroes:", error.message);
        throw error; // Lanza el error para manejarlo en el bloque principal
    } finally {
        console.log("Cerrando la conexión a la base de datos...");
        mongoose.connection.close();
    }
}

// Ejecutar el script
(async () => {
    try {
        console.log("Conectando a la base de datos...");
        await connectDB();
        console.log("Conexión exitosa.");
        await processCountriesAsHeroes(); // Llama a la función que faltaba
    } catch (error) {
        console.error("Error de conexión:", error.message);
    }
})();
