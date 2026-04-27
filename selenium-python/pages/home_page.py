from __future__ import annotations

from pages.base_page import BasePage


class HomePage(BasePage):
    welcome = "welcome"
    whoami = "whoami"

    def get_title(self) -> str:
        return self.get_test_id_text(self.welcome)

    def get_text_who_am_i(self) -> str:
        return self.get_test_id_text(self.whoami)
