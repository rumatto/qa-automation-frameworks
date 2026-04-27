from __future__ import annotations

import os
import re
import sys
import tempfile
import shutil
import threading
import functools
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from pathlib import Path

import pytest
import allure
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pages.app_shell_page import AppShellPage
from pages.form_page import FormPage
from pages.home_page import HomePage
from pages.login_page import LoginPage
from pages.settings_page import SettingsPage
TESTS_DIR = Path(__file__).resolve().parent


@pytest.fixture(scope="session")
def app_base_url():
    configured_url = os.getenv("BASE_URL")
    if configured_url:
        yield configured_url
        return

    # Serve tests/ (which contains app.html) over localhost to avoid flaky file:// loads.
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *_args):  # noqa: ANN001
            return

    handler = functools.partial(QuietHandler, directory=str(TESTS_DIR))
    httpd = TCPServer(("127.0.0.1", 0), handler, bind_and_activate=False)
    httpd.allow_reuse_address = True
    httpd.server_bind()
    httpd.server_activate()
    port = httpd.server_address[1]

    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    yield f"http://127.0.0.1:{port}"
    httpd.shutdown()
    httpd.server_close()


@pytest.fixture()
def driver(app_base_url):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,720")
    user_data_dir = tempfile.mkdtemp(prefix="selenium-python-chrome-")
    options.add_argument(f"--user-data-dir={user_data_dir}")

    drv = webdriver.Chrome(options=options)  # Selenium Manager resolves driver
    configured_url = os.getenv("BASE_URL")
    url = configured_url if configured_url else f"{app_base_url}/app.html"
    last_err: Exception | None = None
    for _ in range(3):
        try:
            drv.get(url)
            WebDriverWait(drv, 10).until(
                lambda browser: browser.find_element(By.CSS_SELECTOR, '[data-testid="username"]')
            )
            last_err = None
            break
        except Exception as e:  # noqa: BLE001
            last_err = e
    if last_err:
        drv.quit()
        shutil.rmtree(user_data_dir, ignore_errors=True)
        raise last_err
    yield drv
    drv.quit()
    shutil.rmtree(user_data_dir, ignore_errors=True)


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    result = outcome.get_result()
    setattr(item, f"rep_{result.when}", result)


@pytest.fixture(autouse=True)
def capture_failure_screenshot(request, driver):
    yield
    rep = getattr(request.node, "rep_call", None)
    if rep and rep.failed:
        artifacts_dir = ROOT / "test-results"
        artifacts_dir.mkdir(exist_ok=True)
        safe_name = re.sub(r"[^A-Za-z0-9_.-]+", "_", request.node.nodeid)
        screenshot = driver.get_screenshot_as_png()
        artifact_path = artifacts_dir / f"{safe_name}.png"
        artifact_path.write_bytes(screenshot)
        allure.attach(
            screenshot,
            name="failure-screenshot",
            attachment_type=allure.attachment_type.PNG,
        )


@pytest.fixture()
def login_page(driver):
    return LoginPage(driver)


@pytest.fixture()
def app_shell(driver):
    return AppShellPage(driver)


@pytest.fixture()
def home_page(driver):
    return HomePage(driver)


@pytest.fixture()
def settings_page(driver):
    return SettingsPage(driver)


@pytest.fixture()
def form_page(driver):
    return FormPage(driver)
