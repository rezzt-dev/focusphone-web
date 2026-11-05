/**
 * Entrances: the load choreography (`data-intro`), one-time scroll reveals (`data-animate`,
 * `data-stagger`) and the imperative `enter()` used by menus, tabs and disclosures.
 *
 * Every entrance is an anime.js WAAPI animation of opacity, translate, scale or clip-path, so it
 * runs on the compositor and composes with the transforms each breakpoint already defines.
 * Content is never hidden by markup: initial states only exist while this script is in charge.
 */
import { waapi } from 'animejs/waapi';
import { ease, failsafe, fromOpacity, stagger, variants, variantOf, type Variant } from './tokens';
import { numberData, reducedMotion } from './utils';

type Entrance = ReturnType<typeof waapi.animate>;
type EntranceParams = Parameters<typeof waapi.animate>[1];

export interface EnterOptions {
  variant?: Variant;
  delay?: number;
  /** Overrides the variant's travel in px; negative values enter from above. */
  distance?: number;
  duration?: number;
}

const active = new Map<HTMLElement, Entrance>();

/** Ends an entrance immediately and hands the element back to its stylesheet. */
function settle(element: HTMLElement) {
  const animation = active.get(element);
  if (!animation) return;
  active.delete(element);
  animation.revert();
  // anime.js restores camel-cased properties by lower-casing them, which misses `clip-path`.
  element.style.removeProperty('clip-path');
}

export function settleAll() {
  [...active.keys()].forEach(settle);
}

/** Plays one entrance on `element`. Returns nothing when motion is reduced or the tab is hidden. */
export function enter(element: HTMLElement | null, options: EnterOptions = {}) {
  if (!element || reducedMotion.matches || document.hidden) return;
  settle(element);
  const spec = variants[options.variant ?? 'fade-up'];
  const distance = options.distance ?? spec.distance;
  const params: EntranceParams = {
    duration: options.duration ?? spec.duration,
    delay: options.delay ?? 0,
    ease: ease.reveal
  };
  if (spec.clip) {
    params.clipPath = ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'];
  } else {
    params.opacity = [fromOpacity, 1];
    if (distance) params.translate = [`0px ${distance}px`, '0px 0px'];
    if (spec.scale) params.scale = [spec.scale, 1];
  }
  // Finished entrances are reverted too: the element ends exactly as the CSS describes it.
  params.onComplete = () => settle(element);
  const animation = waapi.animate(element, params);
  active.set(element, animation);
  return animation;
}

/** Load choreography. `MotionBoot.astro` decides before first paint whether it should play. */
function playIntro() {
  const root = document.documentElement;
  if (root.dataset.motion !== 'intro') return;
  // Past the CSS failsafe the content is already visible; replaying it would read as a flicker.
  if (!reducedMotion.matches && performance.now() < failsafe) {
    document.querySelectorAll<HTMLElement>('[data-intro]').forEach((element) => {
      enter(element, { variant: variantOf(element), delay: numberData(element, 'animateDelay', 0) });
    });
  }
  // Same task as the animations above: the CSS initial state is never painted without them.
  root.dataset.motion = 'live';
}

let observer: IntersectionObserver | undefined;

function finish(element: HTMLElement) {
  element.dataset.reveal = 'done';
  observer?.unobserve(element);
}

/** Sorts arrivals in reading order so a row of units cascades left to right. */
function readingOrder(a: IntersectionObserverEntry, b: IntersectionObserverEntry) {
  return (
    a.boundingClientRect.top - b.boundingClientRect.top ||
    a.boundingClientRect.left - b.boundingClientRect.left
  );
}

function observeReveals() {
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const units = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    // Children become individual units: in a row they cascade, when stacked each enters on arrival.
    [...group.children].forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      child.dataset.animate ??= group.dataset.stagger || 'fade-up';
      units.add(child);
    });
  });
  document
    .querySelectorAll<HTMLElement>('[data-animate]:not([data-intro])')
    .forEach((unit) => units.add(unit));

  observer = new IntersectionObserver(
    (entries) => {
      const arriving: IntersectionObserverEntry[] = [];
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const bounds = entry.boundingClientRect;
        if (!element.dataset.reveal) {
          // First sighting. Anything already painted stays as it is; only units still below the
          // fold take their initial state, out of sight, so nothing visibly snaps backwards.
          if (!entry.isIntersecting && bounds.top >= window.innerHeight) element.dataset.reveal = 'pending';
          else finish(element);
          continue;
        }
        if (entry.isIntersecting) arriving.push(entry);
        // Jumped over (anchor, find in page): settle out of sight instead of replaying later.
        else if (bounds.bottom <= 0) finish(element);
      }
      arriving.sort(readingOrder).forEach((entry, order) => {
        const element = entry.target as HTMLElement;
        // Keyboard focus wins over choreography.
        if (!element.contains(document.activeElement)) {
          const fromAbove = entry.boundingClientRect.top <= 0;
          enter(element, {
            variant: fromAbove ? 'fade' : variantOf(element),
            delay: Math.min(order * stagger.step, stagger.max)
          });
        }
        finish(element);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -32px 0px' }
  );
  units.forEach((unit) => observer?.observe(unit));
}

/** Shows every pending unit at once, for reduced motion, printing or leaving the page. */
function releasePending() {
  document.querySelectorAll<HTMLElement>('[data-reveal="pending"]').forEach(finish);
}

/** Native disclosures keep their semantics; only the opening is animated, closing is immediate. */
function observeDisclosures() {
  document.querySelectorAll<HTMLDetailsElement>('details[data-disclosure]').forEach((details) => {
    const content = details.querySelector<HTMLElement>('[data-disclosure-content]');
    details.addEventListener('toggle', () => {
      if (!content) return;
      if (details.open) enter(content, { distance: 6, duration: 240 });
      else settle(content);
    });
  });
}

export function initReveals() {
  playIntro();
  observeReveals();
  observeDisclosures();

  document.addEventListener('focusin', (event) => {
    if (!(event.target instanceof Node)) return;
    for (const element of [...active.keys()]) if (element.contains(event.target)) settle(element);
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    // Remaining units stay static until the next navigation, as MOTION.md describes.
    settleAll();
    observer?.disconnect();
    releasePending();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) settleAll();
  });
  window.addEventListener('beforeprint', () => {
    settleAll();
    releasePending();
  });
  window.addEventListener('pagehide', settleAll);
}
