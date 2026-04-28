from __future__ import annotations

import os
from pathlib import Path


def app_url() -> str:
    configured_url = os.getenv("BASE_URL")
    if configured_url:
        return configured_url

    root = Path(__file__).resolve().parents[1]
    app = root.parent / "demo-services" / "test-app" / "app.html"
    return app.resolve().as_uri()
