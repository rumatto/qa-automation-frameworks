# Selenium Playground

A minimal Maven-based Java 17 + Selenium WebDriver + JUnit 5 project for testing
TestSentry's Selenium Java scanner.

## Structure

- `CleanTest.java` — clean Selenium tests with no intentional issues (stable locators, explicit waits).
- `IntentionalBugsTest.java` — tests containing clearly-marked patterns that TestSentry detects.

## Playground scenarios

### Intentional bugs (IntentionalBugsTest.java)

| Category | Pattern | Finding | Treatment |
|---|---|---|---|
| Fixed timeout | `Thread.sleep(...)` | Fixed Timeout | none |
| Implicit wait | `implicitlyWait(...)` | Implicit Wait | none |
| Exact-ID XPath | `By.xpath("//*[@id='...']")` | Fragile XPath | `By.id(...)` |
| Class-based XPath | `By.xpath("//button[contains(@class, 'submit')]")` | Fragile XPath | none |
| Structural XPath | `By.xpath("//div[3]/ul/li[2]/a")` | Fragile XPath | none |
| Fragile CSS | `By.cssSelector("div.item:nth-child(3)")` | Fragile CSS | none |

### Clean counterparts (CleanTest.java)

- `By.id(...)` — stable ID locators
- `WebDriverWait` with `ExpectedConditions` — explicit condition-based waits
- `By.className(...)`, `By.id(...)` — no brittle selectors

## Build

```bash
./mvnw test-compile
```

## Reset treatment fixtures

After applying TestSentry treatments, restore the intentional-bug baseline:

```bash
./reset-treatments.sh
```

This copies `__baselines__/IntentionalBugsTest.java` over
`src/test/java/tests/IntentionalBugsTest.java` and removes the generated Java
build artifacts (`target/`, `build/`, `.gradle/`, stray `*.class` files) that
TestSentry validation creates while recompiling the fixture.
