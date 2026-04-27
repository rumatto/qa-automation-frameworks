package frameworks.seleniumjava.tests;

import frameworks.seleniumjava.utils.TestApp;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@Tag("ui")
public final class LoginTest extends BaseTest {
  @Test
  void validLogin() {
    loginPage.login(TestApp.VALID_CREDENTIALS.username(), TestApp.VALID_CREDENTIALS.password());

    assertTrue(homePage.getTitle().contains("Welcome"));
    assertTrue(homePage.getTextWhoAmI().contains(TestApp.VALID_CREDENTIALS.username()));
  }

  @Test
  void invalidLoginShowsError() {
    loginPage.login("bad", "creds");
    assertEquals("Invalid credentials", loginPage.getErrorMessage());
  }
}
