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

### Selenium Python

```bash
cd selenium-python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

### Playwright TypeScript

```bash
cd playwright-typescript
npm install
npx playwright install
npx playwright test
```

For the retry demo that fails once to generate screenshot, video, and retry trace artifacts:

```bash
cd playwright-typescript
npm run test:demo
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
