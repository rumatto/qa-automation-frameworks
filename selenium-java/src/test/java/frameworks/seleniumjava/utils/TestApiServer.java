package frameworks.seleniumjava.utils;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public final class TestApiServer {
  private static HttpServer server;
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

    try {
      server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
      server.createContext("/api/health", exchange ->
          writeJson(exchange, 200, "{\"status\":\"ok\"}"));
      server.createContext("/api/users/demo", exchange ->
          writeJson(exchange, 200,
              "{\"user\":{\"id\":101,\"username\":\"demo\",\"role\":\"qa-engineer\",\"features\":[\"ui\",\"api\",\"reporting\"]}}"));
      server.createContext("/api/messages", TestApiServer::handleMessages);
      server.start();

      baseUrl = "http://127.0.0.1:" + server.getAddress().getPort();
      Runtime.getRuntime().addShutdownHook(new Thread(TestApiServer::stopQuietly));
      return baseUrl;
    } catch (IOException error) {
      throw new UncheckedIOException("Unable to start the local API server", error);
    }
  }

  private static void handleMessages(HttpExchange exchange) throws IOException {
    if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
      writeJson(exchange, 405, "{\"status\":\"error\",\"message\":\"Method not allowed\"}");
      return;
    }

    String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
    String email = extractJsonString(body, "email");
    String message = extractJsonString(body, "message");

    if (!isValidEmail(email)) {
      writeJson(exchange, 400, "{\"status\":\"error\",\"message\":\"A valid email is required.\"}");
      return;
    }

    if (message == null || message.trim().length() < 10) {
      writeJson(exchange, 400, "{\"status\":\"error\",\"message\":\"Message must be at least 10 characters long.\"}");
      return;
    }

    writeJson(
        exchange,
        201,
        "{\"status\":\"accepted\",\"messageId\":\"msg-001\",\"submittedAt\":\"2026-04-25T12:00:00Z\","
            + "\"echo\":{\"email\":\"" + escapeJson(email.trim()) + "\",\"message\":\"" + escapeJson(message.trim()) + "\"}}"
    );
  }

  private static String extractJsonString(String body, String field) {
    String pattern = "\"" + field + "\"";
    int fieldIndex = body.indexOf(pattern);
    if (fieldIndex < 0) {
      return null;
    }

    int colonIndex = body.indexOf(':', fieldIndex + pattern.length());
    if (colonIndex < 0) {
      return null;
    }

    int firstQuote = body.indexOf('"', colonIndex + 1);
    if (firstQuote < 0) {
      return null;
    }

    int secondQuote = body.indexOf('"', firstQuote + 1);
    if (secondQuote < 0) {
      return null;
    }

    return body.substring(firstQuote + 1, secondQuote);
  }

  private static boolean isValidEmail(String value) {
    return value != null && value.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
  }

  private static String escapeJson(String value) {
    return value.replace("\\", "\\\\").replace("\"", "\\\"");
  }

  private static void writeJson(HttpExchange exchange, int statusCode, String body) throws IOException {
    byte[] payload = body.getBytes(StandardCharsets.UTF_8);
    exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
    exchange.sendResponseHeaders(statusCode, payload.length);
    try (OutputStream output = exchange.getResponseBody()) {
      output.write(payload);
    } finally {
      exchange.close();
    }
  }

  private static synchronized void stopQuietly() {
    if (server != null) {
      server.stop(0);
      server = null;
      baseUrl = null;
    }
  }
}
