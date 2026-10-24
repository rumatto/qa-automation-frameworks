import { expect, test } from '@playwright/test';

// Intentional TestSentry runtime-healing fixture.
// Fragile locator: form > div:nth-child(2) > input
// Expected semantic replacement: page.getByLabel('Email address')
test('runtime healing fixture', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <body>
        <form>
          <div>
            <label for="name">Name</label>
            <input id="name" type="text" />
          </div>
          <div>
            <label for="email">Email address</label>
            <input id="email" type="email" />
          </div>
        </form>
      </body>
    </html>
  `);

  const input = page.locator('form > div:nth-child(2) > input');
  await expect(input).toBeVisible();
  await input.fill('person@example.com');
  await expect(input).toHaveValue('person@example.com');
});
