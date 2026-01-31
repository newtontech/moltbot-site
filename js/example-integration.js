/**
 * Example Integration
 * Shows how to integrate the data loader with the existing HTML
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing app with data loader...');

    // Show loading state
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        skillsGrid.innerHTML = '<div style="text-align: center; padding: 2rem;">⏳ 加载中...</div>';
    }

    try {
        // Load all data
        console.log('Loading data...');
        const data = await DataAPI.load();
        console.log('Data loaded:', {
            newsCount: data.news.count,
            skillsCount: data.skills.count
        });

        // Subscribe to future updates
        DataAPI.subscribe((event, newData) => {
            console.log('Data event:', event);
            if (event === 'loaded') {
                console.log('Data refreshed');
            }
        });

        // Render skills (keep existing render function)
        renderSkillsFromData(data.skills.skills);

        // Update category counts
        updateCategoryCounts(data.skills.categories);

        console.log('App initialized successfully');

    } catch (error) {
        console.error('Failed to initialize app:', error);

        // Show error message
        if (skillsGrid) {
            skillsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    ❌ 加载失败: ${error.message}
                    <br><br>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        🔄 重试
                    </button>
                </div>
            `;
        }
    }
});

/**
 * Render skills from loaded data
 * (Keep this similar to existing renderSkills function)
 */
function renderSkillsFromData(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    grid.innerHTML = '';

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';

        const featureList = (skill.features || []).map(f => `<li>${f}</li>`).join('');

        card.innerHTML = `
            <div class="skill-header">
                <span class="skill-icon">${skill.icon}</span>
                <div class="skill-title-group">
                    <span class="skill-title-zh">${skill.title}</span>
                    <span class="skill-title-en">${skill.name}</span>
                </div>
            </div>
            <p class="skill-desc">${skill.description}</p>
            <ul class="skill-features">
                ${featureList}
            </ul>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                💡 使用案例：${skill.use_case}
            </p>
            <div class="skill-meta">
                <div class="skill-author">👤 ${skill.author}</div>
                <div class="skill-stars">${skill.stars ? '⭐ ' + skill.stars : ''}</div>
            </div>
            <div class="skill-actions">
                <a href="${skill.github_url}" target="_blank" class="github-btn">
                    🔗 GitHub
                </a>
                <div class="install-box">
                    <code class="install-cmd">${skill.install_cmd}</code>
                    <button class="copy-btn" onclick="copyText('${skill.install_cmd}', this)">📋 复制</button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    if (grid.children.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 4rem; color: var(--text-secondary);">没有找到匹配的技能插件</div>';
    }
}

/**
 * Update category filter counts
 */
function updateCategoryCounts(categories) {
    Object.entries(categories).forEach(([id, info]) => {
        const button = document.querySelector(`.skill-filter-btn[data-category="${info.name}"]`);
        if (button) {
            const countSpan = button.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = info.count;
            }
        }
    });
}

/**
 * Filter skills using data loader
 * (Enhanced version of existing filterSkills)
 */
async function filterSkillsEnhanced(category, btn) {
    const skills = DataAPI.getSkills({
        category: category
    });

    // Update active button
    document.querySelectorAll('.skill-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Render filtered skills
    renderSkillsFromData(skills);
}

/**
 * Filter news using data loader
 * (Enhanced version of existing filterNews)
 */
async function filterNewsEnhanced(filter, btn) {
    let filters = {};

    // Map filter type to filter criteria
    if (filter === 'all') {
        filters = {};
    } else if (filter === 'news') {
        filters = { platformType: '英文' };
    } else if (filter === 'chinese') {
        filters = { platformType: '中文' };
    } else if (filter === 'showcase') {
        filters = { tags: ['案例', '体验'] };
    } else if (filter === 'code') {
        filters = { tags: ['教程', '开发', '代码'] };
    } else if (filter === 'screenshot') {
        filters = { tags: ['截图', '界面'] };
    }

    const news = DataAPI.getNews(filters);

    // Update active button
    document.querySelectorAll('#news-section .filter-chip').forEach(chip => chip.classList.remove('active'));
    btn.classList.add('active');

    // Render filtered news (use existing renderNews function)
    renderNewsFromData(news);
}

/**
 * Render news from loaded data
 */
function renderNewsFromData(items) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('a');
        card.className = 'unified-card';
        card.href = item.source_url;
        card.target = '_blank';

        const img = item.image || 'https://via.placeholder.com/420x220?text=OpenClaw';
        const isEnglish = item.platform_type === '英文';

        card.innerHTML = `
            <div class="card-badge" style="background: ${isEnglish ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'};">
                ${item.platform}
            </div>
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
        `;

        grid.appendChild(card);
    });

    if (grid.children.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 4rem; color: var(--text-secondary);">没有找到匹配的内容</div>';
    }
}

/**
 * Search functionality example
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (query.length < 2) {
                // Show all data if query is too short
                const data = DataAPI.get();
                if (data) {
                    renderSkillsFromData(data.skills.skills);
                    renderNewsFromData(data.news.items);
                }
                return;
            }

            // Perform search
            const newsResults = DataAPI.searchNews(query);
            const skillResults = DataAPI.searchSkills(query);

            console.log(`Search results for "${query}":`, {
                news: newsResults.length,
                skills: skillResults.length
            });

            // Render results
            renderNewsFromData(newsResults);
            renderSkillsFromData(skillResults);

        }, 300);
    });
}

/**
 * Manual refresh button
 */
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (!refreshBtn) return;

    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 刷新中...';

        try {
            const freshData = await DataAPI.refresh();
            console.log('Data refreshed');

            renderSkillsFromData(freshData.skills.skills);
            renderNewsFromData(freshData.news.items);

            // Show success message
            showNotification('✅ 数据已更新');
        } catch (error) {
            console.error('Refresh failed:', error);
            showNotification('❌ 刷新失败: ' + error.message);
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '🔄 刷新数据';
        }
    });
}

/**
 * Show notification message
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize search and refresh when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupRefreshButton();
});

// Keep existing copyText function
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ 已复制!';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
}
