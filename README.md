# Documentación del Proyecto

## Objetivos del Proyecto
El objetivo principal de este proyecto es crear una aplicación web que permita la gestión de datos de superhéroes y países, integrando funcionalidades como:

1. Procesamiento y almacenamiento de datos obtenidos de APIs externas.
2. Validación y transformación de datos antes de almacenarlos en la base de datos.
3. Presentación de datos en una interfaz web intuitiva utilizando plantillas EJS.
4. Manejo de errores y validaciones robustas.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework para la creación de aplicaciones web.
- **MongoDB**: Base de datos NoSQL para almacenar los datos procesados.
- **Mongoose**: ODM para interactuar con MongoDB.
- **Axios**: Cliente HTTP para consumir APIs externas.
- **EJS**: Motor de plantillas para renderizar vistas.

## Estructura del Proyecto

```
/src
  |-- app.mjs                # Archivo principal para iniciar el servidor
  |-- config                 # Configuraciones de la aplicación
  |-- controllers            # Lógica de las rutas
  |-- filtrarPaises.mjs      # Procesamiento de datos de la API de países
  |-- models                 # Modelos de datos para MongoDB
  |-- public                 # Archivos estáticos (CSS, JS, imágenes)
  |-- repositories           # Abstracción para acceso a datos
  |-- routes                 # Definición de rutas
  |-- services               # Servicios para lógica de negocio
  |-- testRepository.mjs     # Archivo para pruebas del servicio de países
  |-- validators             # Validaciones de datos
  |-- views                  # Plantillas principales de EJS
  |-- views2                 # Plantillas adicionales para datos de países
```

## Pasos para Ejecutar la Aplicación

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Instalar dependencias**:
   Asegúrese de tener Node.js instalado, luego ejecute:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   MONGO_URI=<URL_DE_SU_BASE_DE_DATOS>
   ```

4. **Iniciar la aplicación**:
   ```bash
   node src/app.mjs
   ```

5. **Abrir en el navegador**:
   Visite `http://localhost:3000` para interactuar con la aplicación.

## Validaciones y Manejo de Errores

- **Validaciones**:
  - Los datos enviados mediante formularios son validados en `validators` antes de ser procesados.
  - Los campos como `borders` y `timezones` son transformados para ser almacenados como arrays.

- **Manejo de errores**:
  - La aplicación maneja errores de conexión con la API externa mediante reintentos automáticos configurados en Axios.
  - Errores inesperados se registran en la consola para depuración.

## Consideraciones Especiales

1. **APIs Externas**:
   - La aplicación depende de la API `https://restcountries.com/v3.1` para obtener datos de países.

2. **Rendimiento**:
   - Los datos de la API externa son procesados y almacenados localmente para reducir llamadas repetitivas.

3. **Multivistas**:
   - Las vistas para superhéroes y países están separadas en los directorios `views` y `views2`.

## Capturas de Pantalla y Demostración

- **Capturas de pantalla**:
  Incluya capturas de:
  - La interfaz principal.
  - Formularios de entrada.
  - Mensajes de error por validaciones fallidas.

- **Video**:
  Se recomienda grabar un recorrido breve mostrando:
  1. Cómo se ingresan datos válidos e inválidos.
  2. Cómo se presentan los datos almacenados.

## Conclusión
Este proyecto combina integraciones con APIs externas, validaciones robustas y una interfaz intuitiva para la gestión de datos. El enfoque modular asegura escalabilidad y mantenibilidad para futuras expansiones.


