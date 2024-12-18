import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { connectDB } from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import countryRoutes from './routes/countryRoutes.mjs'; // Importar rutas de países

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
connectDB();

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', ['./views', './views2']); // Incluir views2 para las vistas de países
app.use(expressLayouts);

// Configuración de layout
app.set('layout', 'layouts/layout'); // Layout principal para superhéroes

// Servir archivos estáticos
app.use(express.static('public'));

// Middleware global para registrar cada solicitud
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Configuración de rutas
// Rutas de superhéroes con prefijo /api/superheroes
app.use('/api/superheroes', superHeroRoutes);

// Rutas de países con prefijo /api/paises
app.use('/api/paises', countryRoutes);

// Ruta principal (home)
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Inicio' });
});

// Manejo de errores para ruta no encontrada
app.use((req, res) => {
  res.status(404).send({ mensaje: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
