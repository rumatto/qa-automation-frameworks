// TestSentry main-repo regression fixtures: qadoctor.playwright.snapshot-assertion
//
// Self-contained TypeScript fixtures (no @playwright/test import).
//
// Treatment-eligible: direct single-line comment-free assertion.
// Treatment-ineligible: strict local-variable snapshot, multiline / comment-bearing case.
//
// Intentional TestSentry smells. Do not convert to best-practice code.

declare const page: any;

// -------- Positives --------

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (isVisible -> toBe(true))
// EXPECTED TREATMENT: patch to Playwright matcher
export function isVisibleToBeTrue(): void {
  expect(page.locator('#banner').isVisible()).toBe(true);
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (count -> exact equality)
// EXPECTED TREATMENT: patch to toHaveCount
export function countExactEquality(): void {
  expect(page.locator('.item').count()).toBe(3);
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (inputValue -> toBe)
// EXPECTED TREATMENT: patch to toHaveValue
export function inputValueToBe(): void {
  expect(page.locator('#name').inputValue()).toBe('alice');
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (attribute -> toBe)
// EXPECTED TREATMENT: patch to toHaveAttribute
export function attributeToBe(): void {
  expect(page.locator('#btn').getAttribute('disabled')).toBe('');
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (title -> toBe)
// EXPECTED TREATMENT: patch to toHaveTitle
export function titleToBe(): void {
  expect(page.title()).toBe('Home');
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (strict local-variable snapshot)
// EXPECTED NO TREATMENT: local variable, manual / Diagnosis-only
export function strictLocalVariableSnapshot(): void {
  const snapshot = page.locator('#banner').isVisible();
  expect(snapshot).toBe(true);
}

// EXPECTED FINDING: qadoctor.playwright.snapshot-assertion (multiline / comment-bearing)
// EXPECTED NO TREATMENT: multiline / comment-bearing assertion
export async function multilineCommentBearing(): Promise<void> {
  await page.goto('/app');
  // The banner must be visible after the redirect; snapshot the visibility.
  expect(
    page.locator('#banner').isVisible(),
  ).toBe(true);
}

// -------- Negatives --------

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion (range count)
export async function rangeCount(): Promise<void> {
  expect(await page.locator('.item').count()).toBeGreaterThan(0);
}

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion (attribute truthiness)
export async function attributeTruthiness(): Promise<void> {
  expect(await page.locator('#chk').getAttribute('aria-checked')).toBeTruthy();
}

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion (normalized text)
export async function normalizedText(): Promise<void> {
  expect(await page.locator('#msg').textContent()).toContain('success');
}

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion (reused local snapshot)
export async function reusedLocalSnapshot(): Promise<void> {
  const snapshot = page.locator('#banner').isVisible();
  await expect(snapshot).resolves.toBe(true);
}

// EXPECTED NO FINDING: qadoctor.playwright.snapshot-assertion (page.url / textContent unsupported)
export async function pageUrlTextContentUnsupported(): Promise<void> {
  expect(await page.url()).toContain('/app');
  await expect(await page.locator('#msg').textContent()).toBe('hello');
}

// `expect`/`await` top-level support: declared for standalone typecheck.
declare function expect(value: any): any;
