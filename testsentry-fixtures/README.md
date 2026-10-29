# TestSentry Main-Repo Regression Fixtures

This directory contains stable, intentional regression fixtures for the recent
TestSentry rules. These are test-data fixtures only:

- Detector semantics are unchanged.
- Treatment providers are unchanged.
- Rule registry behavior is unchanged.
- Built-in rule counts are unchanged (total 19 / Playwright 13 / Selenium 6).
- Intentional bad examples are preserved and must not be converted to best-practice code.

Stale element is NOT a built-in TestSentry detection rule; the scenarios under
`stale-element-evidence.ts` are runtime evidence / provenance data only.

## Structure

| File | Covers |
| --- | --- |
| `playwright/waiter-after-trigger.ts` | qadoctor.playwright.waiter-after-trigger (positives + negatives) |
| `playwright/missing-await.ts` | qadoctor.playwright.missing-await (positives, negatives, Treatment-eligible/ineligible) |
| `playwright/snapshot-assertion.ts` | qadoctor.playwright.snapshot-assertion (positives, negatives, Treatment-eligible/ineligible) |
| `selenium/mixed-wait-strategies.ts` | qadoctor.selenium-java.mixed-wait-strategies (positives + negatives) |
| `selenium/shared-webdriver-lifecycle.ts` | qadoctor.selenium-java.shared-webdriver-lifecycle (positives + negatives) |
| `stale-element-evidence.ts` | stale-element cause classification + provenance enrichment (not a rule) |

## Validation

Typecheck these fixtures:

```bash
npx tsc -p testsentry-fixtures/tsconfig.json --noEmit
```

(TypeScript must be resolvable; if not installed at the repo root, use the
TypeScript binary from `testsentry-playground/node_modules/.bin/tsc`.)

## Notes

- Each case isolates a single concept (one concept per function) with
  `EXPECTED FINDING` / `EXPECTED NO FINDING` / `EXPECTED TREATMENT` /
  `EXPECTED NO TREATMENT` / `EXPECTED EVIDENCE` markers, mirroring the
  convention used by `testsentry-playground` and `selenium-playground`.
- Selenium fixtures are TypeScript pseudo-fixtures representing the Java
  WebDriver patterns; the runnable Selenium fixtures live in
  `selenium-playground/src/test/java/tests/`.
- Pre-existing dirty modifications elsewhere in the repo (notably the four
  `testsentry-playground/tests/*.spec.ts` files) are unrelated local work and
  were preserved.
