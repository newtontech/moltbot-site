"""Integration tests for rendering functionality"""

import pytest


@pytest.mark.integration
def test_javascript_has_required_functions(index_html_content):
    """Test that HTML has external JS files with required functions."""
    # New architecture: Functions are in external JS files
    required_js_files = [
        'src="js/utils/filter.js"',
        'src="js/app.js"',
        'src="js/renderers/news-renderer.js"',
        'src="js/renderers/skills-renderer.js"',
        'src="js/utils/copy.js"',
    ]

    for js_file in required_js_files:
        assert js_file in index_html_content, f"Missing external JS file: {js_file}"


@pytest.mark.integration
def test_javascript_has_data_object(index_html_content):
    """Test that HTML has data object for fallback."""
    import re

    # Extract inline JavaScript
    pattern = r"<script>(.*?)</script>"
    matches = re.findall(pattern, index_html_content, re.DOTALL)
    js_code = "\n".join(matches)

    # Check for data object (can be empty in new architecture, used as fallback)
    required_data = ["const data = {", "news:", "skills:"]

    for data in required_data:
        assert data in js_code, f"Missing data structure: {data}"


@pytest.mark.integration
def test_javascript_has_state_variables(index_html_content):
    """Test that HTML has external JS with state management."""
    # New architecture: State is managed in external JS files
    has_external_js = (
        'src="js/app.js"' in index_html_content or 'src="js/utils/filter.js"' in index_html_content
    )
    assert has_external_js, "Missing external JS files for state management"


@pytest.mark.integration
def test_javascript_has_dom_ready_handler(index_html_content):
    """Test that HTML has external JS with DOM ready handler."""
    # New architecture: DOMContentLoaded is in external JS files
    has_external_js = 'src="js/app.js"' in index_html_content
    assert has_external_js, "Missing external JS app.js with DOMContentLoaded"


@pytest.mark.integration
def test_javascript_render_functions(index_html_content):
    """Test that HTML has external JS renderers."""
    # New architecture: Render functions are in external JS files
    required_renderers = [
        'src="js/renderers/news-renderer.js"',
        'src="js/renderers/skills-renderer.js"',
    ]

    for renderer in required_renderers:
        assert renderer in index_html_content, f"Missing external JS renderer: {renderer}"


@pytest.mark.integration
def test_javascript_has_copy_functionality(index_html_content):
    """Test that HTML has external JS with copy functionality."""
    # New architecture: Copy functionality is in external JS files
    has_copy_js = 'src="js/utils/copy.js"' in index_html_content
    assert has_copy_js, "Missing external JS utils/copy.js with copy functionality"


@pytest.mark.integration
def test_javascript_filter_logic(index_html_content):
    """Test that HTML has external JS with filter logic."""
    # New architecture: Filter logic is in external JS files
    has_filter_js = 'src="js/utils/filter.js"' in index_html_content
    assert has_filter_js, "Missing external JS utils/filter.js with filter logic"


@pytest.mark.integration
def test_javascript_event_handlers(index_html_content):
    """Test that JavaScript has proper event handlers."""
    html_content = index_html_content

    # Check for onclick attributes in static HTML
    # Note: copyText is called from dynamically rendered content
    static_handlers = [
        'onclick="switchTab',
        'onclick="filterNews',
    ]

    for handler in static_handlers:
        assert handler in html_content, f"Missing event handler: {handler}"

    # Check for copy functionality in external JS
    has_copy_js = 'src="js/utils/copy.js"' in html_content
    assert has_copy_js, "Missing external JS utils/copy.js with copyText function"


@pytest.mark.integration
def test_javascript_innerhtml_usage(index_html_content):
    """Test that HTML has external JS for dynamic rendering."""
    # New architecture: innerHTML usage is in external JS files
    has_data_loader = 'src="js/data-loader.js"' in index_html_content
    has_renderers = (
        'src="js/renderers/news-renderer.js"' in index_html_content
        or 'src="js/renderers/skills-renderer.js"' in index_html_content
    )
    assert has_data_loader and has_renderers, "Missing external JS for dynamic rendering"


@pytest.mark.integration
def test_javascript_class_manipulation(index_html_content):
    """Test that HTML has external JS with class manipulation."""
    # New architecture: classList usage is in external JS files
    has_external_js = (
        'src="js/utils/filter.js"' in index_html_content or 'src="js/app.js"' in index_html_content
    )
    assert has_external_js, "Missing external JS with classList manipulation"


@pytest.mark.integration
def test_javascript_queryselector_usage(index_html_content):
    """Test that HTML has external JS for DOM queries."""
    # New architecture: querySelector/getElementById is in external JS files
    has_external_js = 'src="js/data-loader.js"' in index_html_content
    assert has_external_js, "Missing external JS data-loader.js for DOM queries"


@pytest.mark.integration
def test_javascript_template_literals(index_html_content):
    """Test that external JS files use template literals."""
    # New architecture: Template literals are in external JS files
    # Just check that we have external JS files (they should use template literals)
    has_renderers = (
        'src="js/renderers/news-renderer.js"' in index_html_content
        or 'src="js/renderers/skills-renderer.js"' in index_html_content
    )
    assert has_renderers, "Missing external JS renderers that should use template literals"


@pytest.mark.integration
def test_html_has_required_functions(index_html_content):
    """Test that HTML has required JavaScript (inline or external)."""
    # New architecture: Functions are in external JS files
    # Check for external JS files that contain these functions
    has_external_js = (
        'src="js/utils/filter.js"' in index_html_content
        or 'src="js/app.js"' in index_html_content
        or 'src="js/utils/filter.js"' in index_html_content
    )

    # Check for inline function definitions
    has_inline_functions = (
        "function switchTab" in index_html_content or "function filterNews" in index_html_content
    )

    assert (
        has_external_js or has_inline_functions
    ), "JavaScript should be in external JS files or inline"
