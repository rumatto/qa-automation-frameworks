package frameworks.seleniumjava.utils;

public final class TestApp {
  public record Credentials(String username, String password) {}

  public static final Credentials VALID_CREDENTIALS = new Credentials("demo", "secret");

  private TestApp() {}
}
