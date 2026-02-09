"""Integration test fixtures"""

from pathlib import Path

import pytest


@pytest.fixture(scope="session")
def project_root() -> Path:
    """Return the project root directory (session scope)."""
    return Path(__file__).parent.parent.parent


@pytest.fixture
def index_html(project_root: Path) -> Path:
    """Return the index.html file path."""
    return project_root / "index.html"


@pytest.fixture
def index_html_content(index_html: Path) -> str:
    """Return the index.html file content."""
    return index_html.read_text(encoding="utf-8")


@pytest.fixture
def data_dir(project_root: Path) -> Path:
    """Return the data directory path."""
    return project_root / "data"


@pytest.fixture
def css_dir(project_root: Path) -> Path:
    """Return the CSS directory path."""
    return project_root / "css"


@pytest.fixture
def js_dir(project_root: Path) -> Path:
    """Return the JavaScript directory path."""
    return project_root / "js"
