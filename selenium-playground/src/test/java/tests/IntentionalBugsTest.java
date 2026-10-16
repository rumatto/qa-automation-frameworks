package tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * Tests containing clearly-marked intentional issues for TestSentry scanning.
 *
 * Each intentional pattern is annotated with a comment like:
 *   // EXPECTED FINDING: <rule description>
 *   // EXPECTED TREATMENT: <short description> | none
 *
 * This baseline is the untreated intentional-bug state.
 * Use ./reset-treatments.sh to restore this file after TestSentry treatments are applied.
 */
class IntentionalBugsTest {

  @Test
  void testWithFixedTimeout() throws InterruptedException {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // Wait for the page to load — using Thread.sleep is the anti-pattern.
    // EXPECTED FINDING: Fixed Timeout
    // EXPECTED TREATMENT: none
    Thread.sleep(2000);

    WebElement dynamicElement = driver.findElement(By.id("dynamic-content"));
    assert dynamicElement.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithImplicitWait() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Implicit Wait
    // EXPECTED TREATMENT: none
    driver.manage().timeouts().implicitlyWait(java.time.Duration.ofSeconds(5));

    WebElement element = driver.findElement(By.id("lazy-element"));
    assert element.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithFixedTimeoutMultiple() throws InterruptedException {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // Another fixed sleep variant
    // EXPECTED FINDING: Fixed Timeout
    // EXPECTED TREATMENT: none
    Thread.sleep(1000);

    WebElement element = driver.findElement(By.id("submit-btn"));
    assert element.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithExactIdXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: Replace exact ID XPath with By.id locator
    WebElement loginButton = driver.findElement(By.xpath("//*[@id='login-button']"));
    assert loginButton.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithExactIdXPathDoubleQuoted() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // Double-quoted form of same pattern — also treatable
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: Replace exact ID XPath with By.id locator
    WebElement submitButton = driver.findElement(By.xpath("//*[@id=\"submit-button\"]"));
    assert submitButton.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithClassBasedXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // XPath with class predicate — fragile but not deterministic treatment
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: none
    WebElement submitButton = driver.findElement(By.xpath("//button[contains(@class, 'submit')]"));
    assert submitButton.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithStructuralXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // Deep positional XPath — fragile, no deterministic treatment
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: none
    WebElement link = driver.findElement(By.xpath("//div[3]/ul/li[2]/a"));
    assert link.isDisplayed();

    driver.quit();
  }

  @Test
  void testWithFragileCssSelector() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // CSS with nth-child — flagged as fragile
    // EXPECTED FINDING: Fragile CSS locator
    // EXPECTED TREATMENT: none
    WebElement item = driver.findElement(By.cssSelector("div.item:nth-child(3)"));
    assert item.isDisplayed();

    driver.quit();
  }
}
