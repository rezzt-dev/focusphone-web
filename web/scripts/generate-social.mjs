import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const icon = (await readFile(new URL('../public/images/focusphone-icon.webp', import.meta.url))).toString(
  'base64'
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#181818"/>
<circle cx="1010" cy="315" r="215" fill="none" stroke="#303030"/><circle cx="1010" cy="315" r="300" fill="none" stroke="#242424"/>
<image href="data:image/webp;base64,${icon}" x="75" y="55" width="54" height="54"/>
<text x="145" y="92" fill="#e0e0e0" font-family="sans-serif" font-size="28">focusphone.</text>
<text x="75" y="265" fill="#e0e0e0" font-family="sans-serif" font-size="86" letter-spacing="-3">menos pantalla.</text>
<text x="75" y="365" fill="#9e9e9e" font-family="sans-serif" font-size="86" letter-spacing="-3">más vida.</text>
<text x="80" y="462" fill="#b0b0b0" font-family="sans-serif" font-size="23">un nuevo inicio para tu android.</text>
<text x="80" y="550" fill="#9e9e9e" font-family="sans-serif" font-size="17">android 7.0+ · sin anuncios · sin cuentas · v1.4 beta</text>
<rect x="885" y="116" width="211" height="410" rx="26" fill="#111" stroke="#555" stroke-width="3"/>
<text x="990" y="227" text-anchor="middle" fill="#e0e0e0" font-family="sans-serif" font-size="45">09:41</text>
<text x="990" y="254" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="10">un momento para ti.</text>
${['teléfono', 'mensajes', 'cámara', 'música', 'notas'].map((app, i) => `<text x="990" y="${318 + i * 31}" text-anchor="middle" fill="#ddd" font-family="sans-serif" font-size="17">${app}</text>`).join('')}
</svg>`;
await writeFile(new URL('../public/images/social.svg', import.meta.url), svg);
await sharp(Buffer.from(svg))
  .png()
  .toFile(new URL('../public/images/social.png', import.meta.url).pathname);
console.log('Created local social assets: 1200 × 630.');
