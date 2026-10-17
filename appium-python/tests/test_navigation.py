from __future__ import annotations


def test_can_navigate_to_settings(login_page, app_shell, settings_page):
    login_page.login("demo", "secret")

    app_shell.open_settings()

    assert settings_page.description() == "Preferences live here."
