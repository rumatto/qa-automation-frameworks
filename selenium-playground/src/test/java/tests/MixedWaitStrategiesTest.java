package tests;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Compile-only TestSentry fixtures: qadoctor.selenium-java.mixed-wait-strategies.
 *
 * These fixtures represent intentional implicit + explicit wait mixing on the
 * same driver for TestSentry scanning. They are compile-only: no real browser
 * is launched and no test is executed against a live page. `WebDriver driver =
 * null` is used purely so the source patterns compile without a live driver.
 *
 * Detector semantics, Treatment providers, rule registry, and built-in counts
 * are unchanged. Intentional bad examples are preserved.
 */
// Intentional TestSentry fixture: mixed implicit/explicit waits
class MixedWaitStrategiesTest {

  // -------- Positives --------

  // EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (non-zero implicitlyWait + WebDriverWait on same driver)
  // EXPECTED TREATMENT: none
  @Test
  void implicitWaitPlusWebDriverWaitSameDriver() {
    WebDriver driver = null; // compile-only fixture
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  // EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (non-zero implicitlyWait + FluentWait on same driver)
  // EXPECTED TREATMENT: none
  @Test
  void implicitWaitPlusFluentWaitSameDriver() {
    WebDriver driver = null; // compile-only fixture
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
    new FluentWait<>(driver).withTimeout(Duration.ofSeconds(10));
  }

  // EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (setup-method implicit + test explicit)
  // EXPECTED TREATMENT: none
  @Test
  void setupImplicitPlusTestExplicit() {
    WebDriver driver = null; // compile-only fixture
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(4));
    WebElement element = driver.findElement(By.id("lazy-element"));
    new WebDriverWait(driver, Duration.ofSeconds(5))
        .until(ignored -> element.isDisplayed());
  }

  // -------- Negatives --------

  // EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (implicit only)
  @Test
  void implicitOnly() {
    WebDriver driver = null; // compile-only fixture
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    driver.findElement(By.id("x"));
  }

  // EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (explicit only)
  @Test
  void explicitOnly() {
    WebDriver driver = null; // compile-only fixture
    new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  // EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (zero reset before explicit)
  @Test
  void zeroResetBeforeExplicit() {
    WebDriver driver = null; // compile-only fixture
    driver.manage().timeouts().implicitlyWait(Duration.ZERO);
    new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  // EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (different drivers)
  @Test
  void differentDrivers() {
    WebDriver driverA = null; // compile-only fixture
    WebDriver driverB = null; // compile-only fixture
    driverA.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    new WebDriverWait(driverB, Duration.ofSeconds(10));
  }
}
