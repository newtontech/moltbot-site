"""Pytest configuration and fixtures"""

from pathlib import Path

import pytest


@pytest.fixture
def project_root() -> Path:
    """Return the project root directory."""
    return Path(__file__).parent.parent


@pytest.fixture
def index_html(project_root: Path) -> Path:
    """Return the index.html file path."""
    return project_root / "index.html"


@pytest.fixture
def index_html_content(index_html: Path) -> str:
    """Return the index.html file content."""
    return index_html.read_text(encoding="utf-8")
