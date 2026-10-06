import { test, expect } from '@playwright/test';

// TESTSENTRY ACCEPTANCE: shared setup / beforeAll
// Exercises contextual severity behavior if TestSentry supports it.
// Do not invent a new rule.
test.describe('Shared setup example', () => {
  test.beforeAll(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('demo');
    await page.getByLabel('Password').fill('secret');
    await page.getByTestId('login-btn').click();
  });

  test('post-login dashboard is visible', async ({ page }) => {
    await expect(page.getByTestId('dashboard')).toBeVisible();
  });

  test('post-login profile link is visible', async ({ page }) => {
    await expect(page.getByTestId('profile')).toBeVisible();
  });
});
