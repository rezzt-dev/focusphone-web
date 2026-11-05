import { enter } from './animations';

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function closeMenu(restoreFocus = false) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
  if (restoreFocus) menuToggle.focus();
}
menuToggle?.addEventListener('click', () => {
  if (!mobileNav) return;
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
  if (open) enter(mobileNav, { distance: -6, duration: 240 });
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (event.target instanceof Node && !document.querySelector('.header')?.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const demo = document.querySelector<HTMLElement>('#demo-phone');
document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!demo) return;
    demo.dataset.theme = button.dataset.themeChoice;
    document
      .querySelectorAll('[data-theme-choice]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-clock]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!demo) return;
    const digital = demo.querySelector<HTMLElement>('.clock-digital');
    const words = demo.querySelector<HTMLElement>('.clock-words');
    if (digital && words) {
      digital.hidden = button.dataset.clock !== 'digital';
      words.hidden = button.dataset.clock !== 'words';
      enter(digital.hidden ? words : digital, { distance: 5, duration: 280 });
    }
    document
      .querySelectorAll('[data-clock]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  });
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;
demo?.querySelectorAll<HTMLElement>('[data-demo-label]').forEach((label) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'phone-app';
  button.dataset.demoApp = label.textContent?.trim();
  button.textContent = label.textContent;
  label.replaceWith(button);
});
demo?.querySelectorAll<HTMLButtonElement>('[data-demo-app]').forEach((button) => {
  button.addEventListener('click', () => {
    const toast = demo.querySelector<HTMLElement>('.phone-toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = `${button.dataset.demoApp}. una elección, no un impulso. Esta es una vista de ejemplo.`;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4000);
  });
});

const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-profile]')];
function selectProfile(tab: HTMLButtonElement) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls') ?? '');
    if (panel) panel.hidden = !selected;
  });
  const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
  enter(panel, { variant: 'settle', duration: 320 });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProfile(tab));
  tab.addEventListener('keydown', (event) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    selectProfile(tabs[next]);
  });
});

window.addEventListener('pagehide', () => clearTimeout(toastTimer));

// First-party integration point; no analytics SDK, network request or storage by default.
document.querySelectorAll<HTMLAnchorElement>('[data-conversion]').forEach((link) => {
  link.addEventListener('click', () => {
    window.dispatchEvent(
      new CustomEvent('focusphone:conversion', {
        detail: { action: link.dataset.conversion, location: link.dataset.location }
      })
    );
  });
});

// Keep the visitor oriented while moving through the product story.
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a[href^="#"]')];
if ('IntersectionObserver' in window && sectionLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-100px 0px -55% 0px' }
  );
  sectionLinks.forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) sectionObserver.observe(section);
  });
}
