# NOVA Activación 1.1 — Netlify + GitHub

Este paquete sustituye la distribución anterior para desplegar en tu propio alojamiento. La interfaz utiliza exclusivamente la marca NOVA, sin el modo manual ni enlaces de activación externos.

La conexión de producción está implementada en las funciones de servidor. Al pulsar Consultar CID se envía el IID a la API contratada y se muestra el CID que esta devuelve. El programa no genera respuestas ficticias. Para que funcione debes configurar una credencial de servicio válida; la marca propia no sustituye ese contrato ni sus usos disponibles.

## Requisitos

- Una cuenta de GitHub y una cuenta de Netlify.
- El token vigente de tu servicio de activación.
- Una clave de acceso propia de NOVA, aleatoria, de al menos 16 caracteres. Se recomienda una clave diferente de las que utilizas en otros servicios.
- Un producto instalado con licencia válida y un IID compatible para probar la consulta real.

## Qué incluye

- Interfaz estática sin paquetes externos ni compilación compleja.
- Tres funciones: sesión, estado y consulta de confirmación.
- Credencial de servicio solo en el servidor.
- Acceso con cookie firmada, HttpOnly, Secure y SameSite=Strict, con validez de 8 horas.
- Límites de solicitudes configurados para las funciones en Netlify.
- Validación de IID, CID y respuesta del proveedor.
- Copia del CID completo, copia por bloques A–H y descarga TXT.
- Historial de hasta 50 registros en memoria de la pestaña.
- Pruebas automatizadas y servidor local opcional.

## Empieza aquí

Sigue PASOS_NETLIFY.md. La ruta prevista es GitHub como repositorio y Netlify como alojamiento. GitHub Pages no ejecuta estas funciones de servidor.

No subas solamente el archivo ZIP al repositorio: extrae el contenido y sube los archivos y carpetas, incluyendo netlify.toml y netlify/functions. No publiques únicamente public/ mediante arrastrar y soltar: faltaría la API.

## Estado de verificación de la entrega

Las pruebas automatizadas verifican el flujo completo de la función con respuestas controladas del proveedor, autenticación, errores y protección de credenciales. Estas pruebas no consumen usos y no son un modo de simulación de la aplicación.

No se recibió un token real ni un IID autorizado para una prueba de activación. La aceptación de la credencial y la disponibilidad del proveedor desde Netlify deben verificarse después de configurar el despliegue con una consulta real. El panel distingue Configurada de Respuesta recibida; comprobar configuración no verifica el token con el proveedor.

## Alcance

La app entrega el CID recibido y facilita su copia. La introducción del CID y la comprobación de activación se completan en Windows, Office, Project o Visio. No instala claves ni acredita derechos de licencia.

Esta versión utiliza una clave de acceso compartida para tu equipo de trabajo. Para una plataforma comercial con cuentas individuales, cuotas, pagos y créditos por cliente debe añadirse ese módulo antes de ofrecer esos servicios.

Las solicitudes pueden consumir usos del proveedor. No hay reintentos automáticos. Ante una interrupción, revisa el historial del servicio antes de repetir la operación.
