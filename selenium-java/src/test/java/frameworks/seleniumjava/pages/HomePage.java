package frameworks.seleniumjava.pages;

import org.openqa.selenium.WebDriver;
import io.qameta.allure.Step;

public final class HomePage extends BasePage {
  private static final String WELCOME = "welcome";
  private static final String WHOAMI = "whoami";

  public HomePage(WebDriver driver) {
    super(driver);
  }

  @Step
  public String getTitle() {
    return getTestIdText(WELCOME);
  }

  @Step
  public String getTextWhoAmI() {
    return getTestIdText(WHOAMI);
  }
}
