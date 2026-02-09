"""Unit tests for CSS variables validation"""

import pytest


@pytest.mark.unit
def test_css_directory_exists(css_dir):
    """Test that the CSS directory exists."""
    assert css_dir.exists(), "CSS directory should exist"
    assert css_dir.is_dir(), "CSS should be a directory"


@pytest.mark.unit
def test_css_files_exist(css_dir):
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


@pytest.mark.unit
def test_css_files_valid_css(css_dir):
    """Test that CSS files are valid (have basic CSS syntax)."""
    import pathlib

    css_files = list(css_dir.glob("*.css"))

    for css_file in css_files:
        content = css_file.read_text(encoding="utf-8")
        # Basic check - should have CSS-like content
        assert len(content) > 0, f"{css_file.name} should not be empty"
        # Should have at least some CSS rules or variables
        has_css_syntax = "{" in content and "}" in content or ":" in content and ";" in content
        assert has_css_syntax, f"{css_file.name} should contain CSS syntax"


@pytest.mark.unit
def test_html_has_css_variables(index_html_content):
    """Test that HTML has CSS variables (inline or external)."""
    # Check for external CSS file that contains variables
    has_external_css = (
        'href="css/variables.css"' in index_html_content
        or 'href="./css/variables.css"' in index_html_content
    )

    # Check for inline CSS variables
    required_vars = [
        "--primary:",
        "--accent:",
        "--bg-color:",
    ]
    has_inline_vars = any(var in index_html_content for var in required_vars)

    assert (
        has_external_css or has_inline_vars
    ), "CSS variables should be in external css/variables.css or inline"
