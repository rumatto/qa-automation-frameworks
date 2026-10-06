import { expect, test } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

// Playwright Tips tutorial evidence tests.
// These exercise the real Acme Portal demo app (utils/app.html) to produce
// genuine execution artifacts for Tutorial Pilot #1 scenes R1-R5.

const VALID_CREDENTIALS = { username: 'demo', password: 'secret' };

test.describe('Tutorial evidence: flaky test execution (R1)', () => {
  test.describe.configure({ retries: 1 });

  test('fails once for first attempt, passes on rerun', async ({ page }, testInfo) => {
    // Demonstrates the pass-local/fail-rerun/pass-again flaky loop.
    // First attempt intentionally fails to produce trace/screenshot artifacts.
    await page.goto('');
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByTestId('login-btn').click();

    if (testInfo.retry === 0) {
      // Artificial failure on first run to expose flakiness pattern.
      await expect(page.getByTestId('whoami'), 'intentional first-attempt failure').toBeHidden();
    }

    await expect(page.getByTestId('whoami')).toHaveText(VALID_CREDENTIALS.username);
  });
});

test.describe('Tutorial evidence: fixed wait before/after (R2)', () => {
  test('fixed wait vs web-first assertion', async ({ page }) => {
    await page.goto('');
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByTestId('login-btn').click();

    // BEFORE (bad): sleep instead of asserting
    // await page.waitForTimeout(3000);

    // AFTER (fix): web-first assertion that retries
    await expect(page.getByTestId('whoami')).toHaveText(VALID_CREDENTIALS.username);
  });
});

test.describe('Tutorial evidence: state check vs assertion (R3)', () => {
  test('isVisible snapshot vs expect retry', async ({ page }) => {
    await page.goto('');

    // BEFORE (bad): single snapshot, no retry
    const visible = await page.isVisible('[data-testid="login-btn"]');
    expect(visible).toBe(true);

    // AFTER (fix): web-first assertion with retry
    await expect(page.getByTestId('login-btn')).toBeVisible();
  });
});

test.describe('Tutorial evidence: retries hide evidence (R4)', () => {
  test.describe.configure({ retries: 2 });

  test('flaky login test that passes on retry', async ({ page }, testInfo) => {
    await page.goto('');
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByTestId('login-btn').click();

    if (testInfo.retry === 0) {
      // Fail first attempt to generate trace on retry.
      await expect(page.getByTestId('app-title')).toHaveText('Wrong Title');
    }

    await expect(page.getByTestId('app-title')).toHaveText('Acme Portal');
    await expect(page.getByTestId('whoami')).toHaveText(VALID_CREDENTIALS.username);
  });
});

test.describe('Tutorial evidence: storageState login-once (R5)', () => {
  let storageStatePath: string;

  test('login once and save authenticated state', async ({ page, context }, testInfo) => {
    storageStatePath = testInfo.outputPath('user-auth.json');
    await page.goto('');
    await page.getByLabel('Username').fill(VALID_CREDENTIALS.username);
    await page.getByLabel('Password').fill(VALID_CREDENTIALS.password);
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('whoami')).toHaveText(VALID_CREDENTIALS.username);

    // Save authenticated state for reuse (real artifact).
    await context.storageState({ path: storageStatePath });

    // Verify the auth state file was actually written.
    expect(fs.existsSync(storageStatePath)).toBe(true);
    const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
    expect(state).toHaveProperty('origins');
  });

  test('storageState config demonstrates setup project pattern', async () => {
    // Verifies the .gitignore configuration that protects auth state files.
    const gitignorePath = path.resolve(__dirname, '..', '.gitignore');
    const gitignoreContent = fs.existsSync(gitignorePath)
      ? fs.readFileSync(gitignorePath, 'utf-8')
      : '';
    expect(gitignoreContent).toContain('.auth');
  });
});
