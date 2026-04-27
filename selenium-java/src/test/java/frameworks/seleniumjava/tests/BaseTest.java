package frameworks.seleniumjava.tests;

import frameworks.seleniumjava.pages.AppShellPage;
import frameworks.seleniumjava.pages.FormPage;
import frameworks.seleniumjava.pages.HomePage;
import frameworks.seleniumjava.pages.LoginPage;
import frameworks.seleniumjava.pages.SettingsPage;
import frameworks.seleniumjava.utils.AppUrls;
import io.qameta.allure.Allure;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.chrome.ChromeDriver;

import java.io.ByteArrayInputStream;
import java.time.Duration;

public abstract class BaseTest {
  protected WebDriver driver;
  protected LoginPage loginPage;
  protected AppShellPage appShell;
  protected HomePage homePage;
  protected SettingsPage settingsPage;
  protected FormPage formPage;

  @RegisterExtension
  final TestExecutionExceptionHandler captureFailureArtifacts = new TestExecutionExceptionHandler() {
    @Override
    public void handleTestExecutionException(ExtensionContext context, Throwable throwable) throws Throwable {
      attachFailureScreenshot();
      throw throwable;
    }
  };

  @BeforeEach
  void setUp() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    options.addArguments("--window-size=1280,720");

    driver = new ChromeDriver(options); // Selenium Manager resolves driver
    Exception lastError = null;
    for (int attempt = 0; attempt < 3; attempt += 1) {
      try {
        driver.get(AppUrls.appUrl());
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(browser -> browser.findElement(By.cssSelector("[data-testid='username']")));
        lastError = null;
        break;
      } catch (Exception error) {
        lastError = error;
      }
    }
    if (lastError != null) {
      driver.quit();
      throw new RuntimeException("Unable to load the app under test", lastError);
    }

    loginPage = new LoginPage(driver);
    appShell = new AppShellPage(driver);
    homePage = new HomePage(driver);
    settingsPage = new SettingsPage(driver);
    formPage = new FormPage(driver);
  }

  @AfterEach
  void tearDown() {
    if (driver != null) driver.quit();
  }

  private void attachFailureScreenshot() {
    if (!(driver instanceof TakesScreenshot screenshotDriver)) {
      return;
    }

    try {
      byte[] png = screenshotDriver.getScreenshotAs(OutputType.BYTES);
      Allure.addAttachment(
          "failure-screenshot",
          "image/png",
          new ByteArrayInputStream(png),
          ".png"
      );
    } catch (WebDriverException ignored) {
      // The browser can already be closing on hard failures; skip the attachment in that case.
    }
  }
}
