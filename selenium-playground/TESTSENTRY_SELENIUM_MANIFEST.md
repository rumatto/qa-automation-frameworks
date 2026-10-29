# TestSentry Selenium Playground Fixture Manifest

Lightweight record of the intentional TestSentry fixtures in this playground.
These are test-data fixtures only: detector semantics, Treatment providers, rule
registry, and built-in rule counts are unchanged. Intentional bad examples are
preserved and must not be converted to best-practice code.

Stale element is NOT a built-in TestSentry detection rule; the scenarios below
are runtime evidence / provenance data only.

| Rule / Evidence | File | Expected findings | Treatment eligibility | Negative cases verified |
| --- | --- | --- | --- | --- |
| qadoctor.selenium-java.mixed-wait-strategies | `src/test/java/tests/MixedWaitStrategiesTest.java` | 3 (implicit+WebDriverWait, implicit+FluentWait, setup implicit + test explicit) | Diagnosis / manual (no Treatment in current main) | implicit only, explicit only, zero reset before explicit, different drivers |
| qadoctor.selenium-java.shared-webdriver-lifecycle | `src/test/java/tests/SharedWebDriverLifecycleTest.java` | 4 (static WebDriver, static ChromeDriver, static RemoteWebDriver, static driver in setup) | Diagnosis / manual (no Treatment in current main) | instance driver, local driver, static non-driver field, framework-managed/proxy placeholder |
| stale-element: cause classification | `src/test/java/tests/StaleElementProvenanceTest.java` | runtime evidence only (not a built-in rule) | N/A — not a rule | N/A |
| stale-element: provenance enrichment | `src/test/java/tests/StaleElementProvenanceTest.java` | runtime evidence only (not a built-in rule) | N/A — not a rule | capture + reuse without navigation, reassigned element, @FindBy field (unavailable) |

## Stale-element evidence scenarios

| Scenario | Capture location | Invalidation boundary | Reuse location | Provenance |
| --- | --- | --- | --- | --- |
| capture + refresh + reuse | `driver.findElement(By.id("save"))` | `driver.navigate().refresh()` | `save.click()` | stale-element cause |
| capture + reuse, no navigation | `driver.findElement(By.id("save"))` | none explicit | `save.click()` | incomplete |
| reassigned element | `driver.findElement(By.id("save"))` (reassigned) | none | `save.click()` | superseded capture |
| @FindBy field | page-object `@FindBy` field | n/a | `findBySave.click()` | unavailable (intentionally unresolved) |

## Build

Compile only (tests are not executed against a live browser):

```bash
./mvnw test-compile
```

## Notes

- "Expected findings" are the intended detector outcomes for these fixtures; they have not
  been confirmed by a live TestSentry scan because the TestSentry CLI/distribution is not
  present in this workspace.
- ChromeDriver is referenced only so the source patterns compile; no browser is launched
  by these fixtures and `./mvnw test` is not run (the existing suite intentionally ends in
  BUILD FAILURE for intentional bugs).
- Pre-existing dirty modifications in `testsentry-playground/tests/*.spec.ts` are unrelated
  local work in the sibling module and were preserved.
