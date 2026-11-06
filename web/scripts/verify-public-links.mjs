import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const project = process.env.PUBLIC_PROJECT_URL?.replace(/\/$/, '');
if (project) {
  const api = project.replace('https://github.com/', 'https://api.github.com/repos/');
  for (const url of [
    project,
    `${project}/releases`,
    `${project}/issues`,
    `${project}/blob/main/README.md`
  ]) {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    assert(response.ok, `Public destination unavailable: ${url} (${response.status})`);
    await response.body?.cancel();
  }
  const response = await fetch(`${api}/releases`, { signal: AbortSignal.timeout(20000) });
  assert(response.ok, 'Public releases API must be available.');
  const releases = await response.json();
  const asset = releases
    .filter((release) => !release.draft)
    .flatMap((release) => release.assets ?? [])
    .find((item) => item.name.endsWith('.apk'));
  assert(asset, 'A public APK must exist before enabling download CTAs.');
  const apk = await fetch(asset.browser_download_url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
  assert(apk.ok, `APK download unavailable: ${apk.status}`);
  console.log('Public project, documentation, issues and APK verified anonymously.');
} else {
  console.log('No public project configured: availability page and local draft mode enabled.');
}
