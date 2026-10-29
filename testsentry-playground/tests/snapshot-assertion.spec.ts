import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Intentional TestSentry fixtures: qadoctor.playwright.snapshot-assertion
//
// A Playwright method result (isVisible, count, inputValue, attribute, title)
// is asserted directly as a snapshot instead of using Playwright's async
// matchers or awaiting the value.
//
// Treatment-eligible: direct single-line comment-free assertion.
// Treatment-ineligible: strict local-variable snapshot form, multiline /
// comment-bearing case.
//
// These fixtures are intentional TestSentry smells. Do not convert them to
// best-practice code.
// ---------------------------------------------------------------------------

// -------- Positives --------

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (isVisible -> toBe(true))
// EXPECTED TREATMENT: patch to Playwright matcher
test('snapshot-assertion: direct isVisible -> toBe(true)', async ({ page }) => {
  await page.goto('/app');
  expect(page.locator('#banner').isVisible()).toBe(true);
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (count -> exact equality)
// EXPECTED TREATMENT: patch to toHaveCount
test('snapshot-assertion: direct count -> exact equality', async ({ page }) => {
  await page.goto('/app');
  expect(page.locator('.item').count()).toBe(3);
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (inputValue -> toBe)
// EXPECTED TREATMENT: patch to toHaveValue
test('snapshot-assertion: direct inputValue', async ({ page }) => {
  await page.goto('/form');
  expect(page.locator('#name').inputValue()).toBe('alice');
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (attribute -> toBe)
// EXPECTED TREATMENT: patch to toHaveAttribute
test('snapshot-assertion: direct attribute', async ({ page }) => {
  await page.goto('/app');
  expect(page.locator('#btn').getAttribute('disabled')).toBe('');
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (title -> toBe)
// EXPECTED TREATMENT: patch to toHaveTitle
test('snapshot-assertion: direct title', async ({ page }) => {
  await page.goto('/app');
  expect(page.title()).toBe('Home');
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (strict local-variable snapshot)
// EXPECTED NO TREATMENT: local variable, manual / Diagnosis-only
test('snapshot-assertion: strict local-variable snapshot form', async ({ page }) => {
  await page.goto('/app');
  const snapshot = page.locator('#banner').isVisible();
  expect(snapshot).toBe(true);
});

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (multiline / comment-bearing)
// EXPECTED NO TREATMENT: multiline / comment-bearing assertion
test('snapshot-assertion: multiline comment-bearing assertion', async ({ page }) => {
  await page.goto('/app');
  // The banner must be visible after the redirect; snapshot the visibility.
  expect(
    page.locator('#banner').isVisible(),
  ).toBe(true);
});

// ---------------------------------------------------------------------------
// Negatives — should NOT produce snapshot-assertion findings.
// ---------------------------------------------------------------------------

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion
test('snapshot-assertion negative: range count', async ({ page }) => {
  await page.goto('/app');
  expect(await page.locator('.item').count()).toBeGreaterThan(0);
});

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion
test('snapshot-assertion negative: attribute truthiness', async ({ page }) => {
  await page.goto('/app');
  expect(await page.locator('#chk').getAttribute('aria-checked')).toBeTruthy();
});

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion
test('snapshot-assertion negative: normalized text', async ({ page }) => {
  await page.goto('/app');
  expect(await page.locator('#msg').textContent()).toContain('success');
});

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion
test('snapshot-assertion negative: reused local snapshot', async ({ page }) => {
  await page.goto('/app');
  const snapshot = page.locator('#banner').isVisible();
  await expect(snapshot).resolves.toBe(true);
});

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion
test('snapshot-assertion negative: page.url / textContent unsupported', async ({ page }) => {
  await page.goto('/app');
  expect(await page.url()).toContain('/app');
  expect(await page.locator('#msg').textContent()).toBe('hello');
});
