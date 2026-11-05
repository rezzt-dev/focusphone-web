/**
 * Header surface, kept out of the lazily loaded scroll module because it must be right from the
 * first frame, including when the browser restores a scrolled position. The header gains its raised surface once the opening section (`data-header-until`) has passed
 * beneath it, or, on reading pages, after the first few pixels (`data-header-sentinel`).
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const until = document.querySelector<HTMLElement>('[data-header-until]');
  const target = until ?? document.querySelector<HTMLElement>('[data-header-sentinel]');
  if (!header || !target || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    ([entry]) => header.toggleAttribute('data-raised', !entry.isIntersecting),
    // The sticky header covers the top of the viewport; the hero has passed once it is beneath it.
    { rootMargin: until ? `-${header.offsetHeight}px 0px 0px 0px` : '0px' }
  );
  observer.observe(target);
}
