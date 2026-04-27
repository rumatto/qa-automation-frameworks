import { request as playwrightRequest, test as base, expect, type APIRequestContext } from '@playwright/test';
import { allure } from 'allure-playwright';
import { resolvedAppUrl } from './appUrl';
import { LoginPage } from '../pages/LoginPage';
import { AppShellPage } from '../pages/AppShellPage';
import { HomePage } from '../pages/HomePage';
import { SettingsPage } from '../pages/SettingsPage';
import { FormPage } from '../pages/FormPage';
import { startTestApiServer } from './testApiServer';

type ApiFixtures = {
  apiRequest: APIRequestContext;
};

type ApiWorkerFixtures = {
  apiBaseUrl: string;
};

type Pages = {
  loginPage: LoginPage;
  appShell: AppShellPage;
  homePage: HomePage;
  settingsPage: SettingsPage;
  formPage: FormPage;
};

const apiBaseUrlFixture: [
  ({}, use: (url: string) => Promise<void>) => Promise<void>,
  { scope: 'worker' }
] = [async ({}, use: (url: string) => Promise<void>) => {
  const configuredUrl = process.env.API_BASE_URL;
  if (configuredUrl) {
    await use(configuredUrl);
    return;
  }

  const server = await startTestApiServer();
  try {
    await use(server.url);
  } finally {
    await server.close();
  }
}, { scope: 'worker' }];

const apiFixtures = {
  apiBaseUrl: apiBaseUrlFixture,
  apiRequest: async ({ apiBaseUrl }: ApiWorkerFixtures, use: (context: APIRequestContext) => Promise<void>) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        accept: 'application/json',
        'content-type': 'application/json'
      }
    });

    try {
      await use(apiContext);
    } finally {
      await apiContext.dispose();
    }
  }
};

export const apiTest = base.extend<ApiFixtures, ApiWorkerFixtures>(apiFixtures);

export const test = apiTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  appShell: async ({ page }, use) => {
    await use(new AppShellPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  formPage: async ({ page }, use) => {
    await use(new FormPage(page));
  }
});

export { expect };

test.beforeEach(async ({ page }, testInfo) => {
  // On some cold starts, the page can transiently render blank; retrying the navigation
  // is faster and more reliable than letting the whole test hit its timeout.
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(resolvedAppUrl, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('username').waitFor({ timeout: 5_000 });
      lastErr = undefined;
      break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (lastErr) throw lastErr;

  // Make the Allure report easier to scan.
  await allure.epic('Playwright TypeScript Framework');
  await allure.suite(testInfo.file.split('/').pop() ?? 'tests');
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const png = await page.screenshot({ fullPage: true });
    await allure.attachment('failure-screenshot', png, 'image/png');
  }
});
