from __future__ import annotations

import pytest


def test_contact_form_validation(login_page, app_shell, form_page):
    login_page.login("demo", "secret")
    app_shell.open_form()

    form_page.submit_contact("bad-email", "short")

    assert form_page.status_text() == "Please enter a valid email and a message with at least 10 characters."


@pytest.mark.requires_api
def test_contact_form_submission(login_page, app_shell, form_page):
    login_page.login("demo", "secret")
    app_shell.open_form()

    form_page.submit_contact("qa@example.com", "Hello from the Appium smoke test.")

    assert form_page.status_text() == "Submitted successfully."
