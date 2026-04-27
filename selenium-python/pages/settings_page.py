from __future__ import annotations

from pages.base_page import BasePage


class SettingsPage(BasePage):
    settings_text = "settings-text"
    view = "view-settings"

    def get_settings_text(self) -> str:
        return self.get_test_id_text(self.settings_text)
