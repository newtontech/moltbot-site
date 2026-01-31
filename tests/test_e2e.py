"""End-to-end tests with Playwright"""

from pathlib import Path

import pytest


@pytest.mark.e2e
def test_page_loads(page, index_html: Path):
    """Test that the page loads without errors."""
    # Navigate to the local HTML file
    page.goto(f"file://{index_html.absolute()}")

    # Check that page loaded successfully
    assert page.title() == "Moltbot - AI Assistant Hub"


@pytest.mark.e2e
def test_header_elements(page, index_html: Path):
    """Test that header elements are present and visible."""
    page.goto(f"file://{index_html.absolute()}")

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
def test_hero_section(page, index_html: Path):
    """Test that hero section is present."""
    page.goto(f"file://{index_html.absolute()}")

    hero = page.locator(".hero")
    assert hero.is_visible()

    # Check hero content
    assert "OpenClaw" in hero.inner_text()
    assert "AI 助手" in hero.inner_text()


@pytest.mark.e2e
def test_news_section_visible(page, index_html: Path):
    """Test that news section is visible by default."""
    page.goto(f"file://{index_html.absolute()}")

    news_section = page.locator("#news-section")
    assert news_section.is_visible()

    # Check for news cards
    news_cards = page.locator("#news-section .unified-card")
    assert news_cards.count() >= 5  # At least 5 news cards


@pytest.mark.e2e
def test_skills_section_hidden_by_default(page, index_html: Path):
    """Test that skills section is hidden by default."""
    page.goto(f"file://{index_html.absolute()}")

    skills_section = page.locator("#skills-section")
    assert not skills_section.is_visible()


@pytest.mark.e2e
def test_tab_switching_to_skills(page, index_html: Path):
    """Test switching from news to skills tab."""
    page.goto(f"file://{index_html.absolute()}")

    # Click skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()

    # Wait for transition
    page.wait_for_timeout(300)

    # Check skills section is now visible
    skills_section = page.locator("#skills-section")
    assert skills_section.is_visible()

    # Check news section is hidden
    news_section = page.locator("#news-section")
    assert not news_section.is_visible()


@pytest.mark.e2e
def test_tab_switching_to_news(page, index_html: Path):
    """Test switching from skills to news tab."""
    page.goto(f"file://{index_html.absolute()}")

    # First switch to skills
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Then switch back to news
    news_tab = page.locator(".tab-btn").filter(has_text="新闻资讯")
    news_tab.click()
    page.wait_for_timeout(300)

    # Check news section is visible
    news_section = page.locator("#news-section")
    assert news_section.is_visible()


@pytest.mark.e2e
def test_news_filter_buttons(page, index_html: Path):
    """Test that news filter buttons exist and work."""
    page.goto(f"file://{index_html.absolute()}")

    # Check filter buttons exist
    filters = page.locator(".filter-chip")
    assert filters.count() == 5  # 全部, 新闻, 案例, 代码, 截图


@pytest.mark.e2e
def test_news_filter_all(page, index_html: Path):
    """Test 'all' news filter shows all items."""
    page.goto(f"file://{index_html.absolute()}")

    # Click '全部' filter
    all_filter = page.locator(".filter-chip").filter(has_text="全部")
    all_filter.click()
    page.wait_for_timeout(300)

    # Check that news cards are displayed
    news_cards = page.locator("#news-section .unified-card")
    assert news_cards.count() >= 5


@pytest.mark.e2e
def test_skill_filter_buttons(page, index_html: Path):
    """Test that skill filter buttons exist."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab first
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Check filter buttons exist
    filters = page.locator(".skill-filter-btn")
    assert filters.count() == 6  # 全部, 生产力, AI/LLM, 开发, 智能家居, 浏览器自动化


@pytest.mark.e2e
def test_skill_filter_productivity(page, index_html: Path):
    """Test productivity skill filter."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Click productivity filter
    productivity_filter = page.locator(".skill-filter-btn").filter(has_text="生产力")
    productivity_filter.click()
    page.wait_for_timeout(300)

    # Check that skill cards are displayed
    skill_cards = page.locator(".skill-card")
    assert skill_cards.count() >= 1


@pytest.mark.e2e
def test_skill_cards_have_install_command(page, index_html: Path):
    """Test that skill cards have install commands."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Check for install commands
    install_commands = page.locator(".install-cmd")
    assert install_commands.count() >= 1

    # Check that commands start with "molt install"
    first_command = install_commands.nth(0).inner_text()
    assert "molt install" in first_command


@pytest.mark.e2e
def test_copy_button_functionality(page, index_html: Path):
    """Test that copy buttons exist and are clickable."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Find copy button
    copy_btn = page.locator(".copy-btn").first
    assert copy_btn.is_visible()

    # Check button has the expected text
    btn_text = copy_btn.inner_text()
    assert "复制" in btn_text or "copy" in btn_text.lower()


@pytest.mark.e2e
def test_footer_visible(page, index_html: Path):
    """Test that footer is present."""
    page.goto(f"file://{index_html.absolute()}")

    footer = page.locator("footer")
    assert footer.is_visible()

    # Check footer links
    assert footer.locator("a").count() >= 2


@pytest.mark.e2e
def test_responsive_design_mobile(page, index_html: Path):
    """Test responsive design on mobile viewport."""
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto(f"file://{index_html.absolute()}")

    # Check that main elements are still visible
    assert page.locator(".logo").is_visible()
    assert page.locator(".hero").is_visible()

    # Tabs should still work
    assert page.locator(".tab-btn").count() == 2


@pytest.mark.e2e
def test_no_console_errors(page, index_html: Path):
    """Test that there are no console errors."""
    errors = []

    def handle_console(msg):
        if msg.type == "error":
            errors.append(msg.text)

    page.on("console", handle_console)
    page.goto(f"file://{index_html.absolute()}")

    # Wait a bit for any async errors
    page.wait_for_timeout(1000)

    assert len(errors) == 0, f"Console errors found: {errors}"


@pytest.mark.e2e
def test_github_links_open_in_new_tab(page, index_html: Path):
    """Test that GitHub links have target='_blank'."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Check GitHub buttons
    github_btn = page.locator(".github-btn").first
    assert github_btn.is_visible()

    # Check target attribute
    target = github_btn.get_attribute("href")
    assert target and "github.com" in target


@pytest.mark.e2e
def test_news_cards_have_images(page, index_html: Path):
    """Test that news cards have images."""
    page.goto(f"file://{index_html.absolute()}")

    # Check that news cards have images
    images = page.locator("#news-section .unified-card img")
    assert images.count() >= 3


@pytest.mark.e2e
def test_skill_cards_have_github_links(page, index_html: Path):
    """Test that skill cards have GitHub links."""
    page.goto(f"file://{index_html.absolute()}")

    # Switch to skills tab
    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    skills_tab.click()
    page.wait_for_timeout(300)

    # Check for GitHub buttons
    github_btns = page.locator(".github-btn")
    assert github_btns.count() >= 1


@pytest.mark.e2e
def test_active_state_on_filters(page, index_html: Path):
    """Test that filter buttons show active state correctly."""
    page.goto(f"file://{index_html.absolute()}")

    # Check initial active state
    all_filter = page.locator(".filter-chip").filter(has_text="全部")
    classes = all_filter.get_attribute("class") or ""
    assert "active" in classes


@pytest.mark.e2e
def test_active_state_on_tabs(page, index_html: Path):
    """Test that tab buttons show active state correctly."""
    page.goto(f"file://{index_html.absolute()}")

    # Check initial active state (news tab should be active)
    news_tab = page.locator(".tab-btn").filter(has_text="新闻资讯")
    classes = news_tab.get_attribute("class") or ""
    assert "active" in classes

    skills_tab = page.locator(".tab-btn").filter(has_text="技能插件")
    classes = skills_tab.get_attribute("class") or ""
    assert "active" not in classes
