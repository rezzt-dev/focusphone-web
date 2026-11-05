import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
for (const [origin, valid] of [
  ['https://focusphone.rezzt.dev', true],
  ['https://focusphone.rezzt.dev/', true],
  ['', false],
  ['http://focusphone.rezzt.dev', false],
  ['https://user:password@focusphone.rezzt.dev', false],
  ['https://focusphone.rezzt.dev/path/', false],
  ['https://focusphone.rezzt.dev/?query=1', false],
  ['https://focusphone.rezzt.dev/#fragment', false],
  ['not-a-url', false]
]) {
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', "await import('./astro.config.mjs')"],
    {
      env: { ...process.env, PUBLIC_SITE_URL: origin, REQUIRE_SITE_URL: 'true' },
      encoding: 'utf8'
    }
  );
  assert.equal(result.status === 0, valid, `Unexpected origin validation: ${origin}`);
}
console.log('Production origin validation rejects malformed and non-HTTPS configurations.');
