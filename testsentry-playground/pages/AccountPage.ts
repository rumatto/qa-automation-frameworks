import type { Page } from '@playwright/test';

export class AccountPage {
  constructor(private readonly page: Page) {}

  readonly settingsLink = () => this.page.locator('[data-testid="account-settings"]');
}
