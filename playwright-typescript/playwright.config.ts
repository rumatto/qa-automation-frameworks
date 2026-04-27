import { defineConfig } from '@playwright/test';
import { resolvedAppUrl } from './utils/appUrl';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }]
  ],
  use: {
    baseURL: resolvedAppUrl,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  globalSetup: './utils/globalSetup.ts'
});
