package frameworks.seleniumjava.pages;

import org.openqa.selenium.WebDriver;
import io.qameta.allure.Step;

public final class AppShellPage extends BasePage {
  private static final String NAV_HOME = "nav-home";
  private static final String NAV_SETTINGS = "nav-settings";
  private static final String NAV_FORM = "nav-form";
  private static final String LOGOUT_BUTTON = "logout-btn";

  public AppShellPage(WebDriver driver) {
    super(driver);
  }

  @Step
  public void gotoHome() {
    clickOn(NAV_HOME);
  }

  @Step
  public void gotoSettings() {
    clickOn(NAV_SETTINGS);
  }

  @Step
  public void gotoForm() {
    clickOn(NAV_FORM);
  }

 @Step
  public void logout() {
    clickOn(LOGOUT_BUTTON);
  }
}
