from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Credentials:
    username: str
    password: str


VALID_CREDENTIALS = Credentials(username="demo", password="secret")
