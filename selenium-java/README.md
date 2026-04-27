# QA Automation Framework (Selenium + Java + JUnit 5)

This project demonstrates a scalable QA automation framework for browser and API regression testing using:

- Selenium WebDriver
- Java 17
- JUnit 5
- RestAssured
- Allure reporting
- Page Object Model (POM)

## What problem does this solve?

The framework covers stable, repeatable regression checks that teams do not want to execute manually every release:

- login validation
- navigation between core pages
- form submission and validation behavior
- API request and response validation

The project is designed to show how UI and API automation can live in one maintainable codebase while still being runnable independently.

## Key Features

- Modular and reusable test structure
- Page Object Model implementation
- Config-driven test execution with `BASE_URL` and `API_BASE_URL`
- Separate UI and API suites using JUnit tags and Gradle tasks
- Allure reporting with screenshot capture on UI failures
- Bundled demo app and local API server so the framework can run without external dependencies
- GitHub Actions pipeline that publishes live reports to GitHub Pages

## Why this project?

Built to simulate a real-world QA automation setup used in production teams.

The design favors maintainability over quick scripting:

- page objects isolate selectors and browser actions from assertions
- shared base classes keep setup consistent and reduce duplication
- environment-aware URL handling makes the same suite usable locally and in CI
- tagged execution supports faster feedback when only UI or API coverage is needed
- reporting and screenshots make failures easier to debug remotely

## Tech Stack

- `Selenium WebDriver` for browser automation
- `Java 17` with Gradle wrapper for reproducible execution
- `JUnit 5` for test structure, tagging, and assertions
- `RestAssured` for API testing
- `Allure` for reporting and test artifacts
- `GitHub Actions` for CI/CD

Note: this implementation uses `JUnit 5`, not `TestNG`. The framework structure is still aligned with patterns recruiters search for in enterprise QA work: suite separation, page objects, reusable fixtures, reporting, and CI integration.

## Test Strategy

Automation is used here for high-value, repeatable checks that benefit from fast regression feedback:

- UI automation verifies critical user journeys and form behavior
- API automation validates service responses and payload rules
- tagged test execution keeps feedback targeted during development and CI

Manual or exploratory testing would still be useful for:

- visual polish and UX review
- accessibility deep dives
- performance and load validation
- cross-browser edge cases beyond the current smoke/regression scope

## Folder Structure

```text
selenium-java/
├── build.gradle
├── gradlew
├── src/test/java/frameworks/seleniumjava/
│   ├── pages/              # Page Object Model classes
│   ├── tests/              # Selenium UI tests and shared BaseTest
│   ├── tests/api/          # RestAssured API tests and BaseApiTest
│   └── utils/              # Demo app URLs, credentials, local test servers
└── src/test/resources/
    └── app.html            # Bundled demo app under test
```

### What lives where

- `pages/` contains reusable browser interaction layers
- `tests/` contains scenario-level UI assertions
- `tests/api/` contains API scenarios separated from browser concerns
- `utils/` contains environment helpers and local demo infrastructure
- `build.gradle` defines dependencies, JUnit tags, Allure, and reporting tasks

## Demo and Reports

- Live Allure report: <https://rumatto.github.io/qa-automation-frameworks/selenium-java/>
- All reports index: <https://rumatto.github.io/qa-automation-frameworks/>

Current local run result:

- `8/8 tests passed`
- `5 test classes`
- coverage across both UI and API flows

Example execution output:

```text
FormTest > invalidFormShowsValidationError() PASSED
FormTest > submitFormSuccessfully() PASSED
LoginTest > invalidLoginShowsError() PASSED
LoginTest > validLogin() PASSED
NavigationTest > navigateBetweenSections() PASSED
MessageApiTest > rejectInvalidMessagePayload() PASSED
MessageApiTest > submitMessageSuccessfully() PASSED
UserApiTest > fetchDemoUserProfile() PASSED
```

Report screenshot:

![Allure report overview](../docs/assets/selenium-java-allure-report.png)

## How to run

Run the full suite:

```bash
./gradlew test
```

Run against a custom UI environment:

```bash
BASE_URL=http://127.0.0.1:3000/app.html ./gradlew test
```

Run only UI tests:

```bash
./gradlew uiTest
```

Run only API tests:

```bash
./gradlew apiTest
API_BASE_URL=http://127.0.0.1:8080 ./gradlew apiTest
```

Generate and open Allure reports:

```bash
./gradlew test
./gradlew allureReport
./gradlew allureServe
```

## CI/CD

The repository includes a dedicated GitHub Actions workflow at `.github/workflows/selenium-java.yml`.

It currently:

- runs on push, pull request, and manual dispatch
- sets up Java 17 and Gradle
- executes the test suite in CI
- generates Allure artifacts
- publishes the latest report to GitHub Pages

This keeps the framework useful as both a local regression suite and a lightweight CI quality gate.

## Environment Behavior

This project can run with no environment variables.

- If `BASE_URL` is not provided, the suite falls back to the bundled demo app in `src/test/resources/app.html`.
- If `API_BASE_URL` is not provided, the API tests start the bundled local API server automatically.
- On macOS, the checked-in `gradlew` script prefers Java 17 automatically when `JAVA_HOME` is unset.

## Recruiter Keywords

- Selenium WebDriver
- Java automation framework
- JUnit 5
- Page Object Model
- API testing with RestAssured
- Test automation framework design
- Allure reporting
- CI/CD with GitHub Actions
