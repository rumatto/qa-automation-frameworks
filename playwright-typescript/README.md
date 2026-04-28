# Playwright (TypeScript)

Small Playwright + TypeScript example framework with:

- Playwright Test as the runner
- Page objects in `pages/`
- Shared fixtures in `utils/fixtures.ts`
- API tests using Playwright request contexts
- Shared JSON schema validation for API responses
- HTML, JUnit, and Allure reporting
- Screenshots, trace, and video for failed or retried runs

## Report links

- Live report: <https://rumatto.github.io/qa-automation-frameworks/playwright-typescript/>
- All reports index: <https://rumatto.github.io/qa-automation-frameworks/>

## Setup

```bash
npm install
npx playwright install chromium
```

Playwright manages its own browser binaries for this framework; there is no ChromeDriver setup here.

## Docker

```bash
docker compose up --build playwright
```

In Compose, this suite points to the shared `test-app` and `test-api` services instead of using its local fallback servers. Those services are also published on the host at `http://localhost:3000/app.html` and `http://localhost:8080`. To inspect them directly, start `docker compose up --build test-app test-api`. Reports are exported under `artifacts/playwright/` from the repo root.

## Common commands

```bash
npm test
npm run test:headed
npm run test:ui
npm run test:dev
npm run test:staging
npm run test:production
npm run test:auth-state
npm run test:demo
```

`npm test` runs with `TEST_ENV=testing` by default.

API examples live in `tests/api.spec.ts`. They use `API_BASE_URL` if provided; otherwise they start the shared local demo API from `demo-services/test-api/server.js`.
Shared response contracts live under `../demo-services/test-api/contracts/` and are validated in the Playwright API tests.

### Shared schema validation

Playwright API tests validate response bodies against the shared JSON schemas in `../demo-services/test-api/contracts/`.

Current contract coverage:

- `user-profile.schema.json` for `GET /api/users/demo`
- `message-accepted.schema.json` for successful `POST /api/messages`
- `error-response.schema.json` for invalid `POST /api/messages`

The validator helper lives in `utils/contracts.ts` and uses `ajv` so the same contract files can be checked locally, in Docker, and in CI.

## Added framework examples

### Authentication state

This framework now includes a dedicated storage-state example in `tests/auth-state.spec.ts`.

What it shows:

- log in once
- save browser storage state to `playwright/.auth/user.json`
- open a fresh browser context
- reuse the saved state without logging in again

How it works:

- the suite runs in `serial` mode so the saved auth file is created before the reuse check runs
- if `resolvedAppUrl` points to a `file:` URL, the test starts `utils/testAppServer.ts` first and serves the shared demo app over localhost
- `beforeAll` removes any stale `playwright/.auth/user.json` file before the flow starts
- the first test logs in with credentials from `utils/runtimeConfig.ts`, verifies the authenticated UI, and writes storage state to `playwright/.auth/user.json`
- the second test creates a brand-new browser context with `storageState: authStatePath` and verifies that the app opens in an already authenticated state
- `afterAll` removes the saved auth file and stops the temporary local app server if one was started

Why the local app server is needed:

- Playwright can save storage state from a `file:` URL, but reusing that state is more predictable when the app is served over HTTP
- the fallback server keeps local non-Docker runs self-contained while still matching the app behavior used in Docker and CI

Run it with:

```bash
npm run test:auth-state
```

Note: the shared demo app now persists login state in local storage so the saved Playwright state is actually reusable across browser contexts.

### Environment wrappers

This framework now uses a small config wrapper in `utils/runtimeConfig.ts` on top of the existing `.env.<TEST_ENV>` loading.

Checked-in environment files:

```bash
.env.testing
.env.staging
.env.production
```

The example test lives in `tests/environment-config.spec.ts` and reads credentials and environment labels from the selected wrapper.

Run the environment examples with:

```bash
npm run test:staging
npm run test:production
```

The checked-in `.env.staging` and `.env.production` files intentionally keep `BASE_URL` empty so the repository stays runnable against the shared demo app. In a real project, those files would normally point to different deployed environments.

## Retry demo for artifacts

This framework includes a dedicated retry example in `tests/demo-rerun.spec.ts`.

How to find the test case:

- file: `playwright-typescript/tests/demo-rerun.spec.ts`
- suite: `Demo retry flow`
- test: `fails once for artifacts and passes on rerun`

The demo test is designed to fail on the first attempt and pass on the retry so the report contains the most useful failure artifacts:

- failure screenshot from the first attempt
- retained video for the failed attempt
- trace captured on the first retry

Run it with:

```bash
npm run test:demo
```

Or run the single test directly:

```bash
npx playwright test tests/demo-rerun.spec.ts --grep "fails once for artifacts and passes on rerun"
```

The behavior is driven by `playwright.config.ts`:

- `retries: process.env.CI ? 1 : 0`
- `trace: 'on-first-retry'`
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`

Inside the demo test, `testInfo.retry === 0` is used to force the first run to fail intentionally. That creates the screenshot and video artifacts before the rerun succeeds.

## How it is organized

- `tests/`: Playwright specs for login, navigation, and form flows
- `pages/`: page objects used by the tests
- `utils/fixtures.ts`: shared `test` object that wires page objects into each test
- `utils/testApiServer.ts`: launcher for the shared local demo API used by the request-based API tests
- `utils/env.ts`: optional `.env.<TEST_ENV>` loading
- `utils/runtimeConfig.ts`: config wrapper for credentials and selected environment metadata
- `utils/globalSetup.ts`: early environment validation hook
- `playwright.config.ts`: retries, workers, reporters, and artifact settings

## Environment behavior

This project can run with no `.env` file. If `BASE_URL` is not provided, it falls back to the shared demo app in `demo-services/test-app/app.html`.

If you want environment-specific config, create files like:

```bash
.env.testing
.env.dev
.env.staging
.env.production
```

and run the matching script, for example:

```bash
npm run test:staging
```

## Reports and artifacts

After a run, Playwright produces:

- HTML report
- `test-results/junit-results.xml`
- `allure-results/` for Allure
- screenshots for failed attempts
- video for failed attempts when retention rules keep it
- trace data on the first retry

To open the Allure report:

```bash
npm run allure:generate
npm run allure:open
```
