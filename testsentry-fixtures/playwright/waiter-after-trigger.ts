// TestSentry main-repo regression fixtures: qadoctor.playwright.waiter-after-trigger
//
// Self-contained TypeScript fixtures (no @playwright/test import) so they
// typecheck standalone. `page`/`context` are declared as `any` to represent
// Playwright surface without pulling in the Playwright types.
//
// Intentional TestSentry smells. Do not convert to best-practice code.

declare const page: any;
declare const context: any;

// -------- Positives --------

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForResponse)
export async function clickThenWaitForResponse(): Promise<void> {
  await page.goto('/form');
  await page.click('#submit');
  const response = await page.waitForResponse('**/api/submit');
  return response;
}

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForRequest)
export async function clickThenWaitForRequest(): Promise<void> {
  await page.goto('/form');
  await page.click('#upload');
  const request = await page.waitForRequest('**/api/upload');
  return request;
}

// EXPECTED FINDING: qadoctor.playwright.waiter-after-trigger (click -> waitForNavigation)
export async function clickThenWaitForNavigation(): Promise<void> {
  await page.goto('/app');
  await page.click('a#logout');
  await page.waitForNavigation({ url: '**/login' });
}

// -------- Negatives --------

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger (Promise.all synchronization)
export async function promiseAllSync(): Promise<void> {
  await page.goto('/form');
  await Promise.all([
    page.click('#submit'),
    page.waitForResponse('**/api/submit'),
  ]);
}

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger (waiter before trigger)
export async function waiterBeforeTrigger(): Promise<void> {
  await page.goto('/app');
  const responsePromise = page.waitForResponse('**/api/data');
  await page.click('#load');
  await responsePromise;
}

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger (different Page owner)
export async function differentPageOwner(): Promise<void> {
  await page.goto('/app');
  const other = await context.newPage();
  await other.click('#remote-trigger');
  await page.waitForResponse('**/api/data');
}

// EXPECTED NO FINDING: qadoctor.playwright.waiter-after-trigger (unrelated literal correlation)
export async function unrelatedLiteralCorrelation(): Promise<void> {
  await page.goto('/app');
  await page.click('#button-a');
  await page.waitForResponse('**/api/unrelated-endpoint');
}
