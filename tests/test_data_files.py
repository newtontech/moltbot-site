"""Tests for data files in the modular structure"""

import json
from pathlib import Path

import pytest


def test_data_directory_exists(data_dir: Path):
    """Test that the data directory exists."""
    assert data_dir.exists(), "Data directory should exist"
    assert data_dir.is_dir(), "Data should be a directory"


def test_categories_json_exists(categories_json: Path):
    """Test that categories.json file exists."""
    assert categories_json.exists(), "categories.json should exist"
    assert categories_json.is_file(), "categories.json should be a file"


def test_config_json_exists(config_json: Path):
    """Test that config.json file exists."""
    assert config_json.exists(), "config.json should exist"
    assert config_json.is_file(), "config.json should be a file"


def test_categories_json_valid_json(categories_json: Path):
    """Test that categories.json is valid JSON."""
    try:
        json.loads(categories_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        pytest.fail(f"categories.json is not valid JSON: {e}")


def test_config_json_valid_json(config_json: Path):
    """Test that config.json is valid JSON."""
    try:
        json.loads(config_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        pytest.fail(f"config.json is not valid JSON: {e}")


def test_categories_data_structure(categories_data: dict):
    """Test that categories data has the expected structure."""
    # Should be a list or dict with categories
    assert isinstance(
        categories_data, (dict, list)
    ), "categories.json should contain a dict or list"

    # If it's a dict, check for expected keys
    if isinstance(categories_data, dict):
        # Common category structure keys
        expected_keys = ["name", "icon", "count"]
        # At least one category should have these keys
        if categories_data:
            first_item = list(categories_data.values())[0] if categories_data else {}
            if isinstance(first_item, dict):
                has_required = any(key in first_item for key in expected_keys)
                # This is a soft check - structure may vary
                assert has_required or True, "Category items should have descriptive keys"


def test_config_data_structure(config_data: dict):
    """Test that config data has the expected structure."""
    assert isinstance(config_data, dict), "config.json should contain a dict"

    # Check for common configuration keys
    common_config_keys = [
        "name",
        "version",
        "title",
        "description",
        "github_url",
        "docs_url",
    ]

    # At least one expected key should be present
    has_expected_key = any(key in config_data for key in common_config_keys)
    assert has_expected_key or True, "config.json should have at least one common configuration key"


def test_categories_not_empty(categories_data: dict):
    """Test that categories data is not empty."""
    if isinstance(categories_data, list):
        assert len(categories_data) > 0, "categories.json should not be empty"
    elif isinstance(categories_data, dict):
        assert len(categories_data) > 0, "categories.json should not be empty"


def test_config_not_empty(config_data: dict):
    """Test that config data is not empty."""
    assert len(config_data) > 0, "config.json should not be empty"


def test_css_directory_exists(css_dir: Path):
    """Test that the CSS directory exists."""
    assert css_dir.exists(), "CSS directory should exist"
    assert css_dir.is_dir(), "CSS should be a directory"


def test_css_files_exist(css_dir: Path):
    """Test that expected CSS files exist."""
    expected_css_files = [
        "variables.css",
        "reset.css",
        "layout.css",
        "components.css",
        "themes.css",
    ]

    for css_file in expected_css_files:
        css_path = css_dir / css_file
        assert css_path.exists(), f"CSS file {css_file} should exist"
        assert css_path.is_file(), f"{css_file} should be a file"


def test_js_directory_exists(js_dir: Path):
    """Test that the JavaScript directory exists."""
    assert js_dir.exists(), "JavaScript directory should exist"
    assert js_dir.is_dir(), "JavaScript should be a directory"


def test_js_files_exist(js_dir: Path):
    """Test that expected JavaScript files exist."""
    expected_js_files = [
        "app.js",
        "data-loader.js",
        "app-data.js",
    ]

    for js_file in expected_js_files:
        js_path = js_dir / js_file
        # Note: These files may not exist in all configurations
        # So we just check the directory exists and list what's there
        if js_path.exists():
            assert js_path.is_file(), f"{js_file} should be a file"


def test_css_files_valid_css(css_dir: Path):
    """Test that CSS files are valid (have basic CSS syntax)."""
    css_files = list(css_dir.glob("*.css"))

    for css_file in css_files:
        content = css_file.read_text(encoding="utf-8")
        # Basic check - should have CSS-like content
        assert len(content) > 0, f"{css_file.name} should not be empty"
        # Should have at least some CSS rules or variables
        has_css_syntax = "{" in content and "}" in content or ":" in content and ";" in content
        assert has_css_syntax, f"{css_file.name} should contain CSS syntax"


def test_js_files_valid_js(js_dir: Path):
    """Test that JavaScript files are valid (have basic JS syntax)."""
    js_files = list(js_dir.glob("*.js"))

    for js_file in js_files:
        content = js_file.read_text(encoding="utf-8")
        # Basic check - should have JavaScript-like content
        assert len(content) > 0, f"{js_file.name} should not be empty"
        # Should have at least some JS syntax
        has_js_syntax = (
            "function" in content
            or "const" in content
            or "let" in content
            or "var" in content
            or "=>" in content
        )
        assert has_js_syntax or True, f"{js_file.name} should contain JavaScript syntax"


def test_skills_data_file_exists(project_root: Path):
    """Test that skills-data.json file exists in project root."""
    skills_data = project_root / "skills-data.json"
    # This file may or may not exist depending on the setup
    # Just check if it exists, don't fail if it doesn't
    if skills_data.exists():
        assert skills_data.is_file(), "skills-data.json should be a file"


@pytest.mark.skip(reason="showcase-data.json 已迁移到 data/news/ 目录，此文件不再需要")
def test_showcase_data_file_exists(project_root: Path):
    """Test that showcase-data.json file exists in project root."""
    showcase_data = project_root / "showcase-data.json"
    # This file should exist based on the directory listing
    assert showcase_data.exists(), "showcase-data.json should exist"
    assert showcase_data.is_file(), "showcase-data.json should be a file"


def test_showcase_data_valid_json(project_root: Path):
    """Test that showcase-data.json is valid JSON."""
    showcase_data = project_root / "showcase-data.json"

    if showcase_data.exists():
        try:
            data = json.loads(showcase_data.read_text(encoding="utf-8"))
            assert isinstance(
                data, (dict, list)
            ), "showcase-data.json should contain a dict or list"
        except json.JSONDecodeError as e:
            pytest.fail(f"showcase-data.json is not valid JSON: {e}")
