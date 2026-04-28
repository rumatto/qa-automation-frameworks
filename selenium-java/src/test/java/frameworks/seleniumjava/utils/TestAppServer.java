package frameworks.seleniumjava.utils;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;

public final class TestAppServer {
  private static HttpServer server;
  private static String appUrl;

  private TestAppServer() {}

  public static synchronized String appUrl() {
    if (appUrl != null) {
      return appUrl;
    }

    try {
      byte[] appBytes = Files.readAllBytes(SharedDemoPaths.appHtml());
      if (appBytes.length == 0) {
        throw new IllegalStateException("Shared demo app is empty.");
      }
      server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
      server.createContext("/app.html", exchange -> writeHtml(exchange, appBytes));
      server.start();
      appUrl = "http://127.0.0.1:" + server.getAddress().getPort() + "/app.html";

      Runtime.getRuntime().addShutdownHook(new Thread(TestAppServer::stopQuietly));
      return appUrl;
    } catch (IOException error) {
      throw new UncheckedIOException("Unable to start the local app server", error);
    }
  }

  private static void writeHtml(HttpExchange exchange, byte[] appBytes) throws IOException {
    exchange.getResponseHeaders().add("Content-Type", "text/html; charset=utf-8");
    exchange.sendResponseHeaders(200, appBytes.length);
    try (OutputStream output = exchange.getResponseBody()) {
      output.write(appBytes);
    } finally {
      exchange.close();
    }
  }

  private static synchronized void stopQuietly() {
    if (server != null) {
      server.stop(0);
      server = null;
      appUrl = null;
    }
  }
}
