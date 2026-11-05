import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { Landing } from './pages/Landing';

test('theme and clock controls update the illustrative launcher', async ({ page }) => {
  const landing = new Landing(page);
  await landing.open();
  await landing.themeGroup.getByRole('button', { name: 'off-white' }).click();
  await expect(landing.phone).toHaveAttribute('data-theme', 'offwhite');
  await expect(landing.themeGroup.getByRole('button', { name: 'off-white' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await landing.clockGroup.getByRole('button', { name: 'en palabras' }).click();
  await expect(landing.phone.getByText('las nueve')).toBeVisible();
  await expect(landing.phone.getByText('09:41', { exact: true })).toBeHidden();
  await landing.phone.getByRole('button', { name: 'música', exact: true }).click();
  await expect(landing.phone.getByRole('status')).toContainText('vista de ejemplo');
});

test('profiles implement keyboard tabs and expose the matching content', async ({ page }) => {
  await page.goto('/');
  const normal = page.getByRole('tab', { name: 'normal', exact: true });
  await normal.focus();
  await normal.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'trabajo' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'trabajo' })).toContainText('cada cosa,');
  await page.getByRole('tab', { name: 'trabajo' }).press('End');
  await expect(page.getByRole('tabpanel', { name: 'detox' })).toContainText('contraseña');
  await expect(page.getByRole('tabpanel', { name: 'normal' })).toBeHidden();
});

test('breathing has a complete, repeatable and cancellable eight-second cycle', async ({ page }) => {
  await page.clock.install();
  const landing = new Landing(page);
  await landing.open();
  await landing.breathButton.click();
  await expect(landing.breathStatus).toContainText('Inhala');
  await page.clock.fastForward(4100);
  await expect(landing.breathStatus).toContainText('Exhala');
  await page.clock.fastForward(4100);
  await expect(landing.breathStatus).toContainText('Lo siguiente lo eliges tú');
  await landing.breathButton.click();
  await landing.breathButton.click();
  await expect(landing.breathStatus).toContainText('Pausa detenida');
});

test('FAQ and local navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  // Motion never owns visibility: without scripts every unit renders in its final state.
  await expect(page.locator('.hero-second')).toHaveCSS('opacity', '1');
  await expect(page.locator('#experiencia .section-heading')).toHaveCSS('opacity', '1');
  await expect(page.locator('.wordmark')).toHaveCSS('clip-path', 'none');
  await page.getByText('¿funciona en mi móvil?', { exact: true }).click();
  await expect(page.getByText('Necesitas Android 7.0 o posterior.')).toBeVisible();
  await expect(page.getByText('permítete')).toBeVisible();
  await page.getByRole('link', { name: 'instalación', exact: true }).click();
  await expect(page).toHaveURL(/\/instalar\//);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('tu nuevo inicio.');
  await context.close();
});

test('main page has no automatic WCAG AA violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('responsive layouts have no horizontal overflow', async ({ page }) => {
  for (const width of [320, 375, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
});

test('all internal links, images and supporting pages resolve', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const links = await page
    .getByRole('link')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href') ?? '').filter((href) => href.startsWith('/'))
    );
  for (const href of new Set(links)) {
    const result = await request.get(href);
    expect(result.ok(), href).toBe(true);
  }
  for (const path of ['/instalar/', '/privacidad/', '/proyecto/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.document .lead')).toHaveCSS('opacity', '1');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('mobile menu opens, closes on Escape and follows section links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation only');
  await page.goto('/');
  const button = page.getByRole('button', { name: /Abrir menú|Cerrar menú/ });
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await page
    .getByRole('navigation', { name: 'Navegación móvil' })
    .getByRole('link', { name: 'el launcher' })
    .click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#experiencia$/);
});

test('feedback validates locally and can prepare an unpublished GitHub draft', async ({ page }) => {
  await page.goto('/#participa');
  const form = page.getByRole('form', { name: 'hay espacio para tu idea.' });
  const topic = form.getByLabel('¿qué te gustaría compartir?');
  const message = form.getByLabel('te leemos.');
  await form.getByRole('button', { name: /preparar consulta en GitHub|preparar mi idea/ }).click();
  await expect(topic).toBeFocused();
  await topic.selectOption({ label: 'una idea' });
  await message.fill('Me ayudaría un acceso más sencillo a los perfiles.');
  await form.evaluate((element) => {
    element.dataset.issuesUrl = 'https://github.com/rezzt-dev/focusphone-app/issues/new';
  });
  await page.route('https://github.com/rezzt-dev/focusphone-app/issues/new?**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Borrador en GitHub</h1>' })
  );
  await form.getByRole('button', { name: /preparar consulta en GitHub|preparar mi idea/ }).click();
  await expect(page).toHaveURL(/github\.com\/rezzt-dev\/focusphone-app\/issues\/new\?/);
  const draft = new URL(page.url());
  expect(draft.searchParams.get('title')).toBe('[idea] Una idea para FocusPhone');
  expect(draft.searchParams.get('body')).toBe('Me ayudaría un acceso más sencillo a los perfiles.');
});

test('tablet navigation remains reachable and clears its expanded state on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
});

test('motion preference changes settle the page and preserve interactive state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const phone = page.locator('#demo-phone');
  await page.getByRole('button', { name: 'en palabras', exact: true }).click();
  await page.getByRole('button', { name: 'off-white', exact: true }).click();
  await expect(phone).toHaveAttribute('data-theme', 'offwhite');
  await expect(phone.locator('.clock-words')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.getAnimations().filter((animation) => animation.playState === 'running').length
      )
    )
    .toBe(0);
  await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
  await page.getByRole('tab', { name: 'detox', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'detox' })).toContainText('contraseña');
  expect(errors).toEqual([]);
});

test('scroll reveals settle and pointer depth resets when motion is reduced', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const heading = page.locator('#experiencia .section-heading');
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute('data-reveal', 'done');
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toHaveCSS('translate', 'none');
  const phone = page.locator('#demo-phone');
  await phone.scrollIntoViewIfNeeded();
  if (testInfo.project.name === 'desktop') {
    const bounds = await phone.boundingBox();
    if (!bounds) throw new Error('Product preview must be visible');
    await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.5);
    await expect.poll(() => phone.evaluate((element) => element.style.rotate)).not.toBe('');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(phone).toHaveCSS('rotate', 'none');
  }
  await page.getByRole('button', { name: 'en palabras', exact: true }).click();
  await page.getByRole('button', { name: '09:41', exact: true }).click();
  await expect(phone.locator('.clock-digital')).toBeVisible();
  await expect(phone.locator('.clock-words')).toBeHidden();
});

test('load choreography settles once and is skipped when entering through an anchor', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'live');
  for (const selector of ['.hero-second', '.hero-phone-wrap', '.caption-bottom']) {
    await expect(page.locator(selector)).toHaveCSS('opacity', '1');
  }
  await page.goto('/instalar/');
  await page.goto('/#preguntas');
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBeUndefined();
  await expect(page.locator('.hero-second')).toHaveCSS('opacity', '1');
});

test('scroll-linked reading follows the page and settles when motion is reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const constrained = await page.evaluate(
    () =>
      navigator.hardwareConcurrency <= 2 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 2
  );
  test.skip(constrained, 'Constrained devices keep scroll-linked effects off by design.');
  const lines = page.locator('#idea-title [data-scrub-item]');
  const opacity = (index: number) =>
    lines.nth(index).evaluate((element) => Number(getComputedStyle(element).opacity));
  // The first scroll loads the scroll module; unread lines wait below the fold, dimmed.
  await page.evaluate(() => window.scrollBy(0, 1));
  await expect.poll(() => opacity(2)).toBeLessThan(0.5);
  await page.locator('#idea-title').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await expect.poll(() => opacity(2)).toBe(1);
  const progress = page.locator('[data-scroll-progress]');
  await expect.poll(() => progress.evaluate((element) => getComputedStyle(element).scale)).not.toBe('0 1');
  await expect(page.locator('[data-header]')).toHaveAttribute('data-raised', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.scrollBy(0, 1));
  for (const index of [0, 1, 2]) await expect.poll(() => opacity(index)).toBe(1);
  await expect(progress).toBeHidden();
  await expect(page.locator('.step-line').first()).toBeHidden();
});

test('all preview themes and profile states retain accessible contrast', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const name of ['slate', 'off-white', 'warm beige', 'navy']) {
    await page.getByRole('button', { name, exact: true }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, name).toEqual([]);
  }
  for (const name of ['trabajo', 'detox']) {
    await page.getByRole('tab', { name, exact: true }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, name).toEqual([]);
  }
  await page
    .locator('.faq-item')
    .first()
    .evaluate((element) => {
      (element as HTMLDetailsElement).open = true;
    });
  const toggle = page.locator('.menu-toggle');
  if (await toggle.isVisible()) await toggle.click();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze())
      .violations
  ).toEqual([]);
});

test('no-JavaScript landscape navigation leaves the content reachable', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 640, height: 360 }
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.header')).toHaveCSS('position', 'static');
  await expect(page.locator('#demo-phone button')).toHaveCount(0);
  await page.locator('#descargar').scrollIntoViewIfNeeded();
  const header = await page.locator('.header').boundingBox();
  expect(header!.y + header!.height).toBeLessThanOrEqual(0);
  await expect(page.getByRole('link', { name: 'consultar disponibilidad', exact: true })).toBeInViewport();
  await context.close();
});

test('feedback rejects whitespace and preserves Unicode without a public channel', async ({ page }) => {
  await page.goto('/#participa');
  await page.locator('#feedback-topic').selectOption({ label: 'una idea' });
  await page.locator('#feedback-message').fill(' '.repeat(30));
  await page.locator('[data-feedback-submit]').click();
  expect(
    await page
      .locator('#feedback-message')
      .evaluate((element) => (element as HTMLTextAreaElement).checkValidity())
  ).toBe(false);
  const body = 'Mi idea: música & concentración #vida\n' + '😀'.repeat(900);
  await page.locator('#feedback-message').fill(body);
  await page.locator('[data-feedback-submit]').click();
  await expect(page.locator('#feedback-draft')).toHaveValue(`[idea] Una idea para FocusPhone\n\n${body}`);
  await expect(page.locator('.feedback-status')).toContainText('No se ha enviado nada');
  await page.locator('.feedback-form').evaluate((element) => {
    (element as HTMLElement).dataset.issuesUrl = 'https://github.com/rezzt-dev/focusphone-app/issues/new';
  });
  await page.locator('[data-feedback-submit]').click();
  await expect(page.locator('.feedback-status')).toContainText('Tu mensaje es largo');
  await expect(page).toHaveURL(/#participa$/);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
      configurable: true
    })
  );
  await page.getByRole('button', { name: 'copiar texto', exact: true }).click();
  await expect(page.locator('.feedback-status')).toContainText('Usa copiar');
  await expect(page.locator('#feedback-draft')).toBeFocused();
});

test('unknown routes return a real 404 and local fragment targets exist', async ({ page, request }) => {
  expect((await request.get('/this-page-does-not-exist/')).status()).toBe(404);
  for (const path of ['/', '/instalar/', '/privacidad/', '/proyecto/']) {
    await page.goto(path);
    const targets = await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links
          .map((link) => (link as HTMLAnchorElement).href)
          .filter((href) => new URL(href).origin === location.origin)
      );
    for (const href of new Set(targets)) {
      const url = new URL(href);
      expect((await request.get(url.pathname)).ok(), href).toBe(true);
      if (url.hash) {
        const response = await request.get(url.pathname);
        const html = await response.text();
        expect(html, href).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
      }
    }
  }
});

test('large text remains within the viewport and conversion events identify their source', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const conversions: unknown[] = [];
  await page.exposeFunction('recordConversion', (detail: unknown) => conversions.push(detail));
  await page.evaluate(() => {
    window.addEventListener('focusphone:conversion', (event) => {
      (window as unknown as { recordConversion: (detail: unknown) => void }).recordConversion(
        (event as CustomEvent).detail
      );
    });
  });
  await page.locator('[data-location="download"]').first().click();
  // The destination is local until public distribution is configured.
  await expect(page).toHaveURL(/\/instalar\/#disponibilidad$/);
  expect(conversions).toEqual([{ action: 'availability', location: 'download' }]);
});
