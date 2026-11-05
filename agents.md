# FocusPhone Web — Agent Guide

> Guide for AI agents (and humans) working on the FocusPhone landing page.
> [`claude.md`](claude.md) carries only the commit / PR / merge / release
> conventions; everything else lives here. The app itself is a separate
> repository: <https://github.com/rezzt-dev/focusphone-app>.

---

## Project Overview

**FocusPhone Web** is the Spanish-language, fully static landing page for
FocusPhone, a minimalist Android launcher (text-only home screen, focus
profiles, a conscious pause before opening apps). It is independent from the
Android app: no backend, no accounts, no analytics, no cookies.

- **Current app version shown:** `1.0.6` alpha (source of truth: `web/src/data/site.ts`).
- **Canonical origin:** `https://focusphone.rezzt.dev` (default, overridable via `PUBLIC_SITE_URL`).
- **Language of the site:** Spanish, lowercase headings in the app's calm voice, sentence-case body copy.
- **Status:** not deployed from this repository. No Google Play listing, and no public APK yet.

### Hard product rules

- No fabricated social proof (testimonials, ratings, download counts, countdowns).
- Phone mockups are **illustrative HTML/CSS**, never presented as official screenshots.
- Never promise a download that does not exist. With no `PUBLIC_PROJECT_URL`, CTAs go to `/proyecto/` and `/instalar/#disponibilidad`.
- Never link to a public destination that returns 404 or requires authentication.
- Never add cookies, pixels, SDKs, third-party requests or measurement without first updating `/privacidad/` and `security.md`.
- Everything must be readable and usable without JavaScript.

---

## Technology Stack

| area | choice |
|---|---|
| framework | Astro 7, static output, `trailingSlash: 'always'` |
| styling | Tailwind CSS 4 (`@tailwindcss/vite`) + semantic OKLCH tokens in `src/styles/global.css` |
| language | TypeScript 6 (strict `astro check`) |
| motion | Anime.js 4 (WAAPI for entrances and scroll, its own engine for breathing) |
| icons | `@lucide/astro`, tree-shaken through `src/components/Icon.astro` |
| fonts | Fontsource Poppins 400/500/600 and JetBrains Mono 400, self-hosted Latin WOFF2 |
| tests | Playwright (Chromium, Firefox, WebKit) + `@axe-core/playwright` |
| formatting | Prettier + `prettier-plugin-astro` |
| runtime | Node.js `>=22.23.4`, npm |

---

## Project Structure

```text
focusphone-web/
├── readme.md · security.md · license.md · agents.md · claude.md
├── .docs/                      # gitignored: project docs, guidelines, agent skills
│   ├── project-docs/           # product-doc, design-doc, motion-doc, audit-doc
│   ├── commit-guidelines.md
│   └── pr-merge-release-guidelines.md
└── web/
    ├── astro.config.mjs        # site origin validation, sitemap integration
    ├── package.json · .npmrc · .prettierrc.json · tsconfig.json
    ├── playwright.config.ts
    ├── .env.example            # PUBLIC_SITE_URL, PUBLIC_PROJECT_URL
    ├── deploy/nginx.conf       # cache, gzip and real 404 for nginx
    ├── public/                 # images, licenses, downloads, _headers
    ├── scripts/                # build-production, generate-social, verify-{config,seo,budgets,public-links}
    ├── src/
    │   ├── layouts/Base.astro  # metadata, fonts, global styles
    │   ├── pages/              # index, instalar, privacidad, proyecto, 404, robots.txt.ts
    │   ├── components/         # Header, Footer, Icon, Phone, MotionBoot
    │   ├── data/site.ts        # version, links, FAQs (single source of truth)
    │   ├── scripts/            # site.ts, breath.ts, feedback.ts, animations/
    │   └── styles/             # global.css, motion.css
    └── tests/                  # landing.spec.ts + pages/Landing.ts (page object)
```

> `.docs/` is gitignored and may be absent. The project docs under
> `.docs/project-docs/` are the reference for product, design, motion and audit decisions.
> Read the relevant one **before** changing visuals or motion.

---

## Build Commands

All commands run from `web/`.

```bash
npm ci                    # install exactly what package-lock.json says
npm run dev               # dev server (http://localhost:4321)
npm run check             # astro check + TypeScript
npm run build             # check + static build into dist/
npm run preview           # serve the local build
npm run format            # prettier --write
npm run format:check      # prettier --check
npm run install:browsers  # Playwright: chromium, firefox, webkit
npm run test:e2e          # Playwright + axe-core
npm run test:seo          # canonical, Open Graph, sitemap, robots
npm run test:budgets      # JS <= 40 KiB gzip, CSS <= 15 KiB gzip across all pages
npm run test:links        # public destinations reachable without auth
npm run build:production  # config + build + seo + budgets + links (the release gate)
npm run prepare:assets    # regenerate public/images/social.{png,svg}
```

### Build Configuration Notes

- `.npmrc` disables executable symlinks and every script calls Node directly, because this repository lives on **exFAT**. Do not "simplify" the scripts back to `astro ...` binaries.
- `PUBLIC_SITE_URL` must be an HTTPS origin with no credentials, path, query or fragment; `build:production` enforces this.
- `PUBLIC_PROJECT_URL` must be a `https://github.com/<owner>/<repo>` URL. Set it **only** when the repository, docs, issues and a downloadable APK are public; `build:production` verifies that and fails otherwise.
- The `format` / `format:check` scripts list `README.md PRODUCT.md DESIGN.md MOTION.md` inside `web/`; those files live elsewhere now (`../readme.md`, `../.docs/project-docs/`). If Prettier complains about missing paths, update the scripts rather than recreating the files.

---

## Code Style Guidelines

### Language & Tone

- **Site copy:** Spanish. Headings in lowercase; body in sentence case. Calm, concrete, never urgent.
- **Code, identifiers, comments, commit-adjacent docs:** follow the existing conventions of the file you touch.
- Avoid marketing superlatives and unverifiable performance claims.

### Formatting Conventions

- Prettier is the formatter (`.prettierrc.json`); run `npm run format` before committing.
- Semantic HTML first: `button` for actions, `a` for navigation, native `details` for the FAQ.
- Colors, spacing and motion come from CSS tokens (`global.css`, `motion.css`), never hard-coded in components.

### UI Patterns

- **Container:** max width 1240px, gutters 56px (desktop) / 22px (mobile). Breakpoints: 1150, 900 and 640px. Must hold at 320px.
- **Phone mockup:** always the shared `Phone.astro`; it is marked illustrative and its buttons show example messages only.
- **Icons:** only through `Icon.astro` (tree-shaken Lucide).
- **Interactive widgets:** tabs implement the WAI-ARIA keyboard pattern (arrows, Home, End); toggles expose `aria-pressed`.

### Motion

- Animations are declarative via `data-*` attributes (`data-animate`, `data-intro`, `data-animate-delay`, …) handled by `src/scripts/animations/`. Variants: `fade-up` (default), `settle`, `rise`, `product`, `fade`, `scale`, `clip`.
- Tokens live in `src/styles/motion.css` and are the **only** source of timings and easings.
- `MotionBoot.astro` decides before first paint whether the load choreography plays.
- Must respect `prefers-reduced-motion`. No perpetual loops, scroll hijacking or custom cursor.
- Full direction: `.docs/project-docs/motion-doc.md`.

---

## Testing Strategy

- Playwright specs in `web/tests/` use a page object (`tests/pages/Landing.ts`). Prefer role- and name-based locators over CSS selectors.
- Covered today: themes and clocks, phone interaction, profile tabs with keyboard, breathing with cancel, mobile and tablet menu, form validation and GitHub draft preparation, FAQ, pages and internal links, no horizontal overflow, axe-core on desktop and mobile.
- New interactive behavior needs a spec. Visual-only changes need a manual check at 320, 640, 900 and 1240px.
- Automated accessibility checks complement manual review; they are not a certification.
- Before declaring a task done: `npm run check`, `npm run format:check`, `npm run build:production` and `npm run test:e2e`. Report any failure verbatim — do not claim a green run you did not see.

---

## Key Decisions

### 1. Static, no backend

The contact form only **prepares a local draft** to copy or open on GitHub (only if a public repo is configured). Messages under 20 useful characters are rejected; if the GitHub URL exceeds 7,000 characters the text is offered for copy separately; if clipboard access is denied the text is selected for manual copying.

### 2. Honest availability

`site.ts` derives `repository`, `releases`, `documentation` and `issues` from `PUBLIC_PROJECT_URL`. Without it every link resolves to an internal page. Never hard-code a GitHub URL elsewhere.

### 3. Local conversion event only

Marked CTAs dispatch the browser event `focusphone:conversion` with `detail.action` (`releases`, `repository`, `availability`, `project`) and `detail.location`. Nothing is stored or sent. A click is not an install.

### 4. Performance budgets are build gates

JS ≤ 40 KiB gzip and CSS ≤ 15 KiB gzip across all pages. The breathing script ships only on the landing. A new dependency or script must fit the budget.

### 5. Self-hosted everything

No external fonts, images, scripts or analytics. Social cards (`public/images/social.png|svg`) are generated by `scripts/generate-social.mjs`.

### 6. Cross-document view transitions

Native page transitions keep the header and reverse direction when returning home. Don't replace them with a client-side router.

---

## Security Considerations

- Never insert visitor-provided text with `innerHTML`; use `textContent` and `URL` / `URLSearchParams`.
- Never version secrets. `.env` and `.env.*` are gitignored (only `.env.example` is tracked).
- Browser baseline: Chrome 111+, Safari 16.4+, Firefox 128+.
- Hosting headers live in `web/public/_headers` and `web/deploy/nginx.conf`; keep both policies equivalent. Do not use a global rewrite to `index.html` (a missing route must return a real 404).
- Vulnerability reporting policy: [`security.md`](security.md).

---

## Common Tasks for Agents

### Updating the app version

1. Edit `version` and the FAQ strings in `web/src/data/site.ts`.
2. Check the "alpha" copy in `index.astro`, `instalar.astro` and structured data.
3. `npm run prepare:assets` to regenerate the social card.
4. `npm run build:production`.

### Adding a page

1. Create `src/pages/<name>.astro` using `Base`, `Header` and `Footer`; give it a unique title and description.
2. Link it from header/footer consistently and add it to the Playwright internal-link coverage.
3. Confirm sitemap and canonical via `npm run test:seo`.

### Adding a landing section

1. Read the matching section in `.docs/project-docs/design-doc.md` (purpose, hierarchy, interactions, transition).
2. Use semantic headings and `data-animate` variants; keep default HTML visible without JS.
3. Add a spec if the section is interactive; run axe through `npm run test:e2e`.

### Publishing the project links

Only when repo, docs, issues and APK are public: set `PUBLIC_PROJECT_URL`, run `npm run build:production`, and update `/privacidad/` if hosting or measurement changed.

---

## Deployment Notes

- Output is `web/dist/`, designed for the **root** of the domain on static hosting with `404.html` as the error page and trailing-slash routes.
- `deploy/nginx.conf` expects `dist/` copied to `/srv/focusphone` behind the platform's HTTPS endpoint.
- Nothing has been deployed or TLS-configured from this repository. Do not claim otherwise.
- Pre-publication checks on the real domain: HTTP→HTTPS and canonical-host redirects, a 404 on a missing route, compression, caching, canonical, social card; Safari iOS and Chrome Android on real devices; keyboard and screen reader; 200 % zoom and 400 % reflow; field LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 once there is traffic.

---

## Commit, PR, Merge & Release Guidelines

> `.docs/` is gitignored (not present in every clone or agent environment), so the
> full content of `.docs/commit-guidelines.md` and `.docs/pr-merge-release-guidelines.md`
> is duplicated below verbatim. Both `agents.md` and `claude.md` carry the same copy so
> any agent has it regardless of which file it reads first. If `.docs/` is present
> locally, treat it as the source of truth and keep this copy in sync with it.
>
> This repository does not have a `changelog.md` yet. Until one exists, PR and
> release text is written directly in the same category format described below.

### `.docs/commit-guidelines.md`

# COMMIT GUIDELINES

> instrucciones para cualquier agente de ia (o persona) que redacte el titulo
> y la descripcion de un commit de git en este repositorio. se aplica siempre
> que se pida algo equivalente a:
>
> *"sacame el titulo y la descripcion para el commit con los cambios
> realizados desde el ultimo commit. fijate en los anteriores commits para
> que tengan el mismo formato."*
>
> y, de forma general, **cada vez que se vaya a crear un commit en este
> repositorio**, se haya pedido explicitamente o no.

---

#### FORMATO FIJO DEL TITULO

```
<prefijo> | <resumen corto en imperativo>
```

el separador es siempre espacio, barra vertical, espacio: ` | `. el
`<prefijo>` es siempre una de estas cinco palabras, en minusculas, y nunca
se combinan ni se inventan otras nuevas:

| prefijo | cuando usarlo |
|---|---|
| **update** | trabajo normal hacia adelante: se añade o mejora una funcionalidad, contenido o documento existente. es el prefijo por defecto. |
| **fix** | se corrige un error o comportamiento incorrecto detectado durante el desarrollo, sin urgencia de publicacion inmediata. |
| **hotfix** | se corrige algo urgente que afecta a una version ya publicada o a un bloqueo critico. debe usarse solo cuando la correccion es realmente urgente. |
| **changes** | cambios estructurales o no funcionales: reorganizar carpetas, renombrar ficheros, tocar configuracion o tooling, dependencias. no anade funcionalidad ni corrige un bug. |
| **changelog** | el unico proposito del commit es editar `changelog.md` (por ejemplo, al cerrar una version). |

ejemplos de titulos correctos:

```
update | añadir vista previa de mapeo de columnas al asistente de importación csv
fix | detección de duplicados fallando en filas con importes negativos
hotfix | fallo al iniciar cuando falta el archivo de perfil de importación
changes | reorganizar la documentación en la subcarpeta project-context
changelog | cerrar la sección de changelog para la versión mvp fase 0
```

---

#### FORMATO DE LA DESCRIPCION (CUERPO)

- el cuerpo es siempre **una lista de markdown no numerada**: cada item empieza
  por `-`. nunca se usan listas numeradas ni parrafos sueltos.
- cada item es un bloque logico en imperativo, escrito como **una sola linea
  continua**, sin saltos de linea internos: no son esteticos ni utiles, deja
  que el cliente de git lo ajuste. no se dejan lineas en blanco entre items.
- usa markdown dentro de cada item: nombres de ficheros, rutas, comandos e
  identificadores siempre entre backticks.
- explica el que y el por que, no el detalle linea a linea.
- cierra con una linea en blanco y la linea de atribucion que corresponda al
  entorno.

---

#### COMO PRESENTAR EL RESULTADO

al responder con el titulo y la descripcion hay que usar **bloques de codigo
separados**: uno para el titulo del commit y otro para el cuerpo del commit (mas
otro para el fragmento del changelog). nunca se juntan el titulo y el cuerpo en
el mismo bloque.

### `.docs/pr-merge-release-guidelines.md`

# PR, MERGE Y RELEASE GUIDELINES

> instrucciones para cualquier agente de ia (o persona) que redacte el titulo
> y la descripcion de una **pull request**, de un **commit de merge** o de una
> **release de github** en este repositorio, de forma que su contenido lea
> como una extension directa de `changelog.md` en lugar de un formato distinto
> por cada canal. se aplica siempre que se pida algo equivalente a:
>
> *"sacame el titulo y la descripcion para la pull request / el merge / la
> release con los cambios de esta version. usa el mismo formato que
> `changelog.md`."*
>
> y, de forma general, **cada vez que se vaya a abrir una pull request, hacer
> un merge o publicar una release en este repositorio**, se haya pedido
> explicitamente o no.

este documento asume conocido el formato de `changelog.md` (descrito en
`agents.md` y `claude.md`, seccion "formato de las secciones de
`changelog.md`") y el de los commits (`.docs/commit-guidelines.md`). no lo
repite salvo lo estrictamente necesario.

---

#### PRINCIPIO GENERAL

pull requests, merges y releases **no inventan su propio formato**: reusan
literalmente el contenido y las reglas de estilo de `changelog.md`.

- **minusculas y sin acentos** en todo el contenido; los titulos/encabezados
  van en mayusculas y sin acentos.
- **categorias cerradas**, las mismas cinco de `changelog.md` y en el mismo
  orden — nunca, cambios, corregido, eliminado, seguridad
  (added / changed / fixed / removed / security) — omitiendo la que no tenga
  items.
- **una linea por item**, en imperativo, con nombres de ficheros, rutas,
  comandos e identificadores entre backticks.
- las fechas usan el formato `aaaa-mm-dd`.
- las entradas `[online]` / `[offline]` de `changelog.md` (cambios que solo
  afectan a una de las dos versiones de la app) se conservan tal cual en pr,
  merge y release: no se separan ni se traducen a otro marcador.

la fuente de verdad es siempre `changelog.md`: antes de redactar una pr, un
merge o una release, la seccion `## SIN PUBLICAR / UNRELEASED` (o la version
ya cerrada correspondiente) debe estar actualizada. el contenido de pr, merge
y release se **extrae** de ahi, no se redacta desde cero ni en paralelo.

---

#### 1. PULL REQUESTS

hay dos tipos de pr en este repositorio y cada una tiene su propio formato de
titulo; la descripcion es igual para las dos.

##### 1.1 titulo

**pr de trabajo normal** (una rama `feature/...` o `fix/...` contra
`testing-branch`, o cualquier pr que no cierra una version): mismo formato
que el titulo de un commit, definido en `.docs/commit-guidelines.md`:

```
<prefijo> | <resumen corto en imperativo>
```

usando el mismo prefijo (`update`, `fix`, `hotfix`, `changes`, `changelog`) y
las mismas reglas — si la pr agrupa varios commits, el resumen describe el
conjunto, no cada commit por separado.

**pr de publicacion de version** (`testing-branch` → `release-branch` /
`main`, cierra una version de `changelog.md`): sigue el patron ya usado en
los merges anteriores del repositorio (`release version 1.6 - supabase cloud
sync, onyx theme and task detail redesign`):

```
release version <x.y.z> - <resumen corto en imperativo>
```

el resumen corto resume las 2-3 entradas mas relevantes de la version, igual
que en el ejemplo anterior.

##### 1.2 descripcion

la descripcion es el bloque `### CASTELLANO` + `### ENGLISH` de la seccion
correspondiente de `changelog.md` (la version que cierra la pr, o el
subconjunto de `## SIN PUBLICAR / UNRELEASED` que aporta esa pr), pegado tal
cual, con sus encabezados `####` de categoria:

```
### CASTELLANO

#### <categoria>
- <cambio en una linea>

### ENGLISH

#### <category>
- <same change, one line>
```

si la pr solo aporta una parte de `## SIN PUBLICAR / UNRELEASED` (por
ejemplo, varias pr pequenas alimentan la misma version antes de cerrarla),
la descripcion incluye solo los items que introduce esa pr, no la seccion
entera.

no se anaden parrafos sueltos, capturas de pantalla incrustadas como texto,
ni resumenes adicionales fuera de la lista: si hace falta contexto extra (por
ejemplo, capturas de pantalla de cambios visuales, ver `agents.md` seccion
10), se anade **despues** de la lista, nunca sustituyendola.

---

#### 2. COMMIT DE MERGE

github genera el commit de merge a partir del titulo y la descripcion de la
pr automaticamente (`Merge pull request #<n> from <rama>` como primera linea,
seguido del titulo y cuerpo de la pr). por tanto:

- si la pr cumple las secciones 1.1 y 1.2, el commit de merge ya cumple este
  formato sin trabajo adicional.
- usa siempre **"create a merge commit"** al fusionar (nunca squash ni
  rebase): el historial de commits individuales, redactado segun
  `.docs/commit-guidelines.md`, debe conservarse completo junto al resumen de
  la pr en el commit de merge.
- si el merge se hace manualmente por git (`git merge --no-ff`), el mensaje
  del commit de merge se redacta a mano siguiendo el mismo titulo (seccion
  1.1) y el mismo cuerpo (seccion 1.2) que llevaria la pr equivalente.

---

#### 3. RELEASES DE GITHUB

las releases de github son **en ingles unicamente** (no bilingues, a
diferencia de `changelog.md` y de las pr): son la cara publica del proyecto
de cara a usuarios que no necesariamente leen castellano.

##### 3.1 titulo de la release

```
v<x.y.z> — <resumen corto en ingles, minusculas, sin acentos>
```

ejemplo (formato ya usado en `.docs/releases-docs/`):

```
v1.7 — 100% offline, reminders redesign & settings categories
```

##### 3.2 descripcion de la release

el cuerpo reutiliza literalmente el bloque `### ENGLISH` de la version
cerrada en `changelog.md`, con sus categorias en mayusculas y sin acentos,
igual que en el changelog:

```
#### ADDED
- <change in one line>

#### CHANGED
- <change in one line>

#### FIXED
- <change in one line>

#### REMOVED
- <change in one line>

#### SECURITY
- <change in one line>
```

se omite la categoria que no tenga items, igual que en `changelog.md`. no se
reescribe el contenido en parrafos narrativos con negritas ni se reordenan
las categorias: la release debe poder generarse copiando y pegando el bloque
`### ENGLISH` de la version correspondiente.

> nota: los releases anteriores a esta guia (incluidos los de
> `.docs/releases-docs/release-1.7/`) usan un formato narrativo distinto
> (parrafos con titulo en negrita en vez de las cinco categorias). son
> historicos y no se reescriben con esta regla; a partir de esta guia, toda
> release nueva usa el formato de categorias descrito arriba.

##### 3.3 tag

el tag de git asociado a la release es siempre `v<x.y.z>` (mismo numero de
version que la cabecera de `changelog.md`, sin sufijos adicionales).

---

#### FLUJO RESUMIDO

1. durante el desarrollo, cada commit sigue `.docs/commit-guidelines.md` y
   cada cambio relevante se anade a `## SIN PUBLICAR / UNRELEASED` en
   `changelog.md` en su categoria correspondiente.
2. cada pr (normal o de version) usa el titulo y la descripcion definidos en
   la seccion 1, extraidos de `changelog.md`.
3. al fusionar, se usa "create a merge commit" para que el commit de merge
   herede el formato de la pr (seccion 2).
4. al cerrar una version: se renombra `## SIN PUBLICAR / UNRELEASED` a
   `## [x.y.z] - aaaa-mm-dd` en `changelog.md` (commit con prefijo
   `changelog`), se abre la pr de publicacion de version (seccion 1.1), y al
   fusionarla se crea la release de github (seccion 3) con el tag `v<x.y.z>`.

