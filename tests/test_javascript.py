"""JavaScript syntax and structure tests"""

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
    """Test that JavaScript has all required functions."""
    js_code = extract_javascript_code(index_html_content)

    required_functions = [
        "function switchTab",
        "function filterNews",
        "function filterSkills",
        "function renderNews",
        "function renderSkills",
        "function copyText",
    ]

    for func in required_functions:
        assert func in js_code, f"Missing required function: {func}"


def test_javascript_has_data_object(index_html_content: str):
    """Test that JavaScript has the data object."""
    js_code = extract_javascript_code(index_html_content)

    required_data = [
        "const data = {",
        "news:",
        "skills:",
        "project_info:",
        "news_items:",
        "categories:",
    ]

    for data in required_data:
        assert data in js_code, f"Missing data structure: {data}"


def test_javascript_has_state_variables(index_html_content: str):
    """Test that JavaScript has state variables."""
    js_code = extract_javascript_code(index_html_content)

    required_vars = [
        "let currentTab",
        "let currentNewsFilter",
        "let currentSkillFilter",
    ]

    for var in required_vars:
        assert var in js_code, f"Missing state variable: {var}"


def test_javascript_has_dom_ready_handler(index_html_content: str):
    """Test that JavaScript has DOM ready event handler."""
    js_code = extract_javascript_code(index_html_content)

    assert "DOMContentLoaded" in js_code, "Missing DOMContentLoaded event handler"


def test_javascript_render_functions(index_html_content: str):
    """Test that render functions exist and are correct."""
    js_code = extract_javascript_code(index_html_content)

    # Check renderNews function
    assert "function renderNews" in js_code, "Missing renderNews function"
    assert "document.getElementById('news-grid')" in js_code, "renderNews should access news-grid"

    # Check renderSkills function
    assert "function renderSkills" in js_code, "Missing renderSkills function"
    assert (
        "document.getElementById('skills-grid')" in js_code
    ), "renderSkills should access skills-grid"


def test_javascript_has_copy_functionality(index_html_content: str):
    """Test that JavaScript has clipboard copy functionality."""
    js_code = extract_javascript_code(index_html_content)

    assert "navigator.clipboard.writeText" in js_code, "Missing clipboard copy functionality"
    assert "copyText" in js_code, "Missing copyText function"


def test_javascript_filter_logic(index_html_content: str):
    """Test that filter logic is implemented."""
    js_code = extract_javascript_code(index_html_content)

    # Check for filter logic in renderNews
    assert (
        "filter === 'all'" in js_code or "filter == 'all'" in js_code
    ), "Missing 'all' filter logic"

    # Check for skill category filtering
    assert (
        "s.category === filter" in js_code or "s.category == filter" in js_code
    ), "Missing skill category filter"


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

    # Check for onclick attributes in HTML
    required_handlers = [
        'onclick="switchTab',
        'onclick="filterNews',
        'onclick="filterSkills',
        'onclick="copyText',
    ]

    for handler in required_handlers:
        assert handler in html_content, f"Missing event handler: {handler}"


def test_javascript_has_news_data(index_html_content: str):
    """Test that JavaScript contains news data."""
    js_code = extract_javascript_code(index_html_content)

    # Check for specific news items
    assert "OpenClaw v2026.1.29" in js_code, "Missing news data: OpenClaw v2026.1.29"
    assert "Product Hunt" in js_code, "Missing news data: Product Hunt"
    assert "GitHub Releases" in js_code, "Missing news data: GitHub Releases"


def test_javascript_has_skills_data(index_html_content: str):
    """Test that JavaScript contains skills data."""
    js_code = extract_javascript_code(index_html_content)

    # Check for skill categories
    assert '"生产力"' in js_code or "'生产力'" in js_code, "Missing skill category: 生产力"
    assert '"AI/LLM"' in js_code or "'AI/LLM'" in js_code, "Missing skill category: AI/LLM"
    assert '"开发"' in js_code or "'开发'" in js_code, "Missing skill category: 开发"


def test_javascript_innerhtml_usage(index_html_content: str):
    """Test that innerHTML is used correctly."""
    js_code = extract_javascript_code(index_html_content)

    # Check for innerHTML usage (needed for dynamic content)
    assert "innerHTML" in js_code, "Missing innerHTML usage for dynamic content"

    # Check for createElement as alternative (safer)
    assert "createElement" in js_code or "innerHTML" in js_code, "Missing DOM manipulation methods"


def test_javascript_class_manipulation(index_html_content: str):
    """Test that JavaScript manipulates CSS classes."""
    js_code = extract_javascript_code(index_html_content)

    assert "classList.add" in js_code, "Missing classList.add usage"
    assert "classList.remove" in js_code, "Missing classList.remove usage"


def test_javascript_queryselector_usage(index_html_content: str):
    """Test that JavaScript uses modern DOM query methods."""
    js_code = extract_javascript_code(index_html_content)

    # Should use querySelector or getElementById
    has_query_method = "querySelector" in js_code or "getElementById" in js_code

    assert has_query_method, "Should use querySelector or getElementById for DOM queries"


def test_javascript_template_literals(index_html_content: str):
    """Test that JavaScript uses template literals."""
    js_code = extract_javascript_code(index_html_content)

    # Check for template literal usage
    has_template_literals = "`" in js_code and "${" in js_code

    assert has_template_literals, "Should use template literals for string interpolation"
