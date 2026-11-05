/**
 * Scroll-linked motion: reading progress, depth (`data-parallax`) and scrubbed sections
 * (`data-scrub`). Nothing here holds or rewrites the scroll: anime.js `onScroll` maps the
 * page position onto paused, persistent WAAPI animations, batched in its own animation frame,
 * and every effect is torn down as soon as its conditions stop holding.
 */
import { onScroll } from 'animejs/events';
import { stagger as sequence } from 'animejs/utils';
import { waapi } from 'animejs/waapi';
import { inkFrom } from './tokens';
import { desktop, lowPower, numberData, reducedMotion, whenever, type Cleanup } from './utils';

type Linked = ReturnType<typeof waapi.animate>;
type Observer = ReturnType<typeof onScroll>;
type LinkedParams = Parameters<typeof waapi.animate>[1];

/** Scroll position is the clock: linear time, 0–1000 ms between the two thresholds. */
const timeline = { duration: 1000, ease: 'linear', persist: true } as const;

/**
 * Links `animate(observer)` to the scroll range where `target` travels from `enter` to `leave`.
 * Thresholds read "container target": `'bottom top'` is the viewport bottom meeting the target top.
 */
function link(
  target: HTMLElement,
  enter: string,
  leave: string,
  animate: (observer: Observer) => Linked
): Cleanup {
  const observer = onScroll({ target, enter, leave, sync: true });
  const animation = animate(observer);
  return () => {
    observer.revert();
    animation.revert();
  };
}

function scrubbed(targets: HTMLElement[], params: LinkedParams, observer: Observer) {
  return waapi.animate(targets, { ...timeline, ...params, autoplay: observer });
}

/** A hairline under the header that fills with the page; it carries no autonomous motion. */
function readingProgress(): Cleanup {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return () => {};
  return link(document.body, 'top top', 'bottom bottom', (observer) =>
    scrubbed([bar], { scale: ['0 1', '1 1'] }, observer)
  );
}

/**
 * Background layers drift slower than the page while their scope scrolls away, adding depth to
 * the hero. Text and product never follow the scroll.
 */
function depth(): Cleanup {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map((layer) => {
    const scope = layer.closest<HTMLElement>('[data-parallax-scope]') ?? layer.parentElement ?? layer;
    const distance = numberData(layer, 'parallax', 24);
    const growth = numberData(layer, 'parallaxScale', 0);
    const params: LinkedParams = { translate: ['0px 0px', `0px ${distance}px`] };
    if (growth) params.scale = [1, 1 + growth];
    return link(scope, 'top top', 'top bottom', (observer) => scrubbed([layer], params, observer));
  });
  return () => {
    for (const cleanup of layers) cleanup();
  };
}

/**
 * Sections whose reading is paced by the scroll, never held by it:
 * - `ink`: each `[data-scrub-item]` line darkens in turn, finishing before the reading zone.
 * - `draw`: each `[data-scrub-item]` line draws from the left; `[data-scrub-mark]` labels darken.
 * Items overlap, so the sequence feels continuous rather than stepped.
 */
function scrubs(): Cleanup {
  const cleanups: Cleanup[] = [];
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((section) => {
    const items = [...section.querySelectorAll<HTMLElement>('[data-scrub-item]')];
    const marks = [...section.querySelectorAll<HTMLElement>('[data-scrub-mark]')];
    if (!items.length) return;
    const enter = section.dataset.scrubEnter ?? 'bottom top';
    const leave = section.dataset.scrubLeave ?? '55% bottom';
    const step = timeline.duration / (items.length + 1);
    const pace = { duration: step * 2, delay: sequence(step) };
    const darken = { ...pace, opacity: [inkFrom, 1] };
    if (section.dataset.scrub === 'draw') {
      cleanups.push(
        link(section, enter, leave, (observer) =>
          scrubbed(items, { ...pace, scale: ['0 1', '1 1'] }, observer)
        )
      );
      if (marks.length)
        cleanups.push(link(section, enter, leave, (observer) => scrubbed(marks, darken, observer)));
    } else {
      cleanups.push(link(section, enter, leave, (observer) => scrubbed(items, darken, observer)));
    }
  });
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

export function initScroll() {
  const moving = () => !reducedMotion.matches && !lowPower;
  whenever(moving, [reducedMotion], readingProgress);
  whenever(moving, [reducedMotion], scrubs);
  whenever(() => moving() && desktop.matches, [reducedMotion, desktop], depth);
}
