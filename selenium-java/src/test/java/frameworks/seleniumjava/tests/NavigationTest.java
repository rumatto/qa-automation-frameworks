package frameworks.seleniumjava.tests;

import frameworks.seleniumjava.utils.TestApp;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("ui")
public final class NavigationTest extends BaseTest {
  @Test
  void navigateBetweenSections() {
    loginPage.login(TestApp.VALID_CREDENTIALS.username(), TestApp.VALID_CREDENTIALS.password());

    appShell.gotoSettings();
    assertTrue(settingsPage.getSettingsText().contains("Preferences live here."));

    appShell.gotoForm();
    formPage.expectVisible();
  }
}
