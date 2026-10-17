from __future__ import annotations

from pages.base_page import BasePage


class LoginPage(BasePage):
    username = "login_username"
    password = "login_password"
    submit = "login_submit"
    error = "login_error"

    def login(self, username: str, password: str) -> None:
        self.type_into(self.username, username)
        self.type_into(self.password, password)
        self.click_on(self.submit)

    def error_message(self) -> str:
        return self.get_text(self.error)
