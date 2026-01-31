/**
 * Skills Renderer Module
 * Handles rendering of skill cards with filtering and HTML generation
 */

/**
 * Render skills grid with optional filter
 * @param {string} filter - Category filter ('all' or specific category name)
 * @param {Object} data - Skills data object containing skills array
 */
function renderSkills(filter = 'all', data) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    const items = data?.skills?.skills || [];
    const filtered = filter === 'all' ? items : items.filter(s => s.category === filter);

    grid.innerHTML = '';

    filtered.forEach(skill => {
        const card = generateSkillCard(skill);
        grid.appendChild(card);
    });

    // Empty state handling
    if (grid.children.length === 0) {
        renderEmptyState(grid);
    }
}

/**
 * Generate skill card HTML element
 * @param {Object} skill - Skill object with all skill properties
 * @returns {HTMLElement} - Skill card DOM element
 */
function generateSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';

    card.innerHTML = `
        <div class="skill-header">
            <span class="skill-icon">${skill.icon}</span>
            <div class="skill-title-group">
                <span class="skill-title-zh">${skill.title}</span>
                <span class="skill-title-en">${skill.name}</span>
            </div>
        </div>
        <p class="skill-desc">${skill.description}</p>
        ${renderFeatureList(skill.features)}
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
            ${renderInstallCommand(skill.install_cmd)}
        </div>
    `;

    return card;
}

/**
 * Render feature list HTML
 * @param {Array<string>} features - Array of feature descriptions
 * @returns {string} - HTML string of feature list
 */
function renderFeatureList(features) {
    if (!features || features.length === 0) {
        return '<ul class="skill-features"></ul>';
    }

    const featureItems = features.map(f => `<li>${f}</li>`).join('');
    return `<ul class="skill-features">${featureItems}</ul>`;
}

/**
 * Render install command box
 * @param {string} installCmd - Installation command string
 * @returns {string} - HTML string of install command box
 */
function renderInstallCommand(installCmd) {
    if (!installCmd) {
        return '<div class="install-box"><code class="install-cmd">暂无安装命令</code></div>';
    }

    return `
        <div class="install-box">
            <code class="install-cmd">${installCmd}</code>
            <button class="copy-btn" onclick="copyText('${installCmd}', this)">📋 复制</button>
        </div>
    `;
}

/**
 * Render empty state when no skills match filter
 * @param {HTMLElement} container - Container element to render empty state in
 */
function renderEmptyState(container) {
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
            grid-column: 1 / -1;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <div style="font-size: 1.1rem; font-weight: 500;">没有找到匹配的技能插件</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                请尝试选择其他分类
            </div>
        </div>
    `;
}

/**
 * Filter skills by category and update UI
 * @param {string} category - Category to filter by
 * @param {HTMLElement} btn - Button element that triggered the filter
 * @param {Object} data - Skills data object
 */
function filterSkills(category, btn, data) {
    // Update active state on filter buttons
    document.querySelectorAll('.skill-filter-btn').forEach(button => {
        button.classList.remove('active');
    });
    btn.classList.add('active');

    // Re-render skills with new filter
    renderSkills(category, data);
}

/**
 * Copy installation command to clipboard
 * @param {string} text - Text to copy
 * @param {HTMLElement} btn - Button element that triggered the copy
 */
function copyInstallCommand(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ 已复制!';
        setTimeout(() => {
            btn.innerHTML = original;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        btn.innerHTML = '❌ 复制失败';
        setTimeout(() => {
            btn.innerHTML = original;
        }, 2000);
    });
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderSkills,
        generateSkillCard,
        renderFeatureList,
        renderInstallCommand,
        renderEmptyState,
        filterSkills,
        copyInstallCommand
    };
}
