from __future__ import annotations

from pages.base_page import BasePage


class HomePage(BasePage):
    whoami = "home_whoami"
    profile_status = "home_profile_status"

    def username(self) -> str:
        return self.get_text(self.whoami)

    def profile_status_text(self) -> str:
        return self.get_text(self.profile_status)
