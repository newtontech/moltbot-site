"""Link validation tests"""

import re
from urllib.parse import urlparse

import pytest


def extract_all_links(html_content: str) -> list[dict]:
    """Extract all links from HTML content with context."""
    links = []

    # Extract href attributes from <a> tags
    href_pattern = r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>'
    for match in re.finditer(href_pattern, html_content):
        url = match.group(1)
        links.append({"url": url, "type": "anchor", "context": match.group(0)[:100]})

    # Extract src attributes from <img> tags
    src_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
    for match in re.finditer(src_pattern, html_content):
        url = match.group(1)
        links.append({"url": url, "type": "image", "context": match.group(0)[:100]})

    # Extract href from <link> tags
    link_pattern = r'<link[^>]+href=["\']([^"\']+)["\'][^>]*>'
    for match in re.finditer(link_pattern, html_content):
        url = match.group(1)
        links.append({"url": url, "type": "link", "context": match.group(0)[:100]})

    return links


def is_valid_url(url: str) -> bool:
    """Check if URL has valid format."""
    if not url or url.strip() == "":
        return False

    # Skip anchors and javascript links
    if url.startswith("#") or url.startswith("javascript:"):
        return True

    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc]) or result.scheme == ""
    except Exception:
        return False


def categorize_link(url: str) -> str:
    """Categorize link by type."""
    if url.startswith("#"):
        return "anchor"
    if url.startswith("http://") or url.startswith("https://"):
        return "external"
    if url.startswith("/"):
        return "internal_absolute"
    if url.startswith("mailto:"):
        return "mailto"
    if url.startswith("javascript:"):
        return "javascript"
    return "relative"


@pytest.mark.slow
def test_external_links_format(index_html_content: str):
    """Test that external links have valid format."""
    links = extract_all_links(index_html_content)

    external_links = [link for link in links if categorize_link(link["url"]) == "external"]

    invalid_links = []
    for link in external_links:
        if not is_valid_url(link["url"]):
            invalid_links.append(link)

    if invalid_links:
        error_msg = "\n".join([f"  - {link['url']}" for link in invalid_links[:10]])
        assert False, f"Found invalid external links:\n{error_msg}"


def test_internal_links_format(index_html_content: str):
    """Test that internal links have valid format."""
    links = extract_all_links(index_html_content)

    internal_links = [
        link
        for link in links
        if categorize_link(link["url"]) in ("anchor", "internal_absolute", "relative")
    ]

    # All internal links should be valid strings
    invalid_links = [
        link for link in internal_links if not link["url"] or link["url"].strip() == ""
    ]

    assert len(invalid_links) == 0, "Found empty internal links"


def test_no_broken_anchor_links(index_html_content: str):
    """Test that all anchor links reference existing IDs."""
    links = extract_all_links(index_html_content)

    anchor_links = [link["url"] for link in links if categorize_link(link["url"]) == "anchor"]

    # Extract all IDs from the HTML
    id_pattern = r'id=["\']([^"\']+)["\']'
    all_ids = set(re.findall(id_pattern, index_html_content))

    # Remove the leading # from anchor links
    anchor_ids = {link[1:] for link in anchor_links if link != "#"}

    missing_ids = anchor_ids - all_ids

    if missing_ids:
        assert False, f"Anchor links reference missing IDs: {missing_ids}"


def test_image_links_format(index_html_content: str):
    """Test that image links have valid format."""
    links = extract_all_links(index_html_content)

    image_links = [link for link in links if link["type"] == "image"]

    # Check that image URLs are valid
    invalid_images = []
    for link in image_links:
        url = link["url"]
        if not url or url.strip() == "":
            invalid_images.append(link)
        elif not (url.startswith("http://") or url.startswith("https://") or url.startswith("/")):
            # Only check if it looks like a URL (not data URLs, blob URLs, or template literals)
            if (
                not url.startswith("data:")
                and not url.startswith("blob:")
                and not url.startswith("${")
            ):
                invalid_images.append(link)

    if invalid_images:
        error_msg = "\n".join([f"  - {link['url']}" for link in invalid_images[:10]])
        assert False, f"Found invalid image links:\n{error_msg}"


def test_has_required_external_links(index_html_content: str):
    """Test that HTML has required external links."""
    required_links = [
        "https://github.com/moltbot/moltbot",
        "https://docs.molt.bot",
        "https://fonts.googleapis.com",
    ]

    for link in required_links:
        assert link in index_html_content, f"Missing required external link: {link}"


def test_no_placeholder_links(index_html_content: str):
    """Test that there are no obvious placeholder links."""
    placeholder_patterns = [
        "http://example.com",
        "https://example.com",
        "http://localhost",
        "http://127.0.0.1",
        "http://placeholder",
        "#TODO",
        "#FIXME",
    ]

    links = extract_all_links(index_html_content)
    found_placeholders = []

    for link in links:
        url = link["url"]
        for pattern in placeholder_patterns:
            if pattern.lower() in url.lower():
                found_placeholders.append(url)
                break

    if found_placeholders:
        error_msg = "\n".join([f"  - {url}" for url in found_placeholders])
        assert False, f"Found placeholder links:\n{error_msg}"


def test_github_links_format(index_html_content: str):
    """Test that GitHub links have proper format."""
    github_pattern = r"https://github\.com/[\w\-]+(?:/[\w\-]+)?"

    # Find all GitHub links (only full https URLs)
    github_links = re.findall(github_pattern, index_html_content)

    # Check basic format
    for link in github_links:
        assert link.startswith("https://github.com/"), f"Invalid GitHub link format: {link}"
        parts = link[len("https://github.com/") :].split("/")
        assert len(parts) >= 1, f"GitHub link missing username/org: {link}"


def test_mailto_links_format(index_html_content: str):
    """Test that mailto links have proper format."""
    mailto_pattern = r'mailto:([^\s"\'<>]+)'

    mailto_links = re.findall(mailto_pattern, index_html_content)

    for email in mailto_links:
        assert "@" in email, f"Invalid email in mailto link: {email}"
        assert "." in email.split("@")[1], f"Invalid domain in mailto link: {email}"


def test_link_count_minimum(index_html_content: str):
    """Test that HTML has minimum number of links."""
    links = extract_all_links(index_html_content)

    # Should have at least 20 links total
    assert len(links) >= 20, f"Expected at least 20 links, found {len(links)}"


def test_has_css_resource_links(index_html_content: str):
    """Test that HTML has CSS resource links (Google Fonts)."""
    assert "fonts.googleapis.com" in index_html_content, "Missing Google Fonts link"
    assert "fonts.gstatic.com" in index_html_content, "Missing Google Fonts preconnect link"


def test_news_card_links(index_html_content: str):
    """Test that news cards have proper links."""
    # Check for news card links to external sources
    external_news_sources = [
        "github.com/openclaw",
        "producthunt.com",
        "reddit.com",
        "dev.to",
        "medium.com",
        "infoq.cn",
        "oschina.net",
        "juejin.cn",
        "zhihu.com",
        "sspai.com",
        "v2ex.com",
        "36kr.com",
        "segmentfault.com",
    ]

    # At least some of these should be present
    found_sources = [source for source in external_news_sources if source in index_html_content]

    assert len(found_sources) > 0, "No external news source links found in HTML"


def test_skill_card_github_links(index_html_content: str):
    """Test that skill cards have GitHub links."""
    # Find github.com links in the skills section
    github_links = re.findall(r"https://github\.com/[\w\-/]+", index_html_content)

    # Should have at least some GitHub links for skills
    assert len(github_links) >= 5, f"Expected at least 5 GitHub links, found {len(github_links)}"
