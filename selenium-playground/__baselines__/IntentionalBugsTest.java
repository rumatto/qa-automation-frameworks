package tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * Intentional TestSentry acceptance data for Selenium Java.
 * This baseline is restored by ./reset-treatments.sh after Apply tests.
 */
class IntentionalBugsTest {

  @Test
  void testWithFixedTimeout() throws InterruptedException {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fixed Timeout
    // EXPECTED TREATMENT: manual guidance to replace with condition-based explicit wait
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
    // EXPECTED TREATMENT: manual guidance to use context-specific WebDriverWait
    driver.manage().timeouts().implicitlyWait(java.time.Duration.ofSeconds(5));

    WebElement element = driver.findElement(By.id("lazy-element"));
    assert element.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithFixedTimeoutMultiple() throws InterruptedException {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fixed Timeout
    // EXPECTED TREATMENT: manual guidance
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
    // EXPECTED TREATMENT: By.id("login-button")
    WebElement loginButton = driver.findElement(By.xpath("//*[@id='login-button']"));
    assert loginButton.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithExactIdXPathDoubleQuoted() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: By.id("submit-button")
    WebElement submitButton = driver.findElement(By.xpath("//*[@id=\"submit-button\"]"));
    assert submitButton.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithExactNameXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: By.name("email")
    WebElement email = driver.findElement(By.xpath("//*[@name='email']"));
    assert email.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithExactDataTestIdXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: stable CSS [data-testid="checkout-button"] patch
    WebElement checkout = driver.findElement(By.xpath("//*[@data-testid='checkout-button']"));
    assert checkout.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithRelativeDataAttributeXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    WebElement panel = driver.findElement(By.id("panel"));
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: scoped CSS button[data-action="save"] patch
    WebElement save = panel.findElement(By.xpath(".//button[@data-action='save']"));
    assert save.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithRelativeAriaAttributeXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    WebElement panel = driver.findElement(By.id("panel"));
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: scoped CSS button[aria-label="Close"] patch
    WebElement close = panel.findElement(By.xpath(".//button[@aria-label='Close']"));
    assert close.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithRelativeTagXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    WebElement panel = driver.findElement(By.id("panel"));
    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: By.tagName("button")
    WebElement button = panel.findElement(By.xpath(".//button"));
    assert button.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithClassBasedXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: manual guidance
    WebElement submitButton = driver.findElement(By.xpath("//button[contains(@class, 'submit')]"));
    assert submitButton.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithStructuralXPath() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile XPath locator
    // EXPECTED TREATMENT: manual guidance
    WebElement link = driver.findElement(By.xpath("//div[3]/ul/li[2]/a"));
    assert link.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithFragileCssSelector() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile CSS locator
    // EXPECTED TREATMENT: manual guidance
    WebElement item = driver.findElement(By.cssSelector("div.item:nth-child(3)"));
    assert item.isDisplayed();
    driver.quit();
  }

  @Test
  void testWithLongStructuralCssSelector() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    // EXPECTED FINDING: Fragile CSS locator
    // EXPECTED TREATMENT: manual guidance
    WebElement link = driver.findElement(By.cssSelector("main > section > div > a"));
    assert link.isDisplayed();
    driver.quit();
  }
}
