# FOCUSPHONE-WEB: REPOSITORY GUIDE

## ESPAÑOL DE ESPAÑA: USO OBLIGATORIO DE Ñ

- todo texto en castellano debe usar español de españa (`es-ES`) y su ortografia, tambien en titulos y cuerpos de commits, changelogs, pull requests, merges y documentacion
- escribir siempre `ñ` en las palabras que la llevan y `Ñ` cuando corresponda la mayuscula; nunca sustituirlas por `n` o `N`
- la `ñ` es una letra distinta de la `n`; las instrucciones «sin acentos» o «sin tildes» solo afectan a las tildes de las vocales y nunca permiten eliminar la eñe
- ejemplos correctos: `añadir`, `diseño`, `año`, `tamaño`, `contraseña`, `español`, `españa` y `AÑADIDO`; sus formas con `n` son incorrectas cuando se refieren a esas palabras españolas
- conservar literalmente rutas, urls, nombres de archivo, identificadores tecnicos y texto de otros idiomas; esta regla no autoriza renombrarlos ni aplicar sustituciones indiscriminadas
- antes de entregar o publicar texto en castellano, revisar que ninguna palabra haya perdido su `ñ` o `Ñ`; esta regla prevalece sobre cualquier normalizacion a ascii o instruccion generica de eliminar acentos


static marketing website for the focusphone android launcher. this guide covers the repository; nested agent instructions apply within their own folders.

## PROJECT OVERVIEW

| property | verified value |
| --- | --- |
| repository | `rezzt-dev/focusphone-web` |
| active source | `web/` |
| development base for this change | `main` |
| remote default branch | `main` |
| version source | `web/package.json`: `1.0.0` |
| continuous integration | no tracked github actions workflows |

## TECHNOLOGY STACK

- `web/package.json`: `astro` ^7.4.7, `tailwindcss` ^4.3.4, `typescript` ^6.0.3

## PROJECT STRUCTURE

- `changelog.md`
- `license.md`
- `readme.md`
- `security.md`
- `web/`

management documentation lives in `.docs/manager.md`, `.docs/-github-guides/` and `.docs/repo-audit-and-fix.md`. keep this file and `claude.md` consistent.

## BUILD, RUN AND TEST COMMANDS

from `web/`, the available package scripts are:

| command | implementation |
| --- | --- |
| `npm run dev` | `node node_modules/astro/bin/astro.mjs dev --host 0.0.0.0` |
| `npm run build` | `node node_modules/astro/bin/astro.mjs check && node node_modules/astro/bin/astro.mjs build` |
| `npm run preview` | `node node_modules/astro/bin/astro.mjs preview --host 0.0.0.0` |
| `npm run check` | `node node_modules/astro/bin/astro.mjs check` |
| `npm run prepare:assets` | `node scripts/generate-social.mjs` |
| `npm run format` | `node node_modules/prettier/bin/prettier.cjs --write src tests scripts astro.config.mjs playwright.config.ts README.md PRODUCT.md DESIGN.md MOTION.md` |
| `npm run format:check` | `node node_modules/prettier/bin/prettier.cjs --check src tests scripts astro.config.mjs playwright.config.ts README.md PRODUCT.md DESIGN.md MOTION.md` |
| `npm run install:browsers` | `node node_modules/@playwright/test/cli.js install chromium firefox webkit` |
| `npm run test:e2e` | `node node_modules/@playwright/test/cli.js test` |
| `npm run test:seo` | `node scripts/verify-seo.mjs` |
| `npm run build:production` | `node scripts/build-production.mjs` |
| `npm run test:links` | `node scripts/verify-public-links.mjs` |
| `npm run test:budgets` | `node scripts/verify-budgets.mjs` |

for application changes, run these checks from `web/`:

```bash
npm run check
npm run build
```

## OPTIONAL LOCAL DOCUMENTATION

the repository-management subset of `.docs/` is shared. `.docs/project-docs/` and local design skills may be absent in a fresh clone. preserve their references as optional context; verify the current source and ask for a missing design decision only when it blocks the requested change. generated output is `web/dist/` and does not need to exist before building.

## CODE STYLE AND ARCHITECTURAL DECISIONS

preserve direct-node scripts required by the filesystem, local-only contact draft behaviour and performance budgets; derive public destinations from site configuration. follow the existing formatter and naming of the changed module. verify manifest versions when dependencies change.

## TESTING STRATEGY

documentation-only changes require `git diff --check`, existing-path checks and a review of the staged file list. run module checks for application changes, with disposable data. report unavailable tooling and failed checks; never claim a check passed without running it.

## SECURITY AND DEPLOYMENT

keep credentials, local configuration, signing material and user data out of commits. do not print secret values while auditing. inspect configuration names and code references instead.

existing legal and community files: `license.md`, `security.md`. when changing dependencies, permissions, storage or network services, review those files against the implementation. record missing policies as audit work; do not invent licence terms or ownership decisions.

deployment, signing, store publication, migrations against hosted databases and repository settings require their own explicit request. this documentation task prepares management instructions and pull requests.

## COMMON TASKS

1. read the relevant module and its nearest agent instructions
2. inspect the working tree and choose the smallest change that solves the request
3. update the affected documentation and changelog with evidence from the diff
4. run checks appropriate to the changed module and report their actual results
5. for git operations, follow the manager and the digest below

## EXISTING PROJECT CONVENTIONS

the following project-specific context is retained from the previous guide. paths are relative to the active module when stated. for git operations, the manager and final digest supersede previous workflow examples.

## FOCUSPHONE WEB — AGENT GUIDE

> guide for ai agents (and humans) working on the focusphone landing page.
> [`claude.md`](claude.md) carries only the commit / pr / merge / release
> conventions; everything else lives here. the app itself is a separate
> repository: <https://github.com/rezzt-dev/focusphone-app>.

---

## PROJECT OVERVIEW

**focusphone web** is the spanish-language, fully static landing page for
focusphone, a minimalist android launcher (text-only home screen, focus
profiles, a conscious pause before opening apps). it is independent from the
android app: no backend, no accounts, no analytics, no cookies.

- **current app version shown:** `1.4` beta (`v1.4-beta`) (source of truth: `web/src/data/site.ts`).
- **canonical origin:** `https://focusphone.rezzt.dev` (default, overridable via `PUBLIC_SITE_URL`).
- **language of the site:** spanish, lowercase headings in the app's calm voice, sentence-case body copy.
- **status:** not deployed from this repository. no google play listing, and no public apk yet.

### HARD PRODUCT RULES

- no fabricated social proof (testimonials, ratings, download counts, countdowns).
- phone mockups are **illustrative html/css**, never presented as official screenshots.
- never promise a download that does not exist. with no `PUBLIC_PROJECT_URL`, ctas go to `/proyecto/` and `/instalar/#disponibilidad`.
- never link to a public destination that returns 404 or requires authentication.
- never add cookies, pixels, sdks, third-party requests or measurement without first updating `/privacidad/` and `security.md`.
- everything must be readable and usable without javascript.

---

## TECHNOLOGY STACK

| area | choice |
|---|---|
| framework | astro 7, static output, `trailingSlash: 'always'` |
| styling | tailwind css 4 (`@tailwindcss/vite`) + semantic oklch tokens in `src/styles/global.css` |
| language | typescript 6 (strict `astro check`) |
| motion | anime.js 4 (waapi for entrances and scroll, its own engine for breathing) |
| icons | `@lucide/astro`, tree-shaken through `src/components/Icon.astro` |
| fonts | fontsource poppins 400/500/600 and jetbrains mono 400, self-hosted latin woff2 |
| tests | playwright (chromium, firefox, webkit) + `@axe-core/playwright` |
| formatting | prettier + `prettier-plugin-astro` |
| runtime | node.js `>=22.23.4`, npm |

---

## PROJECT STRUCTURE

```text
focusphone-web/
├── readme.md · security.md · license.md · agents.md · claude.md

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


> `.docs/project-docs/` are the reference for product, design, motion and audit decisions.
> read the relevant one **before** changing visuals or motion.

---

## BUILD COMMANDS

all commands run from `web/`.

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

### BUILD CONFIGURATION NOTES

- `.npmrc` disables executable symlinks and every script calls node directly, because this repository lives on **exfat**. do not "simplify" the scripts back to `astro ...` binaries.
- `PUBLIC_SITE_URL` must be an https origin with no credentials, path, query or fragment; `build:production` enforces this.
- `PUBLIC_PROJECT_URL` must be a `https://github.com/<owner>/<repo>` url. set it **only** when the repository, docs, issues and a downloadable apk are public; `build:production` verifies that and fails otherwise.
- the `format` / `format:check` scripts list `README.md PRODUCT.md DESIGN.md MOTION.md` inside `web/`; those files live elsewhere now (`../readme.md`, `../.docs/project-docs/`). if prettier complains about missing paths, update the scripts rather than recreating the files.

---

## CODE STYLE GUIDELINES

### LANGUAGE & TONE

- **site copy:** spanish. headings in lowercase; body in sentence case. calm, concrete, never urgent.
- **code, identifiers, comments, commit-adjacent docs:** follow the existing conventions of the file you touch.
- avoid marketing superlatives and unverifiable performance claims.

### FORMATTING CONVENTIONS

- prettier is the formatter (`.prettierrc.json`); run `npm run format` before committing.
- semantic html first: `button` for actions, `a` for navigation, native `details` for the faq.
- colors, spacing and motion come from css tokens (`global.css`, `motion.css`), never hard-coded in components.

### UI PATTERNS

- **container:** max width 1240px, gutters 56px (desktop) / 22px (mobile). breakpoints: 1150, 900 and 640px. must hold at 320px.
- **phone mockup:** always the shared `Phone.astro`; it is marked illustrative and its buttons show example messages only.
- **icons:** only through `Icon.astro` (tree-shaken lucide).
- **interactive widgets:** tabs implement the wai-aria keyboard pattern (arrows, home, end); toggles expose `aria-pressed`.

### MOTION

- animations are declarative via `data-*` attributes (`data-animate`, `data-intro`, `data-animate-delay`, …) handled by `src/scripts/animations/`. variants: `fade-up` (default), `settle`, `rise`, `product`, `fade`, `scale`, `clip`.
- tokens live in `src/styles/motion.css` and are the **only** source of timings and easings.
- `MotionBoot.astro` decides before first paint whether the load choreography plays.
- must respect `prefers-reduced-motion`. no perpetual loops, scroll hijacking or custom cursor.
- full direction: `.docs/project-docs/motion-doc.md`.

---

## TESTING STRATEGY

- playwright specs in `web/tests/` use a page object (`tests/pages/Landing.ts`). prefer role- and name-based locators over css selectors.
- covered today: themes and clocks, phone interaction, profile tabs with keyboard, breathing with cancel, mobile and tablet menu, form validation and github draft preparation, faq, pages and internal links, no horizontal overflow, axe-core on desktop and mobile.
- new interactive behavior needs a spec. visual-only changes need a manual check at 320, 640, 900 and 1240px.
- automated accessibility checks complement manual review; they are not a certification.
- before declaring a task done: `npm run check`, `npm run format:check`, `npm run build:production` and `npm run test:e2e`. report any failure verbatim — do not claim a green run you did not see.

---

## KEY DECISIONS

### 1. STATIC, NO BACKEND

the contact form only **prepares a local draft** to copy or open on github (only if a public repo is configured). messages under 20 useful characters are rejected; if the github url exceeds 7,000 characters the text is offered for copy separately; if clipboard access is denied the text is selected for manual copying.

### 2. HONEST AVAILABILITY

`site.ts` derives `repository`, `releases`, `documentation` and `issues` from `PUBLIC_PROJECT_URL`. without it every link resolves to an internal page. never hard-code a github url elsewhere.

### 3. LOCAL CONVERSION EVENT ONLY

marked ctas dispatch the browser event `focusphone:conversion` with `detail.action` (`releases`, `repository`, `availability`, `project`) and `detail.location`. nothing is stored or sent. a click is not an install.

### 4. PERFORMANCE BUDGETS ARE BUILD GATES

js ≤ 40 kib gzip and css ≤ 15 kib gzip across all pages. the breathing script ships only on the landing. a new dependency or script must fit the budget.

### 5. SELF-HOSTED EVERYTHING

no external fonts, images, scripts or analytics. social cards (`public/images/social.png|svg`) are generated by `scripts/generate-social.mjs`.

### 6. CROSS-DOCUMENT VIEW TRANSITIONS

native page transitions keep the header and reverse direction when returning home. don't replace them with a client-side router.

---

## SECURITY CONSIDERATIONS

- never insert visitor-provided text with `innerHTML`; use `textContent` and `URL` / `URLSearchParams`.
- never version secrets. `.env` and `.env.*` are gitignored (only `.env.example` is tracked).
- browser baseline: chrome 111+, safari 16.4+, firefox 128+.
- hosting headers live in `web/public/_headers` and `web/deploy/nginx.conf`; keep both policies equivalent. do not use a global rewrite to `index.html` (a missing route must return a real 404).
- vulnerability reporting policy: [`security.md`](security.md).

---

## COMMON TASKS FOR AGENTS

### UPDATING THE APP VERSION

1. edit `version` and the faq strings in `web/src/data/site.ts`.
2. check the "beta" copy (`site.stage`) in `index.astro`, `instalar.astro` and structured data.
3. `npm run prepare:assets` to regenerate the social card.
4. `npm run build:production`.

### ADDING A PAGE

1. create `src/pages/<name>.astro` using `Base`, `Header` and `Footer`; give it a unique title and description.
2. link it from header/footer consistently and add it to the playwright internal-link coverage.
3. confirm sitemap and canonical via `npm run test:seo`.

### ADDING A LANDING SECTION

1. read the matching section in `.docs/project-docs/design-doc.md` (purpose, hierarchy, interactions, transition).
2. use semantic headings and `data-animate` variants; keep default html visible without js.
3. add a spec if the section is interactive; run axe through `npm run test:e2e`.

### PUBLISHING THE PROJECT LINKS

only when repo, docs, issues and apk are public: set `PUBLIC_PROJECT_URL`, run `npm run build:production`, and update `/privacidad/` if hosting or measurement changed.

---

## DEPLOYMENT NOTES

- output is `web/dist/`, designed for the **root** of the domain on static hosting with `404.html` as the error page and trailing-slash routes.
- `deploy/nginx.conf` expects `dist/` copied to `/srv/focusphone` behind the platform's https endpoint.
- nothing has been deployed or tls-configured from this repository. do not claim otherwise.
- pre-publication checks on the real domain: http→https and canonical-host redirects, a 404 on a missing route, compression, caching, canonical, social card; safari ios and chrome android on real devices; keyboard and screen reader; 200 % zoom and 400 % reflow; field lcp ≤ 2.5 s, inp ≤ 200 ms, cls ≤ 0.1 at p75 once there is traffic.

---

## ADDITIONAL ENTRY-POINT CONVENTIONS

## FocusPhone Web — claude.md

> This file exists so Claude (and any other AI agent) always has the git
> workflow rules available, independent of `.docs/` (gitignored) being
> present locally. For the project overview, tech stack, build commands,
> code style and key decisions, see [`agents.md`](agents.md) — this file only
> duplicates the commit / PR / merge / release conventions.

## COMMIT, PR, MERGE & RELEASE GUIDELINES

read `.docs/manager.md` first, then the selected guide in `.docs/-github-guides/`. these files are versioned; this digest also works without opening them.

| request | guide |
| --- | --- |
| commit title, body and changelog | `commit-guide.md`, `changelog-guide.md` |
| pull request or merge | `pr-merge-guide.md`, `branching-guide.md` |
| version and release | `release-guide.md`, `changelog-guide.md` |
| permissions and sensitive data | `agent-rules.md` |

- inspect `git status`, both diffs and recent history before describing changes
- use `<prefix> | <imperative summary>` with `update`, `fix`, `hotfix`, `changes` or `changelog`; keep titles within 72 characters
- write commit bodies as 2 to 6 markdown bullets, one logical change per line, with literal paths in backticks
- never add authorship footers, automated attribution, signatures or generation notices; preserve the configured git identity
- update `changelog.md` under `## SIN PUBLICAR / UNRELEASED` in matching `### CASTELLANO` and `### ENGLISH` sections
- use the existing changelog category vocabulary and preserve language parity; describe only changes in the actual diff
- summarize pull requests in 1 to 3 bullets per category and language, at most 110 characters per bullet
- documentation and repository-management work targets `main`; the remote default is `main`; do not silently promote development work to the default branch
- the authorization for a requested action remains valid throughout that task; creating a pull request includes pushing its branch, but does not authorize merging or publishing
- use merge commits when a merge is requested; never force-push, rewrite published history or remove branches without an explicit instruction
- releases use the approved version and an immutable tag on the verified release commit, with english notes from the closed changelog; do not create a release for documentation work
- deliver requested titles, bodies and changelog fragments in separate code blocks; report executed actions with their commit hash or pull request link
