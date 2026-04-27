package frameworks.seleniumjava.utils;

public final class AppUrls {
  private AppUrls() {}

  public static String appUrl() {
    String configuredUrl = System.getenv("BASE_URL");
    if (configuredUrl != null && !configuredUrl.isBlank()) {
      return configuredUrl;
    }
    return TestAppServer.appUrl();
  }
}
