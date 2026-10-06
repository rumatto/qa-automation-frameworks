import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Patchable weak-assertion findings (qadoctor.playwright.weak-assertion).
// Each produces an executable kind="patch" treatment that replaces a
// toBeTruthy()/toBeFalsy() on a mechanically-known boolean expression with
// toBe(true)/toBe(false).
// ---------------------------------------------------------------------------

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on .some())
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on boolean .some()', async ({ page }) => {
  const items = [{ ok: true }, { ok: false }, { ok: true }];
   expect(items.some((i) => i.ok)).toBe(true);
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on .every())
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on boolean .every()', async ({ page }) => {
  const items = [{ ok: true }, { ok: true }];
  expect(items.every((i) => i.ok)).toBe(true);
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on .includes())
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on boolean .includes()', async ({ page }) => {
  const names = ['alice', 'bob', 'carol'];
  expect(names.includes('bob')).toBeTruthy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on .ok())
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on boolean .ok()', async ({ page }) => {
  const item = { ok: true, value: 42 };
  expect(item.ok).toBeTruthy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on === comparison)
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on equality comparison', async ({ page }) => {
  const status: string = 'active';
   expect(status === 'active').toBeTruthy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on !== comparison)
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on inequality comparison', async ({ page }) => {
  const status: string = 'inactive';
   expect(status !== 'active').toBeTruthy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on >= comparison)
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on >= comparison', async ({ page }) => {
  const count = 10;
  expect(count >= 5).toBeTruthy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on < comparison)
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on < comparison', async ({ page }) => {
  const count = 3;
   expect(count < 5).toBe(true);
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeFalsy on .some() negated)
// EXPECTED TREATMENT: patch toBe(false)
test('weak assertion: toBeFalsy on boolean .some()', async ({ page }) => {
  const items = [{ ok: false }, { ok: false }];
  expect(items.some((i) => i.ok)).toBeFalsy();
});

// EXPECTED FINDING: qadoctor.playwright.weak-assertion (toBeTruthy on == comparison)
// EXPECTED TREATMENT: patch toBe(true)
test('weak assertion: toBeTruthy on loose equality comparison', async ({ page }) => {
  const code: unknown = 404;
  expect(code == 'not-found').toBe(true);
});

// ---------------------------------------------------------------------------
// Non-patchable weak assertions (generic truthiness on non-boolean objects).
// These produce findings but NO treatment (the expression is not a mechanical
// boolean, so toBe(true)/toBe(false) is not safe).
// ---------------------------------------------------------------------------

// EXPECTED FINDING (optional): qadoctor.playwright.weak-assertion — ambiguous
// EXPECTED NO TREATMENT: expression is not a mechanical boolean
test('ambiguous truthiness without safe treatment', async ({ page }) => {
  const response: { ok: boolean; data: string } = { ok: true, data: 'hello' };
  expect(response).toBeTruthy();
});

// ---------------------------------------------------------------------------
// Stable assertions (no finding expected).
// ---------------------------------------------------------------------------

// EXPECTED NO FINDING: no weak-assertion (explicit toBe(true) on boolean)
test('good assertion with toBe(true)', async ({ page }) => {
  const items = [{ ok: true }, { ok: false }, { ok: true }];
  expect(items.some((i) => i.ok)).toBe(true);
});

// ---------------------------------------------------------------------------
// Other known findings (not patchable, kept for coverage diversity).
// ---------------------------------------------------------------------------

// Intentional QA problem: hardcoded wait (waitForTimeout) instead of a real
// wait condition.
// EXPECTED FINDING: qadoctor.playwright.no-wait-for-timeout
// EXPECTED NO TREATMENT (no patch available for this rule)
test('hardcoded wait instead of expect', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForTimeout(2000);
  await expect(page.locator('#status')).toBeVisible();
});

// Intentional QA problem: fragile raw locator using a brittle CSS selector.
// EXPECTED FINDING: qadoctor.playwright.fragile-raw-locator
// EXPECTED NO TREATMENT (manual-guidance only, no executable patch)
test('fragile locator', async ({ page }) => {
  const items = await page.locator('div > div > ul > li:nth-child(2) > a').all();
  expect(items.length).toBeGreaterThan(0);
});

// Intentional QA problem: retry usage (CI efficiency / flakiness signal).
// EXPECTED FINDING: qadoctor.playwright.retry-usage
// EXPECTED NO TREATMENT (no patch)
test.describe.configure({ retries: 2 });

test('retry-configured test', async ({ page }) => {
  await page.goto('/home');
  expect(page.locator('h1')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Control / edge cases — these should NOT trigger findings or treatments.
// ---------------------------------------------------------------------------

// Stable Playwright locator: data-test-id — must NOT trigger fragile-locator.
// EXPECTED NO FINDING: qadoctor.playwright.fragile-raw-locator
test('stable locator with data-test-id', async ({ page }) => {
  await page.goto('/stable');
  expect(page.locator('[data-test-id="submit-button"]')).toBeVisible();
});

// Normal test with no intentional findings.
// EXPECTED NO FINDING: all rules
test('normal test with no intentional findings', async ({ page }) => {
  await page.goto('/normal');
  await expect(page.locator('#main')).toBeVisible();
  expect(page.title()).resolves.toContain('Normal');
});
