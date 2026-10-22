package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * A clean Selenium test with no intentional TestSentry findings.
 * Uses stable locators and explicit waits — no Thread.sleep, no implicit wait,
 * no brittle XPath or CSS selectors.
 */
class CleanTest {

  private WebDriver driver;

  @BeforeEach
  void startBrowser() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    driver = new ChromeDriver(options);
  }

  @AfterEach
  void stopBrowser() {
    if (driver != null) {
      try {
        driver.quit();
      } finally {
        driver = null;
      }
    }
  }

  @Test
  void cleanLoginFlow() {
    driver.get("https://example.com");

    WebElement username = driver.findElement(By.id("username"));
    username.sendKeys("user@example.com");

    WebElement password = driver.findElement(By.id("password"));
    password.sendKeys("secure-password");

    WebElement loginButton = driver.findElement(By.id("login-button"));
    loginButton.click();

    WebElement welcome = driver.findElement(By.className("welcome-banner"));
    assert welcome.isDisplayed();

  }

  @Test
  void cleanWaitForElement() {
    driver.get("https://example.com");

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement dynamicElement = wait.until(
        ExpectedConditions.visibilityOf(driver.findElement(By.id("dynamic-content")))
    );
    assert dynamicElement.isDisplayed();

  }
}
