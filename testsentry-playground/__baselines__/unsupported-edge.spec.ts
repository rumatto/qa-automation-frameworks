import { test, expect } from '@playwright/test';

// Exact data-testid XPath is now deterministically treatable.
// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
// EXPECTED TREATMENT: patch to page.getByTestId('submit')
test('exact data-testid xpath maps to getByTestId', async ({ page }) => {
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

// Truly unsupported XPath remains manual guidance/no deterministic patch.
test('unsupported text xpath remains manual', async ({ page }) => {
  await page.setContent('<button>Submit</button>');
  const btn = page.locator('xpath=//button[contains(text(), "Submit")]');
  await expect(btn).toBeVisible();
});
