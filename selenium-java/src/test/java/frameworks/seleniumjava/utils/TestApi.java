package frameworks.seleniumjava.utils;

import java.util.List;
import java.util.Map;

public final class TestApi {
  public static final Map<String, Object> DEMO_USER = Map.of(
      "id", 101,
      "username", "demo",
      "role", "qa-engineer",
      "features", List.of("ui", "api", "reporting")
  );

  private TestApi() {}
}
