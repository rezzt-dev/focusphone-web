/**
 * Motion tokens. The single source of truth is `src/styles/motion.css`: CSS reads the custom
 * properties for transitions and initial states, and this module reads the very same values so
 * anime.js never drifts from them. Fallbacks only apply if the stylesheet failed to load.
 */
const css = getComputedStyle(document.documentElement);

function number(name: string, fallback: number) {
  const value = parseFloat(css.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}
function text(name: string, fallback: string) {
  return css.getPropertyValue(name).trim() || fallback;
}

export const ease = {
  /** Entrances decelerate to rest, without overshoot. */
  reveal: text('--ease-reveal', 'cubic-bezier(0.22, 1, 0.36, 1)'),
  /** Colour and state changes, shorter so control feels immediate. */
  state: text('--ease-state', 'cubic-bezier(0.4, 0, 0.2, 1)')
} as const;

export const duration = {
  press: number('--motion-press', 120),
  feedback: number('--motion-feedback', 180),
  state: number('--motion-state', 320),
  reveal: number('--motion-reveal', 640),
  headline: number('--motion-headline', 800),
  product: number('--motion-product', 950)
} as const;

/** Units arriving together are separated by one step, never forming a long queue. */
export const stagger = {
  step: number('--motion-stagger', 55),
  max: number('--motion-stagger-max', 165)
} as const;

/** Entrances start partially visible: content is never fully hidden by motion. */
export const fromOpacity = number('--motion-from-opacity', 0.3);
export const fromScale = number('--motion-from-scale', 0.97);
/** After this long, CSS shows the load choreography's content even if no script took over. */
export const failsafe = number('--motion-failsafe', 2400);
/** Opacity of a line that the reading scrub has not reached yet. */
export const inkFrom = number('--motion-ink-from', 0.24);

export type Variant = 'rise' | 'fade-up' | 'settle' | 'product' | 'fade' | 'scale' | 'clip';

interface VariantSpec {
  /** Vertical travel in px; negative values enter from above. */
  distance: number;
  duration: number;
  scale?: number;
  clip?: boolean;
}

/** Each variant matches a `[data-animate='…']` initial state in `motion.css`. */
export const variants: Record<Variant, VariantSpec> = {
  rise: { distance: number('--motion-distance-rise', 24), duration: duration.headline },
  'fade-up': { distance: number('--motion-distance-reveal', 16), duration: duration.reveal },
  settle: { distance: number('--motion-distance-settle', 8), duration: duration.reveal },
  product: { distance: number('--motion-distance-product', 28), duration: duration.product },
  fade: { distance: 0, duration: duration.reveal },
  scale: { distance: 0, duration: duration.reveal, scale: fromScale },
  clip: { distance: 0, duration: duration.headline, clip: true }
};

export function variantOf(element: HTMLElement): Variant {
  const name = element.dataset.animate as Variant | undefined;
  return name && name in variants ? name : 'fade-up';
}
