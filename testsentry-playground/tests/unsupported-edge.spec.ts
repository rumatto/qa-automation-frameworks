import { test, expect } from '@playwright/test';

// TESTSENTRY ACCEPTANCE: unsupported/edge pattern
// Uses an xpath selector that the current TestSentry healer does not support.
// TestSentry must not fabricate a patch for this pattern.
test('unsupported xpath locator', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <body>
        <button data-testid="submit">Submit</button>
      </body>
    </html>
  `);

  const btn = page.locator('xpath=//button[@data-testid="submit"]');
  await expect(btn).toBeVisible();
});
