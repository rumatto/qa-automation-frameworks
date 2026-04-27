from __future__ import annotations

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait


class BasePage:
    def __init__(self, driver: WebDriver, timeout: int = 5) -> None:
        self.driver = driver
        self.timeout = timeout

    def by_test_id(self, test_id: str) -> tuple[str, str]:
        return By.CSS_SELECTOR, f'[data-testid="{test_id}"]'

    def wait_for_test_id(self, test_id: str) -> WebElement:
        locator = self.by_test_id(test_id)
        return WebDriverWait(self.driver, self.timeout).until(
            lambda drv: drv.find_element(*locator)
        )

    def click_on(self, test_id: str) -> None:
        self.wait_for_test_id(test_id).click()

    def type_into(self, test_id: str, value: str) -> None:
        element = self.wait_for_test_id(test_id)
        element.clear()
        element.send_keys(value)

    def get_test_id_text(self, test_id: str) -> str:
        return self.wait_for_test_id(test_id).text

    def is_test_id_visible(self, test_id: str) -> bool:
        try:
            return self.driver.find_element(*self.by_test_id(test_id)).is_displayed()
        except NoSuchElementException:
            return False
