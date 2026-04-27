from __future__ import annotations

from pages.base_page import BasePage


class LoginPage(BasePage):
    username = "username"
    password = "password"
    login_btn = "login-btn"
    error = "login-error"

    def login(self, username: str, password: str) -> None:
        self.type_into(self.username, username)
        self.type_into(self.password, password)
        self.click_on(self.login_btn)

    def get_error_message(self) -> str:
        return self.get_test_id_text(self.error)
