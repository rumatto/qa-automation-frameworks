from __future__ import annotations

from utils.test_app import VALID_CREDENTIALS


def test_navigate_between_sections(login_page, app_shell, settings_page, form_page):
    login_page.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password)

    app_shell.goto_settings()
    assert "Preferences live here." in settings_page.get_settings_text()

    app_shell.goto_form()
    form_page.expect_visible()
