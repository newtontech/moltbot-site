/**
 * News Renderer Module
 * Handles rendering and filtering of news cards
 */

/**
 * Generate badge HTML based on platform type
 * @param {string} platformType - The platform type ('中文' or '英文')
 * @param {string} platform - The platform name
 * @returns {string} Badge HTML
 */
function generateNewsBadge(platformType, platform) {
    const isEnglish = platformType === '英文';
    const isChinese = platformType === '中文';

    let backgroundStyle;
    if (isEnglish) {
        backgroundStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (isChinese) {
        backgroundStyle = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
    } else {
        backgroundStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    return `
        <div class="card-badge" style="background: ${backgroundStyle};">
            ${platform}
        </div>
    `;
}

/**
 * Generate HTML for a single news card
 * @param {Object} item - News item data
 * @returns {string} News card HTML
 */
function generateNewsCard(item) {
    const img = item.image || 'https://via.placeholder.com/420x220?text=OpenClaw';

    return `
        <a href="${item.source_url}" target="_blank" class="unified-card">
            ${generateNewsBadge(item.platform_type, item.platform)}
            <div class="card-media">
                <img src="${img}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="card-date">
                    <span class="icon">📅</span>
                    ${item.publish_date}
                </div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-summary">${item.summary}</p>
                <div class="card-footer">
                    <div class="tag-group">
                        ${(item.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}
                    </div>
                    <span class="action-btn">
                        查看详情 <span>→</span>
                    </span>
                </div>
            </div>
        </a>
    `;
}

/**
 * Check if a news item matches the current filter
 * @param {Object} item - News item data
 * @param {string} filter - Current filter ('all', 'news', 'showcase', 'code', 'screenshot')
 * @returns {boolean} True if item matches filter
 */
function matchesNewsFilter(item, filter) {
    if (filter === 'all') {
        return true;
    }

    const tags = item.tags || [];

    switch (filter) {
        case 'news':
            // English news with '发布' tag
            return item.platform_type.includes('英文') && tags.includes('发布');

        case 'showcase':
            // Items with '案例' or '体验' tags
            return tags.includes('案例') || tags.includes('体验');

        case 'code':
            // Items with '教程' or '开发' tags
            return tags.includes('教程') || tags.includes('开发');

        case 'screenshot':
            // Items with '截图' or '界面' tags
            return tags.includes('截图') || tags.includes('界面');

        default:
            return true;
    }
}

/**
 * Render empty state message
 * @returns {string} Empty state HTML
 */
function getEmptyStateHTML() {
    return '<div style="text-align: center; padding: 4rem; color: var(--text-secondary);">没有找到匹配的内容</div>';
}

/**
 * Main function to render news cards
 * @param {string} filter - Filter type ('all', 'news', 'showcase', 'code', 'screenshot')
 * @param {Object} newsData - News data object containing news_items array
 */
function renderNews(filter = 'all', newsData = null) {
    const grid = document.getElementById('news-grid');
    if (!grid) {
        console.error('News grid element not found');
        return;
    }

    // Use provided data or fallback to global data object
    const items = newsData?.news_items || (typeof data !== 'undefined' ? data.news?.news_items : []) || [];

    // Clear existing content
    grid.innerHTML = '';

    // Filter and render items
    let hasItems = false;

    items.forEach(item => {
        if (!matchesNewsFilter(item, filter)) {
            return;
        }

        hasItems = true;
        const cardHTML = generateNewsCard(item);

        // Create temporary container to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML.trim();
        grid.appendChild(tempDiv.firstChild);
    });

    // Show empty state if no items found
    if (!hasItems) {
        grid.innerHTML = getEmptyStateHTML();
    }
}

/**
 * Filter news items (wrapper for use with filter buttons)
 * @param {string} filter - Filter type
 * @param {HTMLElement} btn - Button element that triggered the filter
 */
function filterNews(filter, btn) {
    // Update active button state
    document.querySelectorAll('#news-section .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    if (btn) {
        btn.classList.add('active');
    }

    // Re-render with new filter
    renderNews(filter);
}

// Export functions for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderNews,
        filterNews,
        generateNewsCard,
        generateNewsBadge,
        matchesNewsFilter
    };
}
