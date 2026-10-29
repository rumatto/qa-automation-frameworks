import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Intentional TestSentry fixtures: qadoctor.playwright.waiter-after-trigger
//
// A navigation-triggering action (click, etc.) is performed and only
// afterwards is a response/request/navigation waiter registered. The waiter
// can then miss the already in-flight response. The stable pattern is to
// register the waiter before (or alongside) the trigger, e.g.
// Promise.all([click, waitForResponse(...)]).
//
// These fixtures are intentional TestSentry smells. Do not convert them to
// best-practice code.
// ---------------------------------------------------------------------------

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForResponse)
// EXPECTED TREATMENT: none (Detection + Diagnosis)
test('waiter-after-trigger: click then waitForResponse', async ({ page }) => {
  await page.goto('/form');
  await page.click('#submit');
  const response = await page.waitForResponse('**/api/submit');
  expect(response).toBeDefined();
});

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForRequest)
// EXPECTED TREATMENT: none (Detection + Diagnosis)
test('waiter-after-trigger: click then waitForRequest', async ({ page }) => {
  await page.goto('/form');
  await page.click('#upload');
  const request = await page.waitForRequest('**/api/upload');
  expect(request).toBeDefined();
});

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForNavigation)
// EXPECTED TREATMENT: none (Detection + Diagnosis)
test('waiter-after-trigger: click then waitForNavigation', async ({ page }) => {
  await page.goto('/app');
  await page.click('a#logout');
  await page.waitForNavigation({ url: '**/login' });
});

// ---------------------------------------------------------------------------
// Negatives — should NOT produce waiter-after-trigger findings.
// ---------------------------------------------------------------------------

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger
test('waiter-after-trigger negative: Promise.all synchronization', async ({ page }) => {
  await page.goto('/form');
  await Promise.all([
    page.click('#submit'),
    page.waitForResponse('**/api/submit'),
  ]);
});

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger
test('waiter-after-trigger negative: waiter registered before trigger', async ({ page }) => {
  await page.goto('/app');
  const responsePromise = page.waitForResponse('**/api/data');
  await page.click('#load');
  await responsePromise;
});

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger
test('waiter-after-trigger negative: different Page owner', async ({ page, context }) => {
  await page.goto('/app');
  const other = await context.newPage();
  await other.click('#remote-trigger');
  await page.waitForResponse('**/api/data');
});

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger
test('waiter-after-trigger negative: unrelated literal correlation', async ({ page }) => {
  await page.goto('/app');
  await page.click('#button-a');
  await page.waitForResponse('**/api/unrelated-endpoint');
});
