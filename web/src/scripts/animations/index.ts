/**
 * FocusPhone motion system. Declared from HTML through `data-*` attributes (see MOTION.md), timed
 * by the tokens in `src/styles/motion.css` and played with anime.js v4.
 *
 * Page transitions are native cross-document View Transitions: they live in `motion.css` and in
 * `components/MotionBoot.astro`, which must run before first paint. Every page load is a fresh
 * document, so this module initialises once per page and there is nothing to re-bind on swap.
 */
import { initHeader } from './header';
import { initPointer } from './pointer';
import { initReveals } from './reveal';

initReveals();
initHeader();
initPointer();

/*
 * Scroll-linked effects need anime's engine (~15 KB gzip) but nothing they do matters before the
 * visitor scrolls, so they load after first paint: on the first scroll or input, or when idle.
 */
let scrollLoaded = false;
const triggers = ['scroll', 'wheel', 'touchstart', 'keydown'] as const;
function loadScroll() {
  if (scrollLoaded) return;
  scrollLoaded = true;
  triggers.forEach((type) => window.removeEventListener(type, loadScroll));
  void import('./scroll').then(({ initScroll }) => initScroll());
}
triggers.forEach((type) => window.addEventListener(type, loadScroll, { once: true, passive: true }));
if ('requestIdleCallback' in window) requestIdleCallback(loadScroll, { timeout: 800 });
else setTimeout(loadScroll, 400);

export { enter } from './reveal';
export { reducedMotion } from './utils';
