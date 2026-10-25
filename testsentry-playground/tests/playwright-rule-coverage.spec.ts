import { expect, test } from '@playwright/test';

let sharedCounter = 0;

// EXPECTED FINDING: qadoctor.playwright.shared-module-state
test('shared state mutation one', async () => {
  sharedCounter += 1;
  expect(sharedCounter).toBeGreaterThan(0);
});

test('shared state mutation two', async () => {
  sharedCounter += 1;
  expect(sharedCounter).toBeGreaterThan(0);
});

// EXPECTED FINDING: qadoctor.playwright.no-force-actions
test('forced action', async ({ page }) => {
  await page.setContent('<button data-testid="forced-action">Continue</button>');
  await page.getByTestId('forced-action').click({ force: true });
  await expect(page.getByTestId('forced-action')).toBeVisible();
});

// EXPECTED FINDING: qadoctor.playwright.large-serial-describe
test.describe.serial('large serial acceptance block', () => {
  test('serial case 1', async () => { expect(1).toBe(1); });
  test('serial case 2', async () => { expect(2).toBe(2); });
  test('serial case 3', async () => { expect(3).toBe(3); });
  test('serial case 4', async () => { expect(4).toBe(4); });
  test('serial case 5', async () => { expect(5).toBe(5); });
  test('serial case 6', async () => { expect(6).toBe(6); });
});
