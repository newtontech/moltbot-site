"""End-to-end tests with Playwright"""

import pytest


@pytest.mark.e2e
def test_page_loads(http_server, page):
    """Test that the page loads without errors."""
    url = http_server[0]
    page.goto(url)

    # Check that page loaded successfully
    assert page.title() == "Moltbot - AI Assistant Hub"


@pytest.mark.e2e
def test_header_elements(http_server, page):
    """Test that header elements are present and visible."""
    url = http_server[0]
    page.goto(url)

    # Check logo
    logo = page.locator(".logo")
    assert logo.is_visible()
    assert "Moltbot" in logo.inner_text()

    # Check tabs
    tabs = page.locator(".tab-btn")
    assert tabs.count() == 2

    # Check tab text
    assert "新闻资讯" in tabs.nth(0).inner_text()
    assert "技能插件" in tabs.nth(1).inner_text()


@pytest.mark.e2e
def test_hero_section(http_server, page):
    """Test that hero section is present."""
    url = http_server[0]
    page.goto(url)

    hero = page.locator(".hero")
    assert hero.is_visible()

    # Check hero content
    assert "OpenClaw" in hero.inner_text()
    assert "AI 助手" in hero.inner_text()


@pytest.mark.e2e
def test_news_section_visible(http_server, page):
    """Test that news section is visible by default and contains data."""
    url = http_server[0]
    page.goto(url)

    news_section = page.locator("#news-section")
    assert news_section.is_visible()

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check for news cards
    news_cards = page.locator("#news-section .unified-card")

    # Wait for cards to appear
    try:
        news_cards.wait_for(state="visible", timeout=5000)
    except:
        pass

    # Check for at least 10 news cards (with actual data loaded)
    card_count = news_cards.count()
    assert card_count >= 10, f"Expected at least 10 news cards, got {card_count}"


@pytest.mark.e2e
def test_skills_section_hidden_by_default(http_server, page):
    """Test that skills section is hidden by default."""
    url = http_server[0]
    page.goto(url)

    skills_section = page.locator("#skills-section")
    assert not skills_section.is_visible()


@pytest.mark.e2e
def test_tab_switching_to_skills(http_server, page):
    """Test switching from news to skills tab."""
    url = http_server[0]
    page.goto(url)

    # Click skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()

    # Wait for skills section to become visible
    skills_section = page.locator("#skills-section")
    skills_section.wait_for(state="visible", timeout=2000)

    # Verify skills section is visible
    assert skills_section.is_visible()


@pytest.mark.e2e
def test_skills_data_loaded(http_server, page):
    """Test that skills data is loaded correctly."""
    url = http_server[0]
    page.goto(url)

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check for skill cards
    skill_cards = page.locator("#skills-section .skill-card")

    # Wait for cards to appear
    try:
        skill_cards.wait_for(state="visible", timeout=5000)
    except:
        pass

    # Check for at least 5 skill cards
    card_count = skill_cards.count()
    assert card_count >= 5, f"Expected at least 5 skill cards, got {card_count}"


@pytest.mark.e2e
def test_news_cards_have_images(http_server, page):
    """Test that news cards have images."""
    url = http_server[0]
    page.goto(url)

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check for images in news cards
    images = page.locator("#news-section .unified-card .card-media img")

    # Wait for images to appear
    try:
        images.wait_for(state="visible", timeout=5000)
    except:
        pass

    # Check for at least 10 images
    image_count = images.count()
    assert image_count >= 10, f"Expected at least 10 images, got {image_count}"


@pytest.mark.e2e
def test_news_filters(http_server, page):
    """Test that news filters work correctly."""
    url = http_server[0]
    page.goto(url)

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Click "新闻" filter
    news_filter = page.locator("#news-section .filter-chip").filter(has_text="新闻")
    news_filter.click()

    # Wait for filtering to apply
    page.wait_for_timeout(1000)

    # Check that some cards are still visible
    news_cards = page.locator("#news-section .unified-card")
    card_count = news_cards.count()

    assert card_count > 0, "Expected some news cards after filtering"


@pytest.mark.e2e
def test_skill_filters(http_server, page):
    """Test that skill filters work correctly."""
    url = http_server[0]
    page.goto(url)

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check for skill filter buttons
    filter_buttons = page.locator("#skills-section .skill-filter-btn")

    # Wait for filters to render
    try:
        filter_buttons.wait_for(state="visible", timeout=5000)
    except:
        pass

    # Check for at least 2 filter buttons (All + at least 1 category)
    button_count = filter_buttons.count()
    assert button_count >= 2, f"Expected at least 2 filter buttons, got {button_count}"


@pytest.mark.e2e
def test_skill_cards_have_github_links(http_server, page):
    """Test that skill cards have GitHub links."""
    url = http_server[0]
    page.goto(url)

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check for GitHub links in skill cards
    github_links = page.locator("#skills-section .skill-card a[href*='github.com']")

    # Wait for links to appear
    try:
        github_links.wait_for(state="visible", timeout=5000)
    except:
        pass

    # Check for at least 5 GitHub links
    link_count = github_links.count()
    assert link_count >= 5, f"Expected at least 5 GitHub links, got {link_count}"


@pytest.mark.e2e
def test_github_links_open_in_new_tab(http_server, page):
    """Test that GitHub links open in new tab."""
    url = http_server[0]
    page.goto(url)

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Get all GitHub links
    github_links = page.locator("#skills-section .skill-card a[href*='github.com']")

    # Check that all links have target="_blank"
    for i in range(min(github_links.count(), 5)):
        link = github_links.nth(i)
        target = link.get_attribute("target")
        assert target == "_blank", f"GitHub link should open in new tab, got {target}"


@pytest.mark.e2e
def test_console_no_errors(http_server, page):
    """Test that there are no console errors."""
    url = http_server[0]
    page.goto(url)

    # Wait for data to load
    page.wait_for_timeout(3000)

    # Check console for errors
    errors = []
    page.on("console", lambda msg: errors.append(msg) if msg.type == "error" else None)

    page.wait_for_timeout(1000)

    # Should have no console errors (or only expected ones)
    error_count = len([e for e in errors if "Failed to load" not in e.text])
    assert error_count == 0, f"Found {error_count} console errors"
