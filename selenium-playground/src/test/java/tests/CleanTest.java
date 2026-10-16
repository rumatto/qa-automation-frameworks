package tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * A clean Selenium test with no intentional TestSentry findings.
 * Uses stable locators and explicit waits — no Thread.sleep, no implicit wait,
 * no brittle XPath or CSS selectors.
 */
class CleanTest {

  @Test
  void cleanLoginFlow() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    WebElement username = driver.findElement(By.id("username"));
    username.sendKeys("user@example.com");

    WebElement password = driver.findElement(By.id("password"));
    password.sendKeys("secure-password");

    WebElement loginButton = driver.findElement(By.id("login-button"));
    loginButton.click();

    WebElement welcome = driver.findElement(By.className("welcome-banner"));
    assert welcome.isDisplayed();

    driver.quit();
  }

  @Test
  void cleanWaitForElement() {
    WebDriver driver = new ChromeDriver();
    driver.get("https://example.com");

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement dynamicElement = wait.until(
        ExpectedConditions.visibilityOf(driver.findElement(By.id("dynamic-content")))
    );
    assert dynamicElement.isDisplayed();

    driver.quit();
  }
}
