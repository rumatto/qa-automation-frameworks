// TestSentry main-repo regression fixtures: stale-element runtime evidence / provenance
//
// Stale element is NOT a built-in TestSentry detection rule. These fixtures
// provide synthetic evidence for stale-element cause classification and
// provenance enrichment.
//
// Intentional TestSentry smells / evidence. Do not convert to best-practice code.

declare const driver: any;
declare const By: any;

// -------- Stale-element evidence: capture -> invalidate -> reuse --------

// EXPECTED EVIDENCE: stale-element cause "stale-element" (StaleElementReferenceException)
//   capture location: driver.findElement(By.id("save"))
//   invalidation boundary: driver.navigate().refresh()
//   reuse location: save.click()
export function captureRefreshReuse(): void {
  const save = driver.findElement(By.id('save'));
  driver.navigate().refresh();
  save.click();
}

// -------- Stale-element evidence: capture + reuse without explicit navigation --------

// EXPECTED EVIDENCE: stale-element provenance incomplete (no explicit invalidation boundary)
//   capture location: driver.findElement(By.id("save"))
//   reuse location: save.click()
export function captureReuseWithoutExplicitNavigation(): void {
  const save = driver.findElement(By.id('save'));
  save.click();
}

// -------- Stale-element evidence: reassigned element --------

// EXPECTED EVIDENCE: stale-element provenance (reassigned element supersedes first capture)
//   first capture: driver.findElement(By.id("save"))
//   reassignment: save = driver.findElement(By.id("save"))
//   reuse location: save.click()
export function reassignedElement(): void {
  let save = driver.findElement(By.id('save'));
  save = driver.findElement(By.id('save'));
  save.click();
}

// -------- Stale-element evidence: unavailable provenance (@FindBy field / cross-method) --------

// EXPECTED EVIDENCE: stale-element provenance unavailable (@FindBy field intentionally unresolved)
export class SavePage {
  // @FindBy(id = "save") field: provenance should intentionally not resolve
  public save: any = null;
}

export function findByFieldCase(): void {
  const page = new SavePage();
  page.save.click(); // @FindBy field: provenance unavailable
}
