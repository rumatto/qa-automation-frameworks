# TestSentry Playground Fixture Manifest

Lightweight record of the intentional TestSentry fixtures in this playground.
These are test-data fixtures only: detector semantics, Treatment providers, rule
registry, and built-in rule counts are unchanged. Intentional bad examples are
preserved and must not be converted to best-practice code.

Stale-element evidence is runtime/provenance data, not a built-in rule.

| Rule | File | Expected findings | Treatment eligibility | Negative cases verified |
| --- | --- | --- | --- | --- |
| qadoctor.playwright.waiter-after-trigger | `tests/waiter-after-trigger.spec.ts` | 3 (click->waitForResponse, click->waitForRequest, click->waitForNavigation) | Detection + Diagnosis only (no Treatment landed yet) | Promise.all synchronization, waiter before trigger, different Page owner, unrelated literal correlation |
| qadoctor.playwright.missing-await | `tests/missing-await.spec.ts` | 3 (unawaited page.click, unawaited Locator action, unawaited Playwright expect) + 1 via non-async helper | Treatment-eligible: standalone unawaited call inside async test; Treatment-ineligible: non-async helper | awaited call, returned call, Promise.all, assigned promise |
| qadoctor.playwright.snapshot-assertion | `tests/snapshot-assertion.spec.ts` | 6 (isVisible, count, inputValue, attribute, title, strict local snapshot, multiline/comment) | Treatment-eligible: direct single-line comment-free assertion; Treatment-ineligible: strict local-variable, multiline/comment-bearing | range count, attribute truthiness, normalized text, reused local snapshot, page.url/textContent |

## Notes

- "Expected findings" are the intended detector outcomes for these fixtures; they have not
  been confirmed by a live TestSentry scan because the TestSentry CLI/distribution is not
  present in this workspace (the `dist-npm` and `src` directories under
  `/private/tmp/testsentry-*` are empty directory stubs).
- Selenium rules and stale-element evidence are represented in the sibling
  `selenium-playground` module (see its manifest).
- Pre-existing dirty modifications in `tests/intentional-bugs.spec.ts`,
  `tests/locator-healing-fixture.spec.ts`, `tests/runtime-healing-fixture.spec.ts`,
  and `tests/unsupported-edge.spec.ts` are unrelated local work and were preserved.
