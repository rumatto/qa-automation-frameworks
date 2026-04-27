package frameworks.seleniumjava.pages;

import org.openqa.selenium.WebDriver;
import io.qameta.allure.Step;
import static org.junit.jupiter.api.Assertions.assertTrue;

public final class FormPage extends BasePage {
  private static final String EMAIL = "email";
  private static final String MESSAGE = "message";
  private static final String SUBMIT = "submit-btn";
  private static final String STATUS = "form-status";
  private static final String VIEW = "view-form";

  public FormPage(WebDriver driver) {
    super(driver);
  }

  @Step
  public void submitForm(String emailValue, String messageValue) {
    typeInto(EMAIL, emailValue);
    typeInto(MESSAGE, messageValue);
    clickOn(SUBMIT);
  }

  @Step
  public void expectVisible() {
    assertTrue(isTestIdVisible(VIEW));
    assertTrue(isTestIdVisible(EMAIL));
    assertTrue(isTestIdVisible(MESSAGE));
  }

  @Step
  public String getStatusText() {
    return getTestIdText(STATUS);
  }
}
