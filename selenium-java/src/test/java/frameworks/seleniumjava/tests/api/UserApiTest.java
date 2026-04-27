package frameworks.seleniumjava.tests.api;

import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;

@Tag("api")
@Feature("API")
public final class UserApiTest extends BaseApiTest {
  @Test
  @Story("Get user profile")
  void fetchDemoUserProfile() {
    given()
        .filter(allureFilter)
    .when()
        .get("/api/users/demo")
    .then()
        .statusCode(200)
        .body("user.id", equalTo(101))
        .body("user.username", equalTo("demo"))
        .body("user.role", equalTo("qa-engineer"))
        .body("user.features", hasItem("api"));
  }
}
