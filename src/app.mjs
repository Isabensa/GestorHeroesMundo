import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv'; // ✅ Cargar variables de entorno
import { connectDB } from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import countryRoutes from './routes/countryRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

// ================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ================================
dotenv.config(); // ✅ Esto habilita process.env.MONGO_URI y process.env.PORT

// ================================
// CONFIGURACIÓN DE RUTAS Y PATH
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// CONEXIÓN A MONGODB
// ================================
connectDB();

// ================================
// MIDDLEWARES GENERALES
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Configurar layouts globales
app.use(expressLayouts);

// ================================
// CONFIGURACIÓN DE MOTOR DE PLANTILLAS
// ================================

// Motor EJS
app.set('view engine', 'ejs');

// ✅ Se agregan ambas carpetas de vistas (para superhéroes y países)
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views2'),
]);

// ✅ Layout por defecto (superhéroes usa layout.ejs)
app.set('layout', 'layouts/layout');

// ================================
// LOG DE TODAS LAS SOLICITUDES
// ================================
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// ================================
// RUTAS PRINCIPALES
// ================================

// 🏠 Página inicial
app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Gestor Héroes Mundo' });
});

// 🦸‍♂️ Superhéroes
app.use('/superheroes', superHeroRoutes);

// 🌍 Países
app.use('/paises', countryRoutes);

// ================================
// MANEJO DE ERRORES (404)
// ================================
app.use((req, res) => {
  res.status(404).render('pages/404', {
    layout: 'layouts/layout',
    title: 'Página no encontrada',
    mensaje: 'La ruta solicitada no existe en el sistema.',
  });
});

// ================================
// INICIO DEL SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
