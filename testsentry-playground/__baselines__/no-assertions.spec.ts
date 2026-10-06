import { test } from '@playwright/test';

// TESTSENTRY ACCEPTANCE: no-assertions test
// A test that performs actions but contains no expect() assertions.
// This should trigger a no-assertions finding with no automated patch.
test('no assertions — navigation only', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="refresh"]');
});
