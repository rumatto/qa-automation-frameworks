import { expect, test } from '@playwright/test';

// ---------------------------------------------------------------------------
// Deterministic TestSentry locator-healing fixture.
//
// Exercises the currently supported TestSentry locator healer:
//   page.locator('[data-testid="login-button"]')
//     -> page.locator('[data-testid="login-button"]')
//
// The test is deterministic: the locator resolves normally before healing
// (the page contains exactly one element with data-testid="login-button").
// No other locator bugs, no ambiguity, no new healing strategies.
// ---------------------------------------------------------------------------

// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
//   (deterministic-testid reason)
// EXPECTED TREATMENT: patch to page.locator('[data-testid="login-button"]')
test('deterministic data-testid locator resolves normally', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <body>
        <button data-testid="login-button" type="button">Sign in</button>
      </body>
    </html>
  `);

  const button = page.locator('[data-testid="login-button"]');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Sign in');
});
