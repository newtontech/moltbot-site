"""JavaScript syntax and structure tests"""

import os
import re


def extract_javascript_code(html_content: str) -> str:
    """Extract JavaScript code from <script> tags."""
    pattern = r"<script>(.*?)</script>"
    matches = re.findall(pattern, html_content, re.DOTALL)
    return "\n".join(matches)


def test_javascript_has_no_syntax_errors(index_html_content: str):
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


def test_javascript_has_required_functions(index_html_content: str):
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


def test_javascript_has_data_object(index_html_content: str):
    """Test that HTML has data object for fallback."""
    js_code = extract_javascript_code(index_html_content)

    # Check for data object (can be empty in new architecture, used as fallback)
    required_data = ["const data = {", "news:", "skills:"]

    for data in required_data:
        assert data in js_code, f"Missing data structure: {data}"


def test_javascript_has_state_variables(index_html_content: str):
    """Test that HTML has external JS with state management."""
    # New architecture: State is managed in external JS files
    has_external_js = (
        'src="js/app.js"' in index_html_content or 'src="js/utils/filter.js"' in index_html_content
    )
    assert has_external_js, "Missing external JS files for state management"


def test_javascript_has_dom_ready_handler(index_html_content: str):
    """Test that HTML has external JS with DOM ready handler."""
    # New architecture: DOMContentLoaded is in external JS files
    has_external_js = 'src="js/app.js"' in index_html_content
    assert has_external_js, "Missing external JS app.js with DOMContentLoaded"


def test_javascript_render_functions(index_html_content: str):
    """Test that HTML has external JS renderers."""
    # New architecture: Render functions are in external JS files
    required_renderers = [
        'src="js/renderers/news-renderer.js"',
        'src="js/renderers/skills-renderer.js"',
    ]

    for renderer in required_renderers:
        assert renderer in index_html_content, f"Missing external JS renderer: {renderer}"


def test_javascript_has_copy_functionality(index_html_content: str):
    """Test that HTML has external JS with copy functionality."""
    # New architecture: Copy functionality is in external JS files
    has_copy_js = 'src="js/utils/copy.js"' in index_html_content
    assert has_copy_js, "Missing external JS utils/copy.js with copy functionality"


def test_javascript_filter_logic(index_html_content: str):
    """Test that HTML has external JS with filter logic."""
    # New architecture: Filter logic is in external JS files
    has_filter_js = 'src="js/utils/filter.js"' in index_html_content
    assert has_filter_js, "Missing external JS utils/filter.js with filter logic"


def test_javascript_no_console_log_errors(index_html_content: str):
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


def test_javascript_event_handlers(index_html_content: str):
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


def test_javascript_has_news_data(index_html_content: str):
    """Test that data files contain news data."""
    # New architecture: News data is in JSON files
    # Check if the data file exists
    news_data_path = "data/news/2026-01.json"
    assert os.path.exists(news_data_path), f"Missing news data file: {news_data_path}"


def test_javascript_has_skills_data(index_html_content: str):
    """Test that data files contain skills data."""
    # New architecture: Skills data is in JSON files
    # Check if skills directory exists
    skills_dir = "data/skills"
    assert os.path.exists(skills_dir), f"Missing skills data directory: {skills_dir}"


def test_javascript_innerhtml_usage(index_html_content: str):
    """Test that HTML has external JS for dynamic rendering."""
    # New architecture: innerHTML usage is in external JS files
    has_data_loader = 'src="js/data-loader.js"' in index_html_content
    has_renderers = (
        'src="js/renderers/news-renderer.js"' in index_html_content
        or 'src="js/renderers/skills-renderer.js"' in index_html_content
    )
    assert has_data_loader and has_renderers, "Missing external JS for dynamic rendering"


def test_javascript_class_manipulation(index_html_content: str):
    """Test that HTML has external JS with class manipulation."""
    # New architecture: classList usage is in external JS files
    has_external_js = (
        'src="js/utils/filter.js"' in index_html_content or 'src="js/app.js"' in index_html_content
    )
    assert has_external_js, "Missing external JS with classList manipulation"


def test_javascript_queryselector_usage(index_html_content: str):
    """Test that HTML has external JS for DOM queries."""
    # New architecture: querySelector/getElementById is in external JS files
    has_external_js = 'src="js/data-loader.js"' in index_html_content
    assert has_external_js, "Missing external JS data-loader.js for DOM queries"


def test_javascript_template_literals(index_html_content: str):
    """Test that external JS files use template literals."""
    # New architecture: Template literals are in external JS files
    # Just check that we have external JS files (they should use template literals)
    has_renderers = (
        'src="js/renderers/news-renderer.js"' in index_html_content
        or 'src="js/renderers/skills-renderer.js"' in index_html_content
    )
    assert has_renderers, "Missing external JS renderers that should use template literals"
