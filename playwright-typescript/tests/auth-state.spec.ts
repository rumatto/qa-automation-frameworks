import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { allure } from 'allure-playwright';
import { resolvedAppUrl } from '../utils/appUrl';
import { runtimeConfig } from '../utils/runtimeConfig';
import { startTestAppServer } from '../utils/testAppServer';

const authStatePath = path.resolve(__dirname, '../playwright/.auth/user.json');
let appUrl = resolvedAppUrl;
let closeTestAppServer: (() => Promise<void>) | undefined;

test.describe('Authentication state', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    if (resolvedAppUrl.startsWith('file:')) {
      const appServer = await startTestAppServer();
      appUrl = appServer.url;
      closeTestAppServer = appServer.close;
    }

    await fs.rm(authStatePath, { force: true });
  });

  test.afterAll(async () => {
    await fs.rm(authStatePath, { force: true });
    if (closeTestAppServer) {
      await closeTestAppServer();
    }
  });

  test('save storage state after login', async ({ page }) => {
    await allure.feature('Authentication');
    await allure.story('Persist storage state');

    await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
    await page.getByTestId('username').fill(runtimeConfig.credentials.username);
    await page.getByTestId('password').fill(runtimeConfig.credentials.password);
    await page.getByTestId('login-btn').click();


    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('whoami')).toHaveText(runtimeConfig.credentials.username);

    await fs.mkdir(path.dirname(authStatePath), { recursive: true });
    await page.context().storageState({ path: authStatePath });

    const savedState = await fs.readFile(authStatePath, 'utf8');
    expect(savedState.length).toBeGreaterThan(0);
  });

  test('reuse saved storage state without logging in again', async ({ browser }) => {
    await allure.feature('Authentication');
    await allure.story('Reuse storage state');

    const context = await browser.newContext({ storageState: authStatePath });
    const page = await context.newPage();

    try {
      await page.goto(appUrl, { waitUntil: 'domcontentloaded' });

      await expect(page.getByTestId('nav-home')).toBeVisible();
      await expect(page.getByTestId('welcome')).toContainText('Welcome');
      await expect(page.getByTestId('whoami')).toHaveText(runtimeConfig.credentials.username);
      await expect(page.getByTestId('username')).toBeHidden();
    } finally {
      await context.close();
    }
  });
});
