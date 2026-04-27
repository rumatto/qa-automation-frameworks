# Playwright (TypeScript)

Small Playwright + TypeScript example framework with:

- Playwright Test as the runner
- Page objects in `pages/`
- Shared fixtures in `utils/fixtures.ts`
- API tests using Playwright request contexts
- HTML, JUnit, and Allure reporting
- Screenshots, trace, and video for failed or retried runs

## Report links

- Live report: <https://rumatto.github.io/qa-automation-frameworks/playwright-typescript/>
- All reports index: <https://rumatto.github.io/qa-automation-frameworks/>

## Setup

```bash
npm install
npx playwright install
```

## Common commands

```bash
npm test
npm run test:headed
npm run test:ui
npm run test:dev
npm run test:demo
```

`npm test` runs with `TEST_ENV=testing` by default.

API examples live in `tests/api.spec.ts`. They use `API_BASE_URL` if provided; otherwise they start a bundled local demo API server automatically.

## How it is organized

- `tests/`: Playwright specs for login, navigation, and form flows
- `pages/`: page objects used by the tests
- `utils/fixtures.ts`: shared `test` object that wires page objects into each test
- `utils/testApiServer.ts`: local demo API used by the request-based API tests
- `utils/env.ts`: optional `.env.<TEST_ENV>` loading
- `utils/globalSetup.ts`: early environment validation hook
- `playwright.config.ts`: retries, workers, reporters, and artifact settings

## Environment behavior

This project can run with no `.env` file. If `BASE_URL` is not provided, it falls back to the bundled demo app.

If you want environment-specific config, create files like:

```bash
.env.testing
.env.dev
.env.demo
```

and run the matching script, for example:

```bash
npm run test:dev
```

## Reports and artifacts

After a run, Playwright produces:

- HTML report
- `test-results/junit-results.xml`
- `allure-results/` for Allure

To open the Allure report:

```bash
npm run allure:generate
npm run allure:open
```
