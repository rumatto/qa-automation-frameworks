import { expect, test } from '@playwright/test';

// Runtime locator-healing acceptance data.
// These tests intentionally start from fragile raw locators so TestSentry can
// collect runtime evidence and propose distinct semantic locator strategies.

test('runtime healing candidate: explicit role and accessible name -> getByRole', async ({ page }) => {
  await page.setContent(`
    <main>
      <nav>
        <a href="/home">Home</a>
        <a role="link" aria-label="Account settings" href="/settings">Settings</a>
      </nav>
    </main>
  `);

  // EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
  // EXPECTED RUNTIME CANDIDATE: page.getByRole('link', { name: 'Account settings' })
  const settings = page.locator('main > nav > a:nth-child(2)');
  await expect(settings).toBeVisible();
});

test('runtime healing candidate: associated label -> getByLabel', async ({ page }) => {
  await page.setContent(`
    <form>
      <div>
        <label for="email">Email address</label>
        <input id="email" type="email" />
      </div>
    </form>
  `);

  // The runtime evidence collector reads the associated label. There is no
  // explicit role attribute, so this fixture exercises the getByLabel fallback.
  // EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
  // EXPECTED RUNTIME CANDIDATE: page.getByLabel('Email address')
  const email = page.locator('form > div > input:nth-child(2)');
  await expect(email).toBeVisible();
});
