package frameworks.seleniumjava.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.qameta.allure.Step;

import java.time.Duration;

public abstract class BasePage {
  protected final WebDriver driver;
  private final Duration timeout;

  protected BasePage(WebDriver driver) {
    this(driver, Duration.ofSeconds(5));
  }

  protected BasePage(WebDriver driver, Duration timeout) {
    this.driver = driver;
    this.timeout = timeout;
  }

  @Step
  protected By byTestId(String testId) {
    return By.cssSelector("[data-testid='" + testId + "']");
  }

  @Step
  protected WebElement waitForTestId(String testId) {
    By locator = byTestId(testId);
    return new WebDriverWait(driver, timeout).until(browser -> browser.findElement(locator));
  }

  @Step
  protected void clickOn(String testId) {
    waitForTestId(testId).click();
  }

  @Step
  protected void typeInto(String testId, String value) {
    WebElement element = waitForTestId(testId);
    element.clear();
    element.sendKeys(value);
  }

  @Step
  protected String getTestIdText(String testId) {
    return waitForTestId(testId).getText();
  }

  @Step
  protected boolean isTestIdVisible(String testId) {
    try {
      return driver.findElement(byTestId(testId)).isDisplayed();
    } catch (NoSuchElementException error) {
      return false;
    }
  }
}
