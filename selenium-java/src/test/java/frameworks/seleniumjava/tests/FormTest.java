package frameworks.seleniumjava.tests;

import frameworks.seleniumjava.utils.TestApp;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Tag("ui")
public final class FormTest extends BaseTest {
  @Test
  void submitFormSuccessfully() {
    loginPage.login(TestApp.VALID_CREDENTIALS.username(), TestApp.VALID_CREDENTIALS.password());
    appShell.gotoForm();

    formPage.submitForm("qa@example.com", "Hello from Selenium Java!");
    assertEquals("Submitted successfully.", formPage.getStatusText());
  }

  @Test
  void invalidFormShowsValidationError() {
    loginPage.login(TestApp.VALID_CREDENTIALS.username(), TestApp.VALID_CREDENTIALS.password());
    appShell.gotoForm();

    formPage.submitForm("not-an-email", "x");
    assertEquals("Please enter a valid email and message.", formPage.getStatusText());
  }
}
