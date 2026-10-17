from __future__ import annotations

from pages.base_page import BasePage


class SettingsPage(BasePage):
    text = "settings_text"

    def description(self) -> str:
        return self.get_text(self.text)
