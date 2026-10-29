import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Intentional TestSentry fixtures: qadoctor.playwright.missing-await
//
// An async Playwright action (page.click, locator action, Playwright expect)
// is invoked without await inside an async test.
//
// Treatment-eligible: standalone unawaited call inside an already async test.
// Treatment-ineligible: non-async enclosing callback/helper.
//
// These fixtures are intentional TestSentry smells. Do not convert them to
// best-practice code.
// ---------------------------------------------------------------------------

// -------- Treatment-eligible: standalone unawaited call inside an async test --------

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited page.click)
// EXPECTED TREATMENT: patch with await
test('missing-await: unawaited page.click (treatment-eligible)', async ({ page }) => {
  await page.goto('/form');
  page.click('#submit'); // unawaited
  expect(page.locator('#msg')).toBeVisible();
});

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited locator.click)
// EXPECTED TREATMENT: patch with await
test('missing-await: unawaited Locator action (treatment-eligible)', async ({ page }) => {
  await page.goto('/form');
  page.locator('#submit').click(); // unawaited
});

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited Playwright expect)
// EXPECTED TREATMENT: patch with await
test('missing-await: unawaited Playwright expect (treatment-eligible)', async ({ page }) => {
  await page.goto('/app');
  expect(page.locator('#banner')).toBeVisible(); // unawaited
});

// ---------------------------------------------------------------------------
// Negatives — should NOT produce missing-await findings.
// ---------------------------------------------------------------------------

// EXPECTED NO FINDING: qadoctor.playwright.missing-await
test('missing-await negative: awaited call', async ({ page }) => {
  await page.goto('/form');
  await page.click('#submit');
});

// EXPECTED NO FINDING: qadoctor.playwright.missing-await
test('missing-await negative: returned call', async ({ page }) => {
  await page.goto('/form');
  return page.click('#submit');
});

// EXPECTED NO FINDING: qadoctor.playwright.missing-await
test('missing-await negative: Promise.all', async ({ page }) => {
  await page.goto('/form');
  await Promise.all([page.click('#a'), page.click('#b')]);
});

// EXPECTED NO FINDING: qadoctor.playwright.missing-await
test('missing-await negative: assigned promise', async ({ page }) => {
  await page.goto('/form');
  const promise = page.click('#submit');
  await promise;
});

// ---------------------------------------------------------------------------
// Treatment-ineligible: non-async enclosing callback/helper.
// ---------------------------------------------------------------------------

function submitWithoutAsync(page: Page) {
  // EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited page.click in non-async helper)
  // EXPECTED NO TREATMENT: non-async enclosing callback/helper
  page.click('#submit');
}

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited page.click via non-async helper)
// EXPECTED NO TREATMENT: non-async enclosing callback/helper
test('missing-await treatment-ineligible: non-async helper', async ({ page }) => {
  await page.goto('/form');
  submitWithoutAsync(page);
});
