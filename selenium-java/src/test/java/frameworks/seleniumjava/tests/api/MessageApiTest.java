package frameworks.seleniumjava.tests.api;

import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.equalTo;

@Tag("api")
@Feature("API")
public final class MessageApiTest extends BaseApiTest {
  @Test
  @Story("Create contact message")
  void submitMessageSuccessfully() {
    given()
        .filter(allureFilter)
        .contentType("application/json")
        .body(Map.of(
            "email", "qa@example.com",
            "message", "API automation example from RestAssured."
        ))
    .when()
        .post("/api/messages")
    .then()
        .statusCode(201)
        .body(matchesJsonSchemaInClasspath("message-accepted.schema.json"))
        .body("status", equalTo("accepted"))
        .body("messageId", equalTo("msg-001"))
        .body("echo.email", equalTo("qa@example.com"))
        .body("echo.message", equalTo("API automation example from RestAssured."));
  }

  @Test
  @Story("Validate contact payload")
  void rejectInvalidMessagePayload() {
    given()
        .filter(allureFilter)
        .contentType("application/json")
        .body(Map.of(
            "email", "bad-email",
            "message", "short"
        ))
    .when()
        .post("/api/messages")
    .then()
        .statusCode(400)
        .body(matchesJsonSchemaInClasspath("error-response.schema.json"))
        .body("status", equalTo("error"))
        .body("message", equalTo("A valid email is required."));
  }
}
