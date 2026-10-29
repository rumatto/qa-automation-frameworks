package tests;

import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

/**
 * Compile-only TestSentry fixtures: qadoctor.selenium-java.shared-webdriver-lifecycle.
 *
 * These fixtures represent intentional shared WebDriver lifecycle patterns
 * (static driver fields) for TestSentry scanning. They are compile-only: no
 * real browser is launched and no test is executed against a live page.
 *
 * Detector semantics, Treatment providers, rule registry, and built-in counts
 * are unchanged. Intentional bad examples are preserved.
 */
// Intentional TestSentry fixture: shared WebDriver lifecycle
class SharedWebDriverLifecycleTest {

  // -------- Positives --------

  // EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static WebDriver field)
  // EXPECTED TREATMENT: none
  private static WebDriver staticDriver;

  // EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static ChromeDriver field)
  // EXPECTED TREATMENT: none
  private static ChromeDriver staticChromeDriver;

  // EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static RemoteWebDriver field)
  // EXPECTED TREATMENT: none
  private static RemoteWebDriver staticRemoteDriver;

  // EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static driver assigned in setup lifecycle)
  // EXPECTED TREATMENT: none
  @Test
  void staticDriverAssignedInSetupLifecycle() {
    staticDriver = new ChromeDriver(new ChromeOptions());
  }

  // -------- Negatives --------

  // EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (instance driver)
  @Test
  void instanceDriver() {
    WebDriver driver = null;
  }

  // EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (local driver)
  @Test
  void localDriver() {
    WebDriver local = null;
  }

  // EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static non-driver field)
  private static final String staticNotADriver = "not-a-driver";

  // EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (framework-managed / proxy case)
  // The playground does not host a framework-managed WebDriver proxy; this negative
  // case documents the expectation that such a case would not be flagged.
  @Test
  void frameworkManagedProxyPlaceholder() {
    // No framework-managed WebDriver proxy exists in this playground.
  }
}
