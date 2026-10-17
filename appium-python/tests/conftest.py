from __future__ import annotations

import os
import re
import shutil
import socket
import subprocess
import sys
import time
from pathlib import Path

import allure
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pages.app_shell_page import AppShellPage
from pages.form_page import FormPage
from pages.home_page import HomePage
from pages.login_page import LoginPage
from pages.settings_page import SettingsPage


def _default_apk_path() -> str:
    return str(REPO_ROOT / "android-demo-app" / "app" / "build" / "outputs" / "apk" / "debug" / "app-debug.apk")


def _wait_for_port(host: str, port: int, timeout_seconds: float = 15.0) -> None:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1.0)
            if sock.connect_ex((host, port)) == 0:
                return
        time.sleep(0.25)
    raise TimeoutError(f"Timed out waiting for {host}:{port}")


def _port_from_url(url: str) -> int:
    remainder = url.split("://", 1)[-1]
    host_port = remainder.split("/", 1)[0]
    if ":" not in host_port:
        return 80
    return int(host_port.rsplit(":", 1)[1])


def pytest_collection_modifyitems(config, items):
    if os.getenv("RUN_API_TESTS") == "1":
        return

    skip_api = pytest.mark.skip(reason="Set RUN_API_TESTS=1 and provide a compatible host API to run this test.")
    for item in items:
        if "requires_api" in item.keywords:
            item.add_marker(skip_api)


@pytest.fixture(scope="session")
def appium_server():
    server_url = os.getenv("APPIUM_SERVER_URL", "http://127.0.0.1:4723/wd/hub")
    autostart = os.getenv("APPIUM_AUTOSTART", "1") != "0"

    if not autostart:
        yield server_url
        return

    appium_binary = shutil.which("appium")
    if appium_binary is None:
        raise RuntimeError("Appium is not available on PATH. Set APPIUM_AUTOSTART=0 to use an existing server.")

    process = subprocess.Popen(
        [appium_binary],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        _wait_for_port("127.0.0.1", _port_from_url(server_url))
        yield server_url
    finally:
        process.terminate()
        process.wait(timeout=10)


@pytest.fixture()
def driver(appium_server):
    apk_path = Path(os.getenv("APK_PATH", _default_apk_path())).resolve()
    if not apk_path.exists():
        raise FileNotFoundError(f"APK not found at {apk_path}")

    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = os.getenv("ANDROID_DEVICE_NAME", "Android Emulator")
    options.platform_version = os.getenv("ANDROID_PLATFORM_VERSION", "12")
    options.app = str(apk_path)
    options.app_package = os.getenv("APP_PACKAGE", "com.romio.androiddemo")
    options.app_activity = os.getenv("APP_ACTIVITY", ".MainActivity")
    options.automation_name = "UiAutomator2"
    options.new_command_timeout = 120
    options.no_reset = False
    options.full_reset = False
    options.set_capability("skipDeviceInitialization", True)
    options.set_capability("autoGrantPermissions", True)

    drv = webdriver.Remote(appium_server, options=options)
    yield drv
    drv.quit()


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
