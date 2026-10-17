from __future__ import annotations


def test_login_success(login_page, home_page):
    login_page.login("demo", "secret")

    assert home_page.username() == "demo"


def test_login_failure(login_page):
    login_page.login("bad-user", "bad-pass")

    assert login_page.error_message() == "Invalid credentials"
