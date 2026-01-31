"""HTML validation tests"""

from html.parser import HTMLParser


class LinkExtractor(HTMLParser):
    """Extract links from HTML"""

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for attr, value in attrs:
                if attr == "href":
                    self.links.append(value)
        elif tag == "link":
            for attr, value in attrs:
                if attr == "href":
                    self.links.append(value)
        elif tag == "img":
            for attr, value in attrs:
                if attr == "src":
                    self.links.append(value)
        elif tag == "script":
            for attr, value in attrs:
                if attr == "src":
                    self.links.append(value)


class StructureValidator(HTMLParser):
    """Validate HTML structure"""

    def __init__(self):
        super().__init__()
        self.has_doctype = False
        self.has_html = False
        self.has_head = False
        self.has_body = False
        self.has_title = False
        self.has_meta_charset = False
        self.has_meta_viewport = False
        self.errors = []

    def handle_decl(self, decl):
        if "DOCTYPE" in decl.upper():
            self.has_doctype = True

    def handle_starttag(self, tag, attrs):
        if tag == "html":
            self.has_html = True
        elif tag == "head":
            self.has_head = True
        elif tag == "body":
            self.has_body = True
        elif tag == "title":
            self.has_title = True
        elif tag == "meta":
            attr_dict = dict(attrs)
            if "charset" in attr_dict:
                self.has_meta_charset = True
            if attr_dict.get("name") == "viewport":
                self.has_meta_viewport = True


def extract_links(html_content: str) -> list[str]:
    """Extract all links from HTML content."""
    parser = LinkExtractor()
    parser.feed(html_content)
    return parser.links


def validate_html_structure(html_content: str) -> tuple[bool, list[str]]:
    """Validate basic HTML structure."""
    validator = StructureValidator()
    validator.feed(html_content)

    errors = []
    if not validator.has_doctype:
        errors.append("Missing DOCTYPE declaration")
    if not validator.has_html:
        errors.append("Missing <html> tag")
    if not validator.has_head:
        errors.append("Missing <head> tag")
    if not validator.has_body:
        errors.append("Missing <body> tag")
    if not validator.has_title:
        errors.append("Missing <title> tag")
    if not validator.has_meta_charset:
        errors.append("Missing charset meta tag")
    if not validator.has_meta_viewport:
        errors.append("Missing viewport meta tag")

    return len(errors) == 0, errors


def test_html_structure(index_html_content: str):
    """Test that HTML has proper structure."""
    is_valid, errors = validate_html_structure(index_html_content)
    error_message = "\n".join(errors)
    assert is_valid, f"HTML structure validation failed:\n{error_message}"


def test_html_has_required_sections(index_html_content: str):
    """Test that HTML has required sections."""
    required_sections = [
        "<header",
        '<section class="hero"',
        '<section id="news-section"',
        '<section id="skills-section"',
        "<footer",
    ]

    for section in required_sections:
        assert section in index_html_content, f"Missing required section: {section}"


def test_html_has_javascript_data(index_html_content: str):
    """Test that HTML contains the JavaScript data object."""
    required_data = [
        "const data = {",
        "news:",
        "skills:",
        "news_items:",
        "categories:",
    ]

    for data_item in required_data:
        assert data_item in index_html_content, f"Missing JavaScript data: {data_item}"


def test_html_has_required_elements(index_html_content: str):
    """Test that HTML has required interactive elements."""
    required_elements = [
        'class="tab-btn"',
        'class="filter-chip"',
        'class="skill-filter-btn"',
        'id="news-grid"',
        'id="skills-grid"',
        'onclick="switchTab',
        'onclick="filterNews',
        'onclick="filterSkills',
    ]

    for element in required_elements:
        assert element in index_html_content, f"Missing required element: {element}"


def test_html_has_css_variables(index_html_content: str):
    """Test that HTML defines CSS variables."""
    required_vars = [
        "--primary:",
        "--accent:",
        "--bg-color:",
        "--text-main:",
        "--card-bg:",
    ]

    for var in required_vars:
        assert var in index_html_content, f"Missing CSS variable: {var}"


def test_html_has_news_cards(index_html_content: str):
    """Test that HTML has news cards."""
    # Check for at least some static news cards in HTML
    assert 'class="unified-card"' in index_html_content, "Missing news cards"
    assert "GitHub Releases" in index_html_content, "Missing GitHub Releases news"
    assert "Product Hunt" in index_html_content, "Missing Product Hunt news"


def test_html_has_skill_filters(index_html_content: str):
    """Test that HTML has skill filter buttons."""
    required_filters = [
        "全部",
        "生产力",
        "AI/LLM",
        "开发",
        "智能家居",
        "浏览器自动化",
    ]

    for filter_name in required_filters:
        assert filter_name in index_html_content, f"Missing skill filter: {filter_name}"


def test_extract_links_count(index_html_content: str):
    """Test that we can extract links from HTML."""
    links = extract_links(index_html_content)
    # Should have many links (hrefs, images, etc.)
    assert len(links) > 30, f"Expected more than 30 links, found {len(links)}"


def test_html_has_required_functions(index_html_content: str):
    """Test that HTML has required JavaScript functions."""
    required_functions = [
        "function switchTab",
        "function filterNews",
        "function filterSkills",
        "function renderNews",
        "function renderSkills",
        "function copyText",
    ]

    for func in required_functions:
        assert func in index_html_content, f"Missing JavaScript function: {func}"


def test_html_encoding_declaration(index_html_content: str):
    """Test that HTML has proper encoding declaration."""
    assert 'charset="UTF-8"' in index_html_content, "Missing UTF-8 charset declaration"
    assert (
        '<meta charset="UTF-8">' in index_html_content
        or 'meta charset="UTF-8"' in index_html_content
    )


def test_html_responsive_design(index_html_content: str):
    """Test that HTML has responsive design elements."""
    assert 'name="viewport"' in index_html_content, "Missing viewport meta tag"
    assert "@media" in index_html_content, "Missing responsive CSS media queries"


def test_html_has_footer_links(index_html_content: str):
    """Test that HTML footer has required links."""
    assert (
        "https://github.com/moltbot/moltbot" in index_html_content
    ), "Missing GitHub link in footer"
    assert "https://docs.molt.bot" in index_html_content, "Missing docs link in footer"
