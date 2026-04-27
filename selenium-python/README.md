# Selenium (Python)

Small Selenium + Python example framework with:

- `pytest` as the runner
- Page objects in `pages/`
- Shared fixtures in `tests/conftest.py`
- Failure screenshots in `test-results/`
- A bundled demo app with optional `BASE_URL` override

## Report links

- Live report: <https://rumatto.github.io/qa-automation-frameworks/selenium-python/>
- All reports index: <https://rumatto.github.io/qa-automation-frameworks/>

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Common commands

```bash
pytest
pytest tests/test_login.py
BASE_URL=http://127.0.0.1:3000/app.html pytest
```

## How it is organized

- `tests/`: pytest suites for login, navigation, and form flows
- `pages/`: page objects used by the tests
- `tests/conftest.py`: shared driver lifecycle, page fixtures, and failure screenshots
- `utils/test_app.py`: shared demo credentials
- `utils/app_paths.py`: app URL resolution with local fallback

## Environment behavior

This project can run with no environment variables. If `BASE_URL` is not provided, it serves the bundled demo app from `tests/app.html` over localhost.

If you want to point the suite at another app instance, set `BASE_URL` to the page entry URL before running `pytest`.

## Reports and artifacts

After a failed run, pytest saves screenshots under `test-results/`.
