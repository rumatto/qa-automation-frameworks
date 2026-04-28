package frameworks.seleniumjava.utils;

import java.nio.file.Files;
import java.nio.file.Path;

public final class SharedDemoPaths {
  private SharedDemoPaths() {}

  public static Path repoRoot() {
    Path workingDir = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
    if (Files.isDirectory(workingDir.resolve("demo-services"))) {
      return workingDir;
    }
    return workingDir.getParent();
  }

  public static Path appHtml() {
    return repoRoot().resolve("demo-services/test-app/app.html");
  }

  public static Path testApiScript() {
    return repoRoot().resolve("demo-services/test-api/server.js");
  }
}
