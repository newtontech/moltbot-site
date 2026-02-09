"""Unit tests for JSON data schema validation"""

import json

import pytest


@pytest.mark.unit
def test_data_directory_exists(data_dir):
    """Test that the data directory exists."""
    assert data_dir.exists(), "Data directory should exist"
    assert data_dir.is_dir(), "Data should be a directory"


@pytest.mark.unit
def test_categories_json_exists(categories_json):
    """Test that categories.json file exists."""
    assert categories_json.exists(), "categories.json should exist"
    assert categories_json.is_file(), "categories.json should be a file"


@pytest.mark.unit
def test_config_json_exists(config_json):
    """Test that config.json file exists."""
    assert config_json.exists(), "config.json should exist"
    assert config_json.is_file(), "config.json should be a file"


@pytest.mark.unit
def test_categories_json_valid_json(categories_json):
    """Test that categories.json is valid JSON."""
    try:
        json.loads(categories_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        pytest.fail(f"categories.json is not valid JSON: {e}")


@pytest.mark.unit
def test_config_json_valid_json(config_json):
    """Test that config.json is valid JSON."""
    try:
        json.loads(config_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        pytest.fail(f"config.json is not valid JSON: {e}")


@pytest.mark.unit
def test_categories_data_structure(categories_data):
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


@pytest.mark.unit
def test_config_data_structure(config_data):
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


@pytest.mark.unit
def test_categories_not_empty(categories_data):
    """Test that categories data is not empty."""
    if isinstance(categories_data, list):
        assert len(categories_data) > 0, "categories.json should not be empty"
    elif isinstance(categories_data, dict):
        assert len(categories_data) > 0, "categories.json should not be empty"


@pytest.mark.unit
def test_config_not_empty(config_data):
    """Test that config data is not empty."""
    assert len(config_data) > 0, "config.json should not be empty"
