import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const env = { ...process.env, REQUIRE_SITE_URL: 'true' };
for (const args of [
  ['scripts/verify-config.mjs'],
  ['node_modules/astro/bin/astro.mjs', 'check'],
  ['node_modules/astro/bin/astro.mjs', 'build'],
  ['scripts/verify-seo.mjs'],
  ['scripts/verify-budgets.mjs'],
  ['scripts/verify-public-links.mjs']
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
