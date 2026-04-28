# QA Automation Framework Portfolio

This monorepo showcases production-style QA automation frameworks across multiple stacks. The goal is not just to run tests, but to demonstrate framework design, maintainability, reporting, and CI/CD patterns that map to real QA engineering work.

## What problem this solves

Modern QA teams rarely work in one tool only. This repository shows how the same automation mindset can be applied across:

- Selenium WebDriver for browser-based regression coverage
- Java, Python, and TypeScript implementation styles
- UI and API automation patterns
- Reporting and CI publishing workflows

If you are reviewing this as a hiring manager or recruiter, the strongest end-to-end example is the Java framework:

- [Selenium Java framework README](selenium-java/README.md)
- Live report: <https://rumatto.github.io/qa-automation-frameworks/selenium-java/>

## Featured Example

### QA Automation Framework (Selenium + Java + JUnit 5)

This project demonstrates a scalable test automation framework using:

- Selenium WebDriver
- Java 17
- JUnit 5
- RestAssured
- Allure reporting
- Page Object Model (POM)

### Why this project?

Built to simulate a real-world QA automation setup used in production teams:

- reusable page objects instead of hard-coded selectors in tests
- separated UI and API suites for targeted execution
- config-driven runtime with environment overrides
- CI pipeline that publishes test reports automatically
- failure diagnostics through screenshots and Allure artifacts

![Selenium Java Allure report](docs/assets/selenium-java-allure-report.png)

## Frameworks

| Framework | Stack | What it demonstrates | Docs | Latest report |
| --- | --- | --- | --- | --- |
| Playwright | TypeScript | modern web E2E + API testing, retry artifacts | [playwright-typescript/README.md](playwright-typescript/README.md) | <https://rumatto.github.io/qa-automation-frameworks/playwright-typescript/> |
| Selenium | Python | Python-based browser automation | [selenium-python/README.md](selenium-python/README.md) | <https://rumatto.github.io/qa-automation-frameworks/selenium-python/> |
| Selenium | Java | UI + API framework design, reporting, CI/CD | [selenium-java/README.md](selenium-java/README.md) | <https://rumatto.github.io/qa-automation-frameworks/selenium-java/> |

Main report index: <https://rumatto.github.io/qa-automation-frameworks/>

## How to run

Each framework is intentionally independent. Install and run dependencies inside the relevant subfolder only.

### Selenium Java

```bash
cd selenium-java
./gradlew test
./gradlew uiTest
./gradlew apiTest
```

ChromeDriver is resolved automatically with Bonigarcia `WebDriverManager`.

### Selenium Python

```bash
cd selenium-python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

ChromeDriver is resolved automatically with `webdriver-manager`.

### Playwright TypeScript

```bash
cd playwright-typescript
npm install
npx playwright install chromium
npx playwright test
```

Playwright manages its own Chromium binary directly, so there is no separate driver setup.

For the retry demo that fails once to generate screenshot, video, and retry trace artifacts:

```bash
cd playwright-typescript
npm run test:demo
```

## Local Docker Setup

Each framework now includes its own `Dockerfile`, and the repo root provides a shared `compose.yml`.

### Prerequisites

Install a local Docker runtime with Compose support:

- Docker Desktop, or
- Docker Engine + `docker compose` plugin

Verify the setup from the repo root:

```bash
docker --version
docker compose version
```

### Shared demo environment

When run through Compose, the frameworks target shared demo services:

- `test-app` serves the demo UI at `http://test-app/app.html`
- `test-api` serves the demo API at `http://test-api:8080`

The shared demo sources live under `demo-services/` and are reused by local fallback runs as well as Docker.

They are also published on the host for inspection during local Docker runs:

- `http://localhost:3000/app.html`
- `http://localhost:8080/api/health`
- `http://localhost:8080/api/users/demo`

Start the shared demo services for browser or API inspection:

```bash
docker compose up --build test-app test-api
```

### Run the full stack

Build and run every framework:

```bash
docker compose up --build
```

### Run one framework

Run one framework while Compose starts any required shared services automatically:

```bash
docker compose up --build playwright
docker compose up --build selenium-python
docker compose up --build selenium-java
```

### View artifacts

Container outputs are exported under `artifacts/` so reports and screenshots remain available after the containers exit.

Main artifact folders:

- `artifacts/playwright/`
- `artifacts/selenium-python/`
- `artifacts/selenium-java/`

For `selenium-java`, the main exported folders are:

- `artifacts/selenium-java/test-results/`
- `artifacts/selenium-java/allure-results/`
- `artifacts/selenium-java/allure-report/`

### Stop containers

Stop the running services and remove the containers:

```bash
docker compose down
```

Rebuild from scratch when you need fresh containers:

```bash
docker compose up --build --force-recreate
```

## Recruiter Keywords

- Selenium WebDriver
- JUnit 5
- Test automation framework design
- Page Object Model
- API testing with RestAssured
- Allure reporting
- GitHub Actions CI/CD
- Regression test automation

## License

This repository is proprietary and not open for unauthorized use.

See [LICENSE](LICENSE) for the full terms.
