/**
 * Pointer response on the product itself. The operating-system cursor stays intact: no follower,
 * no magnetic targets, no persistent render loop. Hover and press feedback for buttons, links and
 * cards lives in `motion.css`, where the browser handles it without any script.
 */
import { finePointer, reducedMotion } from './utils';

/** Maximum tilt of `[data-tilt]` elements, in degrees. */
const MAX_TILT = 0.7;

export function initPointer() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((surface) => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      surface.style.removeProperty('rotate');
    };
    surface.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      // One write per frame; the CSS `rotate` transition smooths the response.
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = surface.getBoundingClientRect();
        const offset = (event.clientX - bounds.left) / bounds.width - 0.5;
        surface.style.rotate = `${Math.max(-MAX_TILT, Math.min(MAX_TILT, offset * MAX_TILT * 2))}deg`;
      });
    });
    surface.addEventListener('pointerleave', reset);
    surface.addEventListener('pointercancel', reset);
    // Keyboard users get a still product.
    surface.addEventListener('focusin', reset);
    finePointer.addEventListener('change', reset);
    reducedMotion.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    window.addEventListener('pagehide', reset);
  });
}
