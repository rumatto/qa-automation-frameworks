from __future__ import annotations

from utils.test_app import VALID_CREDENTIALS


def test_submit_form_successfully(login_page, app_shell, form_page):
    login_page.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password)
    app_shell.goto_form()

    form_page.submit_form("qa@example.com", "Hello from Selenium Python!")
    assert form_page.get_status_text() == "Submitted successfully."


def test_invalid_form_shows_validation_error(login_page, app_shell, form_page):
    login_page.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password)
    app_shell.goto_form()

    form_page.submit_form("not-an-email", "x")
    assert form_page.get_status_text() == "Please enter a valid email and message."
