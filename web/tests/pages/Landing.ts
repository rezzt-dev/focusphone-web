import { type Page } from '@playwright/test';
export class Landing {
  constructor(readonly page: Page) {}
  async open() {
    await this.page.goto('/');
  }
  get themeGroup() {
    return this.page.getByRole('group', { name: 'Tema de la vista previa' });
  }
  get clockGroup() {
    return this.page.getByRole('group', { name: 'Estilo de reloj de la vista previa' });
  }
  get phone() {
    return this.page.locator('#demo-phone');
  }
  get breathButton() {
    return this.page.getByRole('button', { name: /regálate.*pausa|detener la pausa/ });
  }
  get breathStatus() {
    return this.page.locator('#breath-status');
  }
}
