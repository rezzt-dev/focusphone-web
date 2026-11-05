import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');

const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
const origin = process.env.PUBLIC_SITE_URL ?? 'https://focusphone.rezzt.dev';
assert.match(home, /<html lang="es">/);
assert.match(home, /application\/ld\+json/);
assert.match(home, /SoftwareApplication/);
assert.match(home, /property="og:image"/);
assert.match(home, /name="description"/);
assert.equal((home.match(/<h1[\s>]/g) ?? []).length, 1);
if (origin) {
  const expected = new URL('/', origin).href;
  assert.ok(home.includes(`rel="canonical" href="${expected}"`));
  assert.ok(home.includes(new URL('/images/social.png', origin).href));
  const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
  for (const path of ['/', '/instalar/', '/privacidad/', '/proyecto/'])
    assert.ok(sitemap.includes(new URL(path, origin).href));
  assert.ok(!sitemap.includes('404'));
  assert.ok(robots.includes(new URL('sitemap-index.xml', origin).href));
} else {
  assert.ok(!home.includes('rel="canonical"'));
  assert.ok(!robots.includes('Sitemap:'));
}
console.log('SEO metadata, routes and domain configuration verified.');

for (const path of ['instalar', 'privacidad', 'proyecto']) {
  const html = await readFile(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');
  assert.ok(html.includes(`rel="canonical" href="${new URL(`/${path}/`, origin).href}"`));
  assert.ok(html.includes(new URL('/images/social.png', origin).href));
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
}
const missing = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8');
assert.ok(missing.includes('noindex, follow'));
