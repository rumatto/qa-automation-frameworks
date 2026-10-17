from __future__ import annotations

from appium.webdriver.common.appiumby import AppiumBy
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait


class BasePage:
    def __init__(self, driver, timeout: int = 10) -> None:
        self.driver = driver
        self.timeout = timeout

    @property
    def app_package(self) -> str:
        return self.driver.capabilities.get("appPackage", "com.romio.androiddemo")

    def resource_id(self, element_id: str) -> str:
        return f"{self.app_package}:id/{element_id}"

    def wait_for_id(self, element_id: str) -> WebElement:
        locator = (AppiumBy.ID, self.resource_id(element_id))
        return WebDriverWait(self.driver, self.timeout).until(
            lambda drv: drv.find_element(*locator)
        )

    def click_on(self, element_id: str) -> None:
        self.wait_for_id(element_id).click()

    def type_into(self, element_id: str, value: str) -> None:
        element = self.wait_for_id(element_id)
        element.clear()
        element.send_keys(value)

    def get_text(self, element_id: str) -> str:
        return self.wait_for_id(element_id).text

    def is_visible(self, element_id: str) -> bool:
        try:
            return self.driver.find_element(AppiumBy.ID, self.resource_id(element_id)).is_displayed()
        except NoSuchElementException:
            return False
