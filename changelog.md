# CHANGELOG

## SIN PUBLICAR / UNRELEASED

### CASTELLANO

#### ANADIDO
- añadir la landing informativa en español de focusphone en `web/`, un sitio estatico con astro 7, tailwind css 4 y typescript, independiente de la aplicacion android y sin backend, cuentas ni analitica
- añadir la portada `/` con las secciones filosofia, experiencia del launcher, perfiles, pausa consciente, privacidad, proyecto, primeros pasos, preguntas frecuentes, formulario de consulta y llamada a la accion final, y las paginas `/instalar/`, `/privacidad/`, `/proyecto/`, `404` y `robots.txt`
- añadir un teléfono html/css ilustrativo (`Phone.astro`) con temas y relojes interactivos que reproducen la paleta de la app, marcado como representacion de ejemplo y sin abrir aplicaciones
- añadir perfiles `normal`, `trabajo` y `detox` como pestañas accesibles con teclado, y una pausa de respiracion voluntaria con anime.js que se puede cancelar
- añadir `src/data/site.ts` como fuente unica de la version, los enlaces publicos y las preguntas frecuentes, de modo que sin `PUBLIC_PROJECT_URL` ningun enlace promete una descarga inexistente
- añadir un sistema de movimiento declarativo basado en atributos `data-*` (`reveal`, `scroll`, `header`, `pointer`, `tokens`), tokens en `src/styles/motion.css`, coreografia de carga decidida antes del primer pintado con `MotionBoot.astro`, transiciones de pagina nativas y soporte de `prefers-reduced-motion`
- añadir un formulario que prepara un borrador local para copiar o abrir en github, con validacion de 20 caracteres utiles, limite de 7.000 caracteres en la url y alternativa manual sin javascript, sin guardar ni enviar mensajes
- añadir el evento local `focusphone:conversion` con `detail.action` y `detail.location` para los cta, sin cookies, sdk, pixeles ni peticiones de medicion
- añadir seo completo: canonical, open graph absoluto, tarjeta social generada con `scripts/generate-social.mjs`, sitemap, referencia en `robots.txt` y datos estructurados `SoftwareApplication` sin resenas ni valoraciones inventadas
- añadir las fuentes poppins y jetbrains mono autoalojadas con fontsource y los iconos lucide con tree-shaking mediante `Icon.astro`, sin peticiones externas
- añadir pruebas playwright con axe-core en chromium, firefox y webkit para temas, relojes, teclado, respiracion, menu movil, formulario, enlaces internos, desbordamiento y accesibilidad (`web/tests/`)
- añadir los verificadores `verify-config`, `verify-seo`, `verify-budgets` y `verify-public-links`, y `build-production.mjs` como puerta de publicacion con presupuestos de 40 KiB de js y 15 KiB de css en gzip
- añadir `web/public/_headers` y `web/deploy/nginx.conf` con cache inmutable para assets con hash, gzip y un 404 real sin reescritura global a `index.html`
- añadir `readme.md` profesional con cabecera, badges, tabla del stack, estructura, comandos, verificacion, publicacion y privacidad
- añadir `security.md` con la politica de seguridad de la web: versiones soportadas, canal de informe, plazos, divulgacion, alcance y reglas para modificar codigo sensible
- añadir `license.md` con la licencia de uso no comercial de focusphone, identica a la de la aplicacion
- añadir `agents.md` y `claude.md` con la guia del proyecto para agentes y las convenciones de commit, pr, merge y release
- añadir `.docs/project-docs/` con los documentos de producto, diseño, movimiento y auditoria de la web, y `.docs/commit-guidelines.md` y `.docs/pr-merge-release-guidelines.md`
- añadir `changelog.md` con el formato bilingue y las cinco categorias cerradas
- añadir el enlace directo de descarga al apk `focusphone-v1.4-beta.apk` en la portada y en `/instalar/`, visible solo cuando `PUBLIC_PROJECT_URL` esta definido, con `site.apk`, `site.tag` y `site.stage` en `src/data/site.ts` como fuente unica

#### CAMBIADO
- exigir español de españa y conservar `ñ` y `Ñ`, incluso en formatos que pidan escribir sin acentos

- completar las guías de gestión y el contexto específico del proyecto; conservar las reglas técnicas y verificar las rutas
- corregir el ejemplo de promociones entre ramas para evitar destinos idénticos al origen
- actualizar la web a la version `1.4` beta (`v1.4-beta`) de la app: version y etapa en `src/data/site.ts`, cuadricula de inicio, 20 widgets integrados, pausa consciente guiada y bloqueo de 5 intentos con 15 minutos de espera, y tarjeta social
- ignorar `.docs/`, `node_modules/`, `dist/`, `.astro/`, `.env*` (salvo `.env.example`) y los artefactos de prueba en el `.gitignore` de la raiz, que estaba vacio
- sustituir el `readme.md` anterior por una version centrada en la presentacion del proyecto y corregir las referencias a ficheros y flujos de ci que no existian en este repositorio

#### CORREGIDO
- corregir los enlaces a `documentation/es`, que no existe en `main`, apuntando la documentacion y `verify-public-links` al `README.md` del repositorio publico, y quitar de `privacidad.astro` el enlace a un documento inexistente

#### SEGURIDAD
- publicar la huella sha-256 del apk (`0818562f…`) en `/instalar/` para que se pueda verificar la descarga antes de instalarla
- declarar la politica de privacidad de la web: sin cookies, sin analitica, sin fuentes ni scripts externos y sin envio de los datos del formulario
- verificar sin credenciales que los destinos publicos existen y que hay un apk descargable antes de aceptar `PUBLIC_PROJECT_URL` en un build de produccion
- rechazar origenes `PUBLIC_SITE_URL` con http, credenciales, ruta, parametros o fragmento en `build:production`

### ENGLISH

#### ADDED
- add the Spanish informational landing page for focusphone in `web/`, a static site built with astro 7, tailwind css 4 and typescript, independent from the android app and with no backend, accounts or analytics
- add the `/` home page with philosophy, launcher experience, profiles, conscious pause, privacy, project, first steps, faq, contact form and final call to action sections, plus the `/instalar/`, `/privacidad/`, `/proyecto/`, `404` and `robots.txt` pages
- add an illustrative html/css phone (`Phone.astro`) with interactive themes and clocks reproducing the app palette, marked as an example and never opening apps
- add `normal`, `trabajo` and `detox` profiles as keyboard-accessible tabs, and a voluntary, cancellable breathing pause built with anime.js
- add `src/data/site.ts` as the single source of the version, public links and faqs, so that without `PUBLIC_PROJECT_URL` no link promises a download that does not exist
- add a declarative motion system driven by `data-*` attributes (`reveal`, `scroll`, `header`, `pointer`, `tokens`), tokens in `src/styles/motion.css`, a load choreography decided before first paint by `MotionBoot.astro`, native page transitions and `prefers-reduced-motion` support
- add a form that prepares a local draft to copy or open on github, with a 20 useful character check, a 7,000 character url limit and a manual fallback without javascript, never storing or sending messages
- add the local `focusphone:conversion` event with `detail.action` and `detail.location` for ctas, with no cookies, sdks, pixels or measurement requests
- add complete seo: canonical, absolute open graph, a social card generated by `scripts/generate-social.mjs`, sitemap, `robots.txt` reference and `SoftwareApplication` structured data without invented reviews or ratings
- add self-hosted poppins and jetbrains mono fonts through fontsource and tree-shaken lucide icons through `Icon.astro`, with no external requests
- add playwright tests with axe-core on chromium, firefox and webkit covering themes, clocks, keyboard, breathing, mobile menu, form, internal links, overflow and accessibility (`web/tests/`)
- add the `verify-config`, `verify-seo`, `verify-budgets` and `verify-public-links` checkers, and `build-production.mjs` as the publication gate with budgets of 40 KiB of js and 15 KiB of css gzipped
- add `web/public/_headers` and `web/deploy/nginx.conf` with immutable caching for hashed assets, gzip and a real 404 without a global rewrite to `index.html`
- add a professional `readme.md` with header, badges, stack table, structure, commands, verification, publishing and privacy
- add `security.md` with the website security policy: supported versions, reporting channel, timings, disclosure, scope and rules for touching sensitive code
- add `license.md` with the focusphone non-commercial license, identical to the app's
- add `agents.md` and `claude.md` with the project guide for agents and the commit, pr, merge and release conventions
- add `.docs/project-docs/` with the website product, design, motion and audit documents, and `.docs/commit-guidelines.md` and `.docs/pr-merge-release-guidelines.md`
- add `changelog.md` with the bilingual format and the five closed categories
- add the direct download link to `focusphone-v1.4-beta.apk` on the home page and `/instalar/`, shown only when `PUBLIC_PROJECT_URL` is set, with `site.apk`, `site.tag` and `site.stage` in `src/data/site.ts` as the single source

#### CHANGED
- require spanish from spain and preserve `ñ` and `Ñ`, including formats that omit vowel accents

- complete repository management guides and project-specific context; preserve technical rules and verify paths
- correct the branch promotion example to avoid destinations identical to the source
- update the site to app version `1.4` beta (`v1.4-beta`): version and stage in `src/data/site.ts`, home grid, 20 built-in widgets, guided conscious pause, 5-attempt lockout with a 15-minute cooldown, and the social card
- ignore `.docs/`, `node_modules/`, `dist/`, `.astro/`, `.env*` (except `.env.example`) and test artifacts in the root `.gitignore`, which was empty
- replace the previous `readme.md` with a project-presentation version and fix references to files and ci workflows that did not exist in this repository

#### FIXED
- fix the links to `documentation/es`, which does not exist on `main`, by pointing the documentation link and `verify-public-links` at the public repository `README.md`, and drop the link to a missing document from `privacidad.astro`

#### SECURITY
- publish the apk sha-256 digest (`0818562f…`) on `/instalar/` so the download can be verified before installing
- declare the website privacy policy: no cookies, no analytics, no external fonts or scripts and no transmission of form data
- verify without credentials that public destinations exist and a downloadable apk is available before accepting `PUBLIC_PROJECT_URL` in a production build
- reject `PUBLIC_SITE_URL` origins with http, credentials, path, query or fragment in `build:production`
