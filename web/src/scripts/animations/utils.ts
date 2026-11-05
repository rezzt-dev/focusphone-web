/** Shared conditions and lifecycle helpers for every motion module. */
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
export const desktop = window.matchMedia('(min-width: 901px)');

/**
 * Constrained devices and data-saver visitors keep reveals (cheap, composited, one-shot) but skip
 * the continuous scroll-linked effects. Unknown capabilities are treated as capable.
 */
export const lowPower = (() => {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || nav.connection?.saveData === true
  );
})();

export type Cleanup = () => void;

/**
 * Keeps an effect alive only while `condition` holds, re-evaluating whenever one of the media
 * queries changes. Setup returns its own teardown, so reduced motion, resizing below the desktop
 * breakpoint or losing a fine pointer settle the effect immediately and without leaks.
 */
export function whenever(
  condition: () => boolean,
  triggers: MediaQueryList[],
  setup: () => Cleanup
): Cleanup {
  let cleanup: Cleanup | undefined;
  const sync = () => {
    const holds = condition();
    if (holds && !cleanup) cleanup = setup();
    else if (!holds && cleanup) {
      cleanup();
      cleanup = undefined;
    }
  };
  triggers.forEach((query) => query.addEventListener('change', sync));
  sync();
  return () => {
    triggers.forEach((query) => query.removeEventListener('change', sync));
    cleanup?.();
    cleanup = undefined;
  };
}

/** Reads a numeric `data-*` value, falling back when it is missing or malformed. */
export function numberData(element: HTMLElement, key: string, fallback: number) {
  const value = parseFloat(element.dataset[key] ?? '');
  return Number.isFinite(value) ? value : fallback;
}
