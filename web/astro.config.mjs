import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

if (existsSync('.env')) process.loadEnvFile('.env');
const site = process.env.PUBLIC_SITE_URL ?? 'https://focusphone.rezzt.dev';
const production = process.env.REQUIRE_SITE_URL === 'true';
if (production && !site) throw new Error('PUBLIC_SITE_URL is required for publication.');
if (site) {
  const url = new URL(site);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    (production && url.protocol !== 'https:') ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'PUBLIC_SITE_URL must be an origin without credentials, path, query or fragment; publication requires HTTPS.'
    );
}

export default defineConfig({
  site,
  output: 'static',
  integrations: site ? [sitemap()] : [],
  vite: { plugins: [tailwindcss()] },
  trailingSlash: 'always'
});
