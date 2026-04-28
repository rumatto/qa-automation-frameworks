package frameworks.seleniumjava.utils;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

public final class TestApiServer {
  private static Process process;
  private static String baseUrl;

  private TestApiServer() {}

  public static synchronized String baseUrl() {
    String configuredUrl = System.getenv("API_BASE_URL");
    if (configuredUrl != null && !configuredUrl.isBlank()) {
      return configuredUrl;
    }

    if (baseUrl != null) {
      return baseUrl;
    }

    int port = findOpenPort();
    ProcessBuilder builder = new ProcessBuilder("node", SharedDemoPaths.testApiScript().toString());
    builder.environment().put("PORT", Integer.toString(port));
    builder.redirectErrorStream(true);

    try {
      process = builder.start();
      baseUrl = "http://127.0.0.1:" + port;
      waitForHealthcheck(baseUrl);
      Runtime.getRuntime().addShutdownHook(new Thread(TestApiServer::stopQuietly));
      return baseUrl;
    } catch (IOException | InterruptedException error) {
      stopQuietly();
      throw new IllegalStateException("Unable to start the shared local API server", error);
    }
  }

  private static int findOpenPort() {
    try (ServerSocket socket = new ServerSocket(0)) {
      return socket.getLocalPort();
    } catch (IOException error) {
      throw new IllegalStateException("Unable to allocate an open port", error);
    }
  }

  private static void waitForHealthcheck(String serverBaseUrl) throws IOException, InterruptedException {
    HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(2))
        .build();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(serverBaseUrl + "/api/health"))
        .timeout(Duration.ofSeconds(2))
        .GET()
        .build();

    IOException lastIoError = null;
    InterruptedException lastInterrupt = null;
    for (int attempt = 0; attempt < 20; attempt += 1) {
      try {
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
          return;
        }
        lastIoError = new IOException("Healthcheck returned status " + response.statusCode());
      } catch (IOException error) {
        lastIoError = error;
      } catch (InterruptedException error) {
        lastInterrupt = error;
      }
      TimeUnit.MILLISECONDS.sleep(250);
    }

    if (lastInterrupt != null) {
      throw lastInterrupt;
    }
    throw lastIoError != null ? lastIoError : new IOException("Shared local API server did not start");
  }

  private static synchronized void stopQuietly() {
    if (process != null) {
      process.destroy();
      try {
        process.waitFor(5, TimeUnit.SECONDS);
      } catch (InterruptedException ignored) {
        Thread.currentThread().interrupt();
      } finally {
        process = null;
        baseUrl = null;
      }
    }
  }
}
