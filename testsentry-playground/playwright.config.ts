import { defineConfig, devices } from '@playwright/test';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

// Serve the Acme Portal app via HTTP so storageState cookies work for R5.
// The app is a static HTML file at utils/app.html.
const appUrl = 'http://127.0.0.1:8765/utils/app.html';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }]
  ],
  use: {
    baseURL: appUrl,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
    viewport: { width: 1280, height: 720 },
  },
});
