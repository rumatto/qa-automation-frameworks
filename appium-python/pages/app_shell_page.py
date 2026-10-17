from __future__ import annotations

from pages.base_page import BasePage


class AppShellPage(BasePage):
    nav_home = "nav_home"
    nav_settings = "nav_settings"
    nav_form = "nav_form"
    nav_logout = "nav_logout"

    def open_home(self) -> None:
        self.click_on(self.nav_home)

    def open_settings(self) -> None:
        self.click_on(self.nav_settings)

    def open_form(self) -> None:
        self.click_on(self.nav_form)

    def logout(self) -> None:
        self.click_on(self.nav_logout)
