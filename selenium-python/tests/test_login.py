from __future__ import annotations

from utils.test_app import VALID_CREDENTIALS


def test_valid_login(login_page, home_page):
    login_page.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password)
    assert "Welcome" in home_page.get_title()
    assert VALID_CREDENTIALS.username in home_page.get_text_who_am_i()


def test_invalid_login_shows_error(login_page):
    login_page.login("bad", "creds")
    assert "Invalid credentials" in login_page.get_error_message()
