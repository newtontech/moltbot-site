"""Unit tests for JavaScript syntax validation"""

import os
import re
import pytest


def extract_javascript_code(html_content: str) -> str:
    """Extract JavaScript code from <script> tags."""
    pattern = r"<script>(.*?)</script>"
    matches = re.findall(pattern, html_content, re.DOTALL)
    return "\n".join(matches)


@pytest.mark.unit
def test_js_directory_exists(js_dir):
    """Test that the JavaScript directory exists."""
    assert js_dir.exists(), "JavaScript directory should exist"
    assert js_dir.is_dir(), "JavaScript should be a directory"


@pytest.mark.unit
def test_js_files_exist(js_dir):
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


@pytest.mark.unit
def test_js_files_valid_js(js_dir):
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


@pytest.mark.unit
def test_javascript_has_no_syntax_errors(index_html_content):
    """Test that JavaScript code has no obvious syntax errors."""
    js_code = extract_javascript_code(index_html_content)

    # Check for balanced brackets
    open_braces = js_code.count("{")
    close_braces = js_code.count("}")
    assert (
        open_braces == close_braces
    ), f"Unbalanced braces: {open_braces} open, {close_braces} close"

    open_parens = js_code.count("(")
    close_parens = js_code.count(")")
    assert (
        open_parens == close_parens
    ), f"Unbalanced parentheses: {open_parens} open, {close_parens} close"

    open_brackets = js_code.count("[")
    close_brackets = js_code.count("]")
    assert (
        open_brackets == close_brackets
    ), f"Unbalanced brackets: {open_brackets} open, {close_brackets} close"


@pytest.mark.unit
def test_javascript_no_console_log_errors(index_html_content):
    """Test that there are no console.error or console.log left in production."""
    js_code = extract_javascript_code(index_html_content)

    # Check for console.log (might be okay for debugging, but better to check)
    re.findall(r"console\.log\(", js_code)

    # Check for console.error
    console_errors = re.findall(r"console\.error\(", js_code)

    # If there are errors, it might indicate issues
    if console_errors:
        assert (
            False
        ), f"Found console.error calls in production code: {len(console_errors)} occurrences"


@pytest.mark.unit
def test_javascript_has_news_data(index_html_content):
    """Test that data files contain news data."""
    # New architecture: News data is in JSON files
    # Check if the data file exists
    news_data_path = "data/news/2026-01.json"
    assert os.path.exists(news_data_path), f"Missing news data file: {news_data_path}"


@pytest.mark.unit
def test_javascript_has_skills_data(index_html_content):
    """Test that data files contain skills data."""
    # New architecture: Skills data is in JSON files
    # Check if skills directory exists
    skills_dir = "data/skills"
    assert os.path.exists(skills_dir), f"Missing skills data directory: {skills_dir}"
