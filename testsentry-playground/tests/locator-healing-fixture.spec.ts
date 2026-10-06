import { expect, test } from '@playwright/test';

// ---------------------------------------------------------------------------
// Deterministic TestSentry locator-healing fixture.
// ---------------------------------------------------------------------------

// TESTSENTRY ACCEPTANCE: supported raw Playwright locator
// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
//   (deterministic-testid reason)
// EXPECTED TREATMENT: patch to page.locator('[data-testid="login-button"]')
test('supported data-testid locator', async ({ page }) => {
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

// TESTSENTRY ACCEPTANCE: supported nested locator
// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
// EXPECTED TREATMENT: patch nested locator to use data-testid
test('supported nested data-testid locator', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <body>
        <div data-testid="card">
          <button data-testid="card-action">Submit</button>
        </div>
      </body>
    </html>
  `);

  const action = page.locator('[data-testid="card"]').locator('button >> nth=0');
  await expect(action).toBeVisible();
  await expect(action).toHaveText('Submit');
});

// TESTSENTRY ACCEPTANCE: ambiguous locator — manual guidance only
// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
// EXPECTED NO TREATMENT: ambiguous, manual guidance only
test('ambiguous locator without safe patch', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <body>
        <div class="panel">
          <div class="row">
            <a href="/x">Link</a>
          </div>
        </div>
      </body>
    </html>
  `);

  const link = page.locator('div > div > a').first();
  await expect(link).toBeVisible();
});
