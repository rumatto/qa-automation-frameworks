# Selenium Playground

A minimal Maven-based Java 17 + Selenium WebDriver + JUnit 5 project for testing
TestSentry's Selenium Java scanner and treatment selection.

## Acceptance coverage

| Category | Pattern | Expected treatment |
|---|---|---|
| Fixed timeout | `Thread.sleep(...)` | manual guidance |
| Implicit wait | `implicitlyWait(...)` | manual guidance |
| Exact ID XPath | `//*[@id='...']` | `By.id(...)` patch |
| Exact name XPath | `//*[@name='...']` | `By.name(...)` patch |
| Exact data-testid XPath | `//*[@data-testid='...']` | stable CSS attribute patch |
| Relative data-* / aria-* XPath | `.//tag[@attr='...']` | scoped CSS patch |
| Relative tag XPath | `.//button` | `By.tagName(...)` patch |
| contains()/structural XPath | unsupported deterministic form | manual guidance |
| nth-child / long structural CSS | fragile CSS | manual guidance |

## Build

```bash
./mvnw test-compile
```

Run the test suite with:

```bash
./mvnw test
```

Chrome runs headless (`--headless=new`) and every WebDriver is closed in an
`@AfterEach` hook, so no Chrome or ChromeDriver process is left behind. The
suite intentionally ends in BUILD FAILURE: the intentional bug cases are
expected to fail.

## Reset treatment fixtures

After applying TestSentry treatments:

```bash
./reset-treatments.sh
```

This restores `IntentionalBugsTest.java` from `__baselines__` and removes
generated Java build artifacts.
