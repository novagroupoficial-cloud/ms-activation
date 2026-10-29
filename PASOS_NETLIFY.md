# Instalación de NOVA Activación 1.1

## 1. Extraer el paquete

Descomprime el ZIP. Identifica la carpeta que contiene package.json, netlify.toml, public/, server/ y netlify/. Estos elementos deben quedar en la raíz del repositorio.

El archivo .env.example contiene nombres sin credenciales. No incluyas archivos .env con valores reales en GitHub.

## 2. Crear el repositorio

En GitHub crea un repositorio, por ejemplo nova-activacion, preferentemente privado. Sube el contenido extraído: carpetas public, server, netlify, scripts y tests, y los archivos raíz del paquete. Confirma los cambios en la rama principal.

No subas el ZIP como único archivo. Asegúrate de que netlify.toml y package.json estén directamente en la raíz del repositorio y que netlify/functions contenga confirmation.mjs, session.mjs y status.mjs.

## 3. Importar en Netlify

En Netlify importa un proyecto existente desde GitHub. Autoriza el acceso al repositorio elegido y selecciónalo.

Netlify leerá netlify.toml. Verifica estos valores:

| Campo | Valor |
|---|---|
| Base directory | Vacío si el paquete está en la raíz del repositorio |
| Build command | npm run build |
| Publish directory | public |
| Functions directory | netlify/functions |
| Node.js | 22 |

El comando build valida los archivos y su sintaxis. No descarga dependencias de la app porque este proyecto no las necesita. La plataforma de Netlify se encarga de empaquetar las funciones de servidor.

## 4. Configurar las dos variables privadas

En la configuración del proyecto de Netlify, abre Environment variables y crea:

| Nombre exacto | Valor que debes introducir |
|---|---|
| ACTIVATION_API_TOKEN | El token real y vigente de tu servicio de activación |
| NOVA_ACCESS_CODE | Una clave aleatoria de acceso para NOVA, de 16 a 256 caracteres |

Introduce los valores en la interfaz de Netlify. No los pegues en HTML, app.js, netlify.toml o el repositorio. No utilices un prefijo VITE_ ni otra opción que los exponga al navegador.

Si tu plan permite seleccionar ámbitos, incluye Functions. Si no ofrece ese selector, utiliza la disponibilidad predeterminada de todos los ámbitos. Para producción, configura los valores en el contexto Production. Marca las variables como secretas cuando esté disponible esa opción.

No necesitas enviar el token por el chat. Añádelo directamente en Netlify.

## 5. Desplegar

Inicia el despliegue. Si agregaste o modificaste las variables después del primer despliegue, ejecuta un nuevo despliegue para aplicarlas a las funciones.

En las funciones del proyecto deben aparecer confirmation, session y status. Espera a que el despliegue termine correctamente y abre el dominio HTTPS que te entregue Netlify.

Las rutas que usa la app son:

- POST /api/session: iniciar sesión.
- DELETE /api/session: cerrar sesión.
- GET /api/status: comprobar configuración sin consumir usos.
- POST /api/confirmation: enviar una consulta de IID al servicio.

## 6. Entrar y revisar la configuración

Introduce tu valor NOVA_ACCESS_CODE en la pantalla de acceso. En Estado de conexión deberás ver Acceso activo y Credencial configurada. Respuesta real de la API seguirá indicando Sin verificar hasta que haya una consulta aceptada que devuelva un CID.

Esta comprobación no valida el saldo, la vigencia del token ni la aceptación del proveedor. Solo confirma que el servidor dispone de la configuración necesaria.

## 7. Hacer la prueba real

1. Selecciona el producto instalado.
2. Obtén su identificador de instalación desde el asistente de activación por teléfono, si la edición lo admite.
3. Pega el IID completo. Admite 54 o 63 números, con o sin separadores.
4. Pulsa Consultar CID una sola vez y espera.
5. Si la API devuelve un CID válido, verás ocho bloques A–H. Estado de conexión registrará que recibió una respuesta real en esta sesión.
6. Copia los bloques al producto y comprueba allí la activación.

La primera prueba real puede consumir un uso del servicio. Si hay un timeout, error de red o respuesta incierta, revisa el historial del servicio antes de enviar de nuevo.

## 8. Resolver problemas

| Mensaje o situación | Qué revisar |
|---|---|
| Acceso pendiente de configuración | NOVA_ACCESS_CODE debe existir en las variables de Netlify y tener entre 16 y 256 caracteres. Haz un nuevo despliegue. |
| Clave de acceso incorrecta | Introduce el valor de NOVA_ACCESS_CODE, no el token del proveedor. |
| Credencial pendiente | Verifica ACTIVATION_API_TOKEN en el contexto y ámbito correctos. Haz un nuevo despliegue. |
| Servicio de la app no disponible / 404 | Confirma que se desplegaron las tres funciones. Subir solo archivos HTML no despliega el servidor. |
| Credencial rechazada o usos agotados | Verifica con el proveedor la vigencia del token y sus usos disponibles. |
| API rechazó la conexión | El proveedor puede restringir llamadas desde ciertos alojamientos o IP. Consulta sus condiciones de API y solicita habilitación legítima si procede. |
| IID rechazado o bloqueado | Revisa que el IID corresponda al producto y a la licencia instalada. |
| Límite temporal de solicitudes | Espera antes de repetir. Netlify y el proveedor pueden aplicar límites. |
| Sesión vencida | Vuelve a introducir la clave de acceso. |

Los mensajes de la app no incluyen el token ni el cuerpo bruto del proveedor. Evita publicar capturas de la sección de variables privadas.

## 9. Actualizar

Modifica los archivos y confirma los cambios en GitHub. Netlify reconstruirá el proyecto si está activado el despliegue continuo. Mantén las variables privadas en Netlify.

Para cambiar la clave de entrada, modifica NOVA_ACCESS_CODE y vuelve a desplegar. Las sesiones firmadas con la clave anterior dejarán de ser válidas en el nuevo despliegue.

## Desarrollo local opcional

Instala Node.js 22 o superior. Copia .env.example a .env y añade los dos valores solo en tu computador. En la carpeta del proyecto ejecuta npm test, npm run build y npm run dev. Abre la dirección local mostrada.

El servidor local utiliza cookies sin Secure únicamente para desarrollo en HTTP. Las funciones desplegadas usan Secure. El modo local no es un servicio público para producción.

## Referencias de despliegue

- Funciones de Netlify: https://docs.netlify.com/build/functions/get-started/
- Variables para funciones: https://docs.netlify.com/build/functions/environment-variables/
- Límites de solicitudes: https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/
- Despliegues: https://docs.netlify.com/deploy/create-deploys/
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
