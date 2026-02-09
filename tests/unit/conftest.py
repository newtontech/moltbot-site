"""Unit test fixtures"""

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
def categories_json(data_dir: Path) -> Path:
    """Return the categories.json file path."""
    return data_dir / "categories.json"


@pytest.fixture
def config_json(data_dir: Path) -> Path:
    """Return the config.json file path."""
    return data_dir / "config.json"


@pytest.fixture
def categories_data(categories_json: Path) -> dict:
    """Return the categories.json content as dict."""
    import json

    return json.loads(categories_json.read_text(encoding="utf-8"))


@pytest.fixture
def config_data(config_json: Path) -> dict:
    """Return the config.json content as dict."""
    import json

    return json.loads(config_json.read_text(encoding="utf-8"))


@pytest.fixture
def css_dir(project_root: Path) -> Path:
    """Return the CSS directory path."""
    return project_root / "css"


@pytest.fixture
def js_dir(project_root: Path) -> Path:
    """Return the JavaScript directory path."""
    return project_root / "js"
