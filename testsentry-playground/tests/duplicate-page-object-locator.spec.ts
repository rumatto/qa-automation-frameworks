import { expect, test } from '@playwright/test';

// EXPECTED FINDING: qadoctor.playwright.duplicate-page-object-locator
// AccountPage already exposes this exact raw locator.
test('duplicates locator already owned by page object', async ({ page }) => {
  await page.setContent('<a data-testid="account-settings" href="/settings">Settings</a>');
  const settings = page.locator('[data-testid="account-settings"]');
  await expect(settings).toBeVisible();
});
