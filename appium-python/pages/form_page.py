from __future__ import annotations

from pages.base_page import BasePage


class FormPage(BasePage):
    email = "form_email"
    message = "form_message"
    submit = "form_submit"
    status = "form_status"

    def submit_contact(self, email: str, message: str) -> None:
        self.type_into(self.email, email)
        self.type_into(self.message, message)
        self.click_on(self.submit)

    def status_text(self) -> str:
        return self.get_text(self.status)
