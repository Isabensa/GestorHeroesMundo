GestorHeroesMundo: Documentación del Proyecto

Aplicación web fullstack desarrollada con Node.js, Express y MongoDB, que permite la gestión de superhéroes y países, integrando información obtenida de APIs externas. 
El sistema aplica un enfoque modular y escalable basado en el patrón MVC (Modelo–Vista–Controlador).

🎯 Objetivos del Proyecto
El objetivo principal de este proyecto es desarrollar una aplicación web robusta que:
- Procese y almacene datos obtenidos de APIs externas.
- Valide y transforme los datos antes de guardarlos en la base de datos.
- Presente los resultados en una interfaz web intuitiva mediante plantillas EJS.
- Implemente un manejo de errores sólido y validaciones consistentes.

🧠 Tecnologías Utilizadas
- Node.js: Entorno de ejecución para JavaScript.
- Express.js: Framework backend para crear servidores web.
- MongoDB: Base de datos NoSQL para almacenar los datos procesados.
- Mongoose: ODM para interactuar con MongoDB.
- Axios: Cliente HTTP para consumir la API externa de países.
- EJS: Motor de plantillas para renderizar vistas dinámicas.
- Express Validator: Validación de formularios.
- Helmet: Seguridad HTTP.
- Dotenv: Manejo de variables de entorno.

🏗️ Estructura del Proyecto
src/
 ├── app.mjs                # Archivo principal del servidor
 ├── config/                # Configuraciones (DB, entorno)
 ├── controllers/           # Controladores para superhéroes y países
 ├── filtrarPaises.mjs      # Procesa datos desde la API de países
 ├── models/                # Modelos de datos de MongoDB
 ├── public/                # Archivos estáticos (CSS, JS, imágenes)
 ├── repositories/          # Capa de acceso a la base de datos
 ├── routes/                # Definición de rutas principales
 ├── services/              # Lógica de negocio (servicios)
 ├── testRepository.mjs     # Pruebas del servicio de países
 ├── validators/            # Validaciones y manejo de errores
 ├── views/                 # Vistas EJS (módulo de Superhéroes)
 └── views2/                # Vistas EJS (módulo de Países)

⚙️ Pasos para Ejecutar la Aplicación
1. Clonar el repositorio:
   git clone https://github.com/tuusuario/GestorHeroesMundo.git
   cd GestorHeroesMundo

2. Instalar dependencias:
   npm install

3. Configurar las variables de entorno (.env):
   PORT=3000
   MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/

4. Iniciar el servidor:
   npm start
   o en modo desarrollo:
   npm run dev

5. Abrir en el navegador: http://localhost:3000

🔍 Validaciones y Manejo de Errores
✅ Validaciones
- Los formularios se validan dentro de la carpeta validators/.
- Los campos como borders y timezones se transforman para almacenarse como arrays.
- Se garantiza la integridad y coherencia de los datos ingresados.

⚠️ Manejo de Errores
- Fallos en las peticiones a la API externa se manejan con reintentos automáticos en Axios.
- Los errores inesperados se registran en consola para depuración.
- Las validaciones incorrectas generan mensajes claros y descriptivos en la interfaz.

🌐 API Externa
La aplicación consume la API pública de países: https://restcountries.com/v3.1/all
Los datos se procesan y almacenan en MongoDB para evitar llamadas repetitivas y mejorar el rendimiento general del sistema.

🧩 Multivistas y Organización
- Superhéroes: gestionados desde views/.
- Países: gestionados desde views2/.
Cada módulo cuenta con sus propios formularios, validaciones y vistas.

📸 Capturas de Pantalla (Sugeridas)
- Interfaz principal.
- Formulario de registro de superhéroes.
- Panel de países procesados.
- Mensajes de validación y errores.

🎬 Demostración en Video (opcional)
Se recomienda grabar un breve recorrido mostrando:
1. Cómo se ingresan datos válidos e inválidos.
2. Cómo se cargan los países desde la API externa.
3. Cómo se guardan y visualizan los datos en MongoDB.

🧾 Conclusión
GestorHeroesMundo combina integración con APIs externas, validaciones robustas y una interfaz clara y funcional. 
Su diseño modular y escalable lo convierte en una base sólida para proyectos educativos o profesionales de gestión web y procesamiento de datos.

👩‍💻 Autora
Celia Isabel Bensadón - Desarrolladora Fullstack MERN | Docente en Tecnología Educativa  

## Última actualización
- Corrección del módulo Países (layout2.ejs, dashboard2.ejs y controladores)
- Estilos aplicados correctamente desde style2.css
- Navegación funcional con EJS y Express


