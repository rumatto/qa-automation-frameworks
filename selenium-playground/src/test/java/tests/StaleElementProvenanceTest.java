package tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.FindBy;

/**
 * Compile-only TestSentry fixtures: stale-element runtime evidence / provenance.
 *
 * Stale element is NOT a built-in TestSentry detection rule. These fixtures
 * provide synthetic evidence for stale-element cause classification and
 * provenance enrichment:
 *
 *   cause "stale-element"       <- StaleElementReferenceException
 *   capture location            <- driver.findElement(...)
 *   invalidation boundary       <- driver.navigate().refresh() (where explicit)
 *   reuse location              <- save.click()
 *   unavailable provenance      <- proxy / @FindBy field / cross-method cases
 *
 * No new stale analysis logic is added. These fixtures may be compile-only
 * (no real browser is launched).
 */
// Intentional TestSentry fixture: stale element provenance scenarios
class StaleElementProvenanceTest {

  // EXPECTED EVIDENCE: stale-element (cause classification)
  //   capture location: driver.findElement(By.id("save"))
  //   invalidation boundary: driver.navigate().refresh()
  //   reuse location: save.click()
  @Test
  void captureRefreshReuse() {
    WebDriver driver = null; // compile-only fixture
    WebElement save = driver.findElement(By.id("save"));
    driver.navigate().refresh();
    save.click();
  }

  // EXPECTED EVIDENCE: stale-element provenance (capture + reuse without explicit navigation)
  //   capture location: driver.findElement(By.id("save"))
  //   reuse location: save.click()
  //   invalidation boundary: none explicit -> provenance incomplete
  @Test
  void captureReuseWithoutExplicitNavigation() {
    WebDriver driver = null; // compile-only fixture
    WebElement save = driver.findElement(By.id("save"));
    save.click();
  }

  // EXPECTED EVIDENCE: stale-element provenance (reassigned element)
  //   first capture superseded by reassignment before reuse
  @Test
  void reassignedElement() {
    WebDriver driver = null; // compile-only fixture
    WebElement save = driver.findElement(By.id("save"));
    save = driver.findElement(By.id("save")); // reassigned: new capture
    save.click();
  }

  // EXPECTED EVIDENCE: stale-element provenance unavailable (@FindBy field / cross-method)
  //   @FindBy page-object field: provenance should intentionally not resolve
  @FindBy(id = "save")
  private WebElement findBySave;

  @Test
  void findByFieldCase() {
    findBySave.click(); // @FindBy field: provenance unavailable
  }
}
