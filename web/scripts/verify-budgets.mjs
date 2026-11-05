import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const directory = new URL('../dist/_astro/', import.meta.url);
const totals = { js: 0, css: 0 };
for (const name of await readdir(directory)) {
  const kind = name.endsWith('.js') ? 'js' : name.endsWith('.css') ? 'css' : undefined;
  if (kind) totals[kind] += gzipSync(await readFile(new URL(name, directory))).length;
}
assert(totals.js <= 40 * 1024, `Compressed JavaScript budget exceeded: ${totals.js} bytes`);
assert(totals.css <= 15 * 1024, `Compressed CSS budget exceeded: ${totals.css} bytes`);
console.log(
  `Asset budgets OK: ${totals.js} bytes JS and ${totals.css} bytes CSS (gzip, all pages combined).`
);
