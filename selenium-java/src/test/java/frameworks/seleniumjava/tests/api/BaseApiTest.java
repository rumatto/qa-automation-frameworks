package frameworks.seleniumjava.tests.api;

import frameworks.seleniumjava.utils.TestApiServer;
import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.filter.Filter;
import org.junit.jupiter.api.BeforeAll;

public abstract class BaseApiTest {
  protected static Filter allureFilter;

  @BeforeAll
  static void configureRestAssured() {
    RestAssured.baseURI = TestApiServer.baseUrl();
    RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    allureFilter = new AllureRestAssured();
  }
}
