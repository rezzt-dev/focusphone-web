<div align="center">

# POLÍTICA DE SEGURIDAD

<sub><a href="./readme.md">readme</a> · <a href="https://github.com/rezzt-dev/focusphone-app">la aplicación</a> · <a href="./license.md">licencia</a></sub>

<br>

<img src="https://img.shields.io/badge/web-est%C3%A1tica-000000?style=flat-square" alt="web estática" />
<img src="https://img.shields.io/badge/backend-ninguno-4c1?style=flat-square" alt="sin backend" />
<img src="https://img.shields.io/badge/cookies-ninguna-4c1?style=flat-square" alt="sin cookies" />
<img src="https://img.shields.io/badge/informes-privados-000000?style=flat-square" alt="informes privados" />

</div>

---

## ALCANCE DE ESTE REPOSITORIO

este repositorio contiene **solo la landing** de focusphone: un sitio estático generado con astro. no
tiene backend, base de datos, cuentas de usuario ni analítica, y no almacena ni envía los datos que
el visitante escribe en el formulario de consulta (solo prepara un borrador local).

las vulnerabilidades de la **aplicación android** (cifrado, contraseñas de detox, bloqueos,
servicios de accesibilidad…) se rigen por la política del repositorio
[focusphone-app](https://github.com/rezzt-dev/focusphone-app) y no se tratan aquí.

---

## VERSIONES SOPORTADAS

solo se mantiene la última versión publicada de la web, es decir, la rama `main`. no hay ramas de
soporte ni parches retroactivos.

| versión | soportada |
|---|---|
| `main` (último despliegue) | sí |
| cualquier compilación anterior | no — actualiza primero |

antes de informar, comprueba que el problema se reproduce con el código actual de `main`.

---

## CÓMO INFORMAR DE UNA VULNERABILIDAD

**no abras un issue público por un problema de seguridad.** usa este canal:

| canal | cuándo |
|---|---|
| `privacy@rezzt.dev` | canal principal. el asunto `[focusphone web security]` evita que el mensaje se pierda |
| aviso privado de github | si el repositorio tiene habilitados los *private vulnerability reports*, también es válido |

### QUÉ INCLUIR

- la url o ruta afectada (`/`, `/instalar/`, `/privacidad/`…) y, si procede, el fichero del repositorio.
- el navegador, su versión y el sistema operativo.
- pasos de reproducción lo más concretos posible y qué obtendría un atacante.
- capturas, cabeceras de respuesta o una prueba de concepto, si las tienes.

### QUÉ ESPERAR

| etapa | objetivo |
|---|---|
| acuse de recibo | en 72 horas |
| valoración inicial (aceptado / no es una vulnerabilidad / se necesita más información) | en 7 días |
| corrección | según la gravedad; los problemas críticos tienen prioridad sobre cualquier funcionalidad |

es un proyecto mantenido por una sola persona y **sin programa de recompensas**: el reconocimiento
se limita a la mención del informante, si lo desea. los plazos son un compromiso de mejor esfuerzo,
no un acuerdo de nivel de servicio.

---

## POLÍTICA DE DIVULGACIÓN

- las correcciones se desarrollan en privado y se publican de forma coordinada con el aviso.
- mantén el informe en privado hasta que se publique la corrección, o 90 días desde el acuse de
  recibo, lo que ocurra antes.
- se acredita al informante con el nombre o alias que elija, salvo que prefiera el anonimato.

---

## DENTRO DEL ALCANCE

- **xss** o inyección de html/js en cualquier página, incluido el borrador del formulario o la
  construcción de la url de github.
- **redirecciones abiertas** o enlaces salientes manipulables mediante parámetros, utm o fragmentos.
- **fugas de privacidad**: peticiones a terceros, cookies, almacenamiento local o medición no
  declarados, o cualquier dato del visitante que salga del navegador.
- **dependencias** con vulnerabilidades explotables en el sitio generado (no solo en las
  herramientas de desarrollo).
- **secretos o credenciales** versionados en el repositorio, en `dist/` o en el historial.
- **configuración de alojamiento** del repositorio que debilite el sitio: `web/public/_headers` y
  `web/deploy/nginx.conf` (caché, cabeceras, reescrituras, 404).
- **suplantación** mediante enlaces de descarga o de repositorio manipulados: la web solo debe
  enlazar a destinos públicos verificados por `npm run test:links`.

## FUERA DEL ALCANCE

- vulnerabilidades de la aplicación android; usa el repositorio de la app.
- hallazgos de escáneres automáticos sin una ruta de explotación demostrable.
- falta de cabeceras o endurecimientos sin vector de ataque en un sitio estático sin sesiones
  (por ejemplo, la ausencia de cookies `HttpOnly` cuando no existe ninguna cookie).
- ataques que requieran un navegador, extensión o dispositivo del visitante ya comprometidos.
- denegación de servicio, ingeniería social y ataques físicos.
- vulnerabilidades del proveedor de alojamiento, de la red o de navegadores de terceros.
- el contenido de herramientas de desarrollo (`devDependencies`) que nunca llegan al sitio publicado.

---

## SI VAS A MODIFICAR CÓDIGO SENSIBLE

cualquier cambio en `web/src/scripts/`, en el formulario de participación o en los verificadores de
`web/scripts/` debe respetar estas reglas:

- **nunca** introducir cookies, `localStorage`, píxeles, sdk o peticiones de medición sin actualizar
  antes `/privacidad/` y este documento.
- **nunca** insertar contenido del visitante con `innerHTML`; usa `textContent` o la construcción
  segura de `URL` / `URLSearchParams`.
- **nunca** cargar fuentes, scripts ni imágenes desde orígenes externos: todo se autoaloja.
- **nunca** enlazar a un repositorio o APK sin pasar por `PUBLIC_PROJECT_URL` y `npm run test:links`.
- **nunca** omitir la comprobación de enlaces públicos para «desbloquear» un build.
- los cambios en dependencias se revisan con `npm audit` y se verifican con `npm run build:production`.

---

<div align="center">

<sub>focusphone — desarrollado por <a href="https://rezzt.dev"><b>rezzt.dev</b></a></sub>

</div>
