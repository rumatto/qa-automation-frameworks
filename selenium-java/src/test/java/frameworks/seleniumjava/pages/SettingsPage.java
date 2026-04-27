package frameworks.seleniumjava.pages;

import org.openqa.selenium.WebDriver;
import io.qameta.allure.Step;

public final class SettingsPage extends BasePage {
  private static final String SETTINGS_TEXT = "settings-text";

  public SettingsPage(WebDriver driver) {
    super(driver);
  }

  @Step
  public String getSettingsText() {
    return getTestIdText(SETTINGS_TEXT);
  }
}
