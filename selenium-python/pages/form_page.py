from __future__ import annotations

from pages.base_page import BasePage


class FormPage(BasePage):
    email = "email"
    message = "message"
    submit = "submit-btn"
    status = "form-status"
    view = "view-form"

    def submit_form(self, email: str, message: str) -> None:
        self.type_into(self.email, email)
        self.type_into(self.message, message)
        self.click_on(self.submit)

    def expect_visible(self) -> None:
        assert self.is_test_id_visible(self.view)
        assert self.is_test_id_visible(self.email)
        assert self.is_test_id_visible(self.message)

    def get_status_text(self) -> str:
        return self.get_test_id_text(self.status)
