from __future__ import annotations

from pages.base_page import BasePage


class AppShellPage(BasePage):
    nav_home = "nav-home"
    nav_settings = "nav-settings"
    nav_form = "nav-form"
    logout_btn = "logout-btn"

    def goto_home(self) -> None:
        self.click_on(self.nav_home)

    def goto_settings(self) -> None:
        self.click_on(self.nav_settings)

    def goto_form(self) -> None:
        self.click_on(self.nav_form)

    def logout(self) -> None:
        self.click_on(self.logout_btn)
