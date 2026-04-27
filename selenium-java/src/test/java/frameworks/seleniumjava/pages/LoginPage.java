package frameworks.seleniumjava.pages;

import org.openqa.selenium.WebDriver;
import io.qameta.allure.Step;

public final class LoginPage extends BasePage {
  private static final String USERNAME = "username";
  private static final String PASSWORD = "password";
  private static final String LOGIN_BUTTON = "login-btn";
  private static final String ERROR = "login-error";

  public LoginPage(WebDriver driver) {
    super(driver);
  }

  @Step
  public void login(String user, String pass) {
    typeInto(USERNAME, user);
    typeInto(PASSWORD, pass);
    clickOn(LOGIN_BUTTON);
  }

  @Step
  public String getErrorMessage() {
    return getTestIdText(ERROR);
  }
}
