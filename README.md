# NOVA Activación 1.1

Aplicación para desplegar con GitHub y Netlify. Empieza por LEEME_PRIMERO.md y PASOS_NETLIFY.md.

Frontend estático en public/. Backend de Netlify en netlify/functions/. Lógica privada en server/. Sin dependencias npm de la aplicación.

Configuración de producción: ACTIVATION_API_TOKEN y NOVA_ACCESS_CODE, exclusivamente en las variables de entorno de Netlify. .env.example tiene nombres vacíos para desarrollo local.

Pruebas: npm test. Comprobación del paquete: npm run build. Desarrollo local: npm run dev.

La interfaz muestra solo NOVA Activación. La función de servidor utiliza el endpoint de la API contratada, en server/provider.mjs. Cambiar la marca no elimina esa dependencia.

El despliegue de esta distribución se hace en tu cuenta de Netlify. Este ZIP no actualiza el alojamiento anterior de ChatGPT Sites.
