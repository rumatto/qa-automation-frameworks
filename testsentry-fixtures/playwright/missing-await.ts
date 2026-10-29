// TestSentry main-repo regression fixtures: qadoctor.playwright.missing-await
//
// Self-contained TypeScript fixtures (no @playwright/test import).
//
// Treatment-eligible: standalone unawaited call inside an already async test.
// Treatment-ineligible: non-async enclosing callback/helper.
//
// Intentional TestSentry smells. Do not convert to best-practice code.

declare const page: any;

// -------- Treatment-eligible positives --------

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited page.click)
// EXPECTED TREATMENT: patch with await
export async function unawaitedPageClick(): Promise<void> {
  await page.goto('/form');
  page.click('#submit'); // unawaited
  return page.locator('#msg');
}

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited locator action)
// EXPECTED TREATMENT: patch with await
export async function unawaitedLocatorAction(): Promise<void> {
  await page.goto('/form');
  page.locator('#submit').click(); // unawaited
}

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited Playwright expect)
// EXPECTED TREATMENT: patch with await
export async function unawaitedExpect(): Promise<void> {
  await page.goto('/app');
  return expect(page.locator('#banner')).toBeVisible();
}

// -------- Negatives --------

// EXPECTED NO FINDING: qadoctor.playwright.missing-await (awaited call)
export async function awaitedCall(): Promise<void> {
  await page.goto('/form');
  await page.click('#submit');
}

// EXPECTED NO FINDING: qadoctor.playwright.missing-await (returned call)
export async function returnedCall(): Promise<void> {
  await page.goto('/form');
  return page.click('#submit');
}

// EXPECTED NO FINDING: qadoctor.playwright.missing-await (Promise.all)
export async function promiseAll(): Promise<void> {
  await page.goto('/form');
  await Promise.all([page.click('#a'), page.click('#b')]);
}

// EXPECTED NO FINDING: qadoctor.playwright.missing-await (assigned promise)
export async function assignedPromise(): Promise<void> {
  await page.goto('/form');
  const promise = page.click('#submit');
  await promise;
}

// -------- Treatment-ineligible: non-async helper --------

// EXPECTED FINDING: qadoctor.playwright.missing-await (unawaited page.click in non-async helper)
// EXPECTED NO TREATMENT: non-async enclosing callback/helper
export function submitWithoutAsync(pageArg: any): void {
  pageArg.click('#submit');
}

// EXPECTED FINDING: qadoctor.playwright.missing-await (via non-async helper)
// EXPECTED NO TREATMENT: non-async enclosing callback/helper
export async function viaNonAsyncHelper(): Promise<void> {
  await page.goto('/form');
  submitWithoutAsync(page);
}

// `expect` is provided by the test runner; declare it for standalone typecheck.
declare function expect(value: any): any;
