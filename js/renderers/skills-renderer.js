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

    // Support both data formats: {skills: [...]} and {skills: {skills: [...]}}
    let items = [];
    if (data?.skills?.skills) {
        // Format: {skills: {skills: [...], categories: {...}}}
        items = data.skills.skills;
    } else if (data?.skills && Array.isArray(data.skills)) {
        // Format: {skills: [...]}
        items = data.skills;
    } else if (Array.isArray(data)) {
        // Format: [...]
        items = data;
    }

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

    // Support both full format and simplified format
    const name = skill.name || skill.title || 'Unknown';
    const version = skill.version || 'N/A';
    const installed = skill.installed || false;

    // Skill metadata mapping with fallbacks
    const skillInfo = {
        tavilySearch: {
            name: 'Tavily Search',
            icon: '🔍',
            title: 'AI 搜索',
            description: 'AI 优化的搜索引擎，提供简洁精准的搜索结果',
            features: ['AI 优化', '快速响应', '智能摘要'],
            useCase: '快速获取准确信息',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/tavily-search-skill'
        },
        mcporter: {
            name: 'mcporter',
            icon: '🔌',
            title: 'MCP 服务器管理',
            description: '管理 MCP（Model Context Protocol）服务器的工具',
            features: ['MCP 管理', '配置工具', 'CLI 接口'],
            useCase: '管理 MCP 服务器',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/mcporter-skill'
        },
        codingAgent: {
            name: 'coding-agent',
            icon: '👨‍💻',
            title: '编码代理',
            description: '支持多实例的编码代理，实现复杂的编程任务',
            features: ['多实例', '并行执行', 'AI 辅助编码'],
            useCase: '大型项目开发',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/coding-agent-skill'
        },
        github: {
            name: 'github',
            icon: '🐙',
            title: 'GitHub 集成',
            description: '直接与 GitHub 交互，管理仓库、Issues、PR',
            features: ['仓库管理', 'Issue 跟踪', 'PR 管理'],
            useCase: 'Git 仓库操作',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/github-skill'
        },
        weather: {
            name: 'weather',
            icon: '🌤️',
            title: '天气查询',
            description: '查询天气信息，无需 API 密钥',
            features: ['实时天气', '无需 API', '简单易用'],
            useCase: '查询天气信息',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/weather-skill'
        },
        tmux: {
            name: 'tmux',
            icon: '💻',
            title: 'Tmux 会话控制',
            description: '远程控制 tmux 会话，发送按键和获取输出',
            features: ['会话控制', '按键发送', '输出获取'],
            useCase: '管理远程会话',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/tmux-skill'
        },
        nanoPdf: {
            name: 'nano-pdf',
            icon: '📄',
            title: 'PDF 编辑',
            description: '使用自然语言指令编辑 PDF 文件',
            features: ['自然语言', 'PDF 编辑', '简单易用'],
            useCase: '快速修改 PDF',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/nano-pdf-skill'
        },
        slack: {
            name: 'slack',
            icon: '💬',
            title: 'Slack 控制',
            description: '通过 Clawdbot 控制 Slack（回复、固定、Pin/Unpin）',
            features: ['消息回复', 'Pin 操作', 'Unpin 操作'],
            useCase: '自动化 Slack 操作',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/slack-skill'
        },
        discord: {
            name: 'discord',
            icon: '🎮',
            title: 'Discord 控制',
            description: '通过 Clawdbot 控制 Discord 机器人',
            features: ['服务器管理', '消息发送', '频道操作'],
            useCase: 'Discord 机器人管理',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/discord-skill'
        },
        bird: {
            name: 'bird',
            icon: '🐦',
            title: 'X/Twitter',
            description: 'X/Twitter CLI，用于阅读、搜索和发布推文',
            features: ['推文阅读', '搜索', '发布'],
            useCase: 'Twitter 自动化',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/bird-skill'
        },
        canvasLms: {
            name: 'canvas-lms',
            icon: '🎓',
            title: 'Canvas LMS',
            description: '访问 Canvas LMS 的课程数据、作业、成绩和提交',
            features: ['课程数据', '作业管理', '成绩查询'],
            useCase: 'Canvas 学习管理',
            author: 'VoltAgent',
            github: 'https://github.com/VoltAgent/canvas-lms-skill'
        }
    };

    // Get skill info with fallbacks
    const normalizedKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const info = skillInfo[normalizedKey] || {
        icon: '📦',
        title: name,
        description: `一个强大的 ${name} 技能插件`,
        features: [],
        useCase: '多种使用场景',
        author: '社区',
        github: 'https://github.com/VoltAgent/awesome-moltbot-skills'
    };

    // Use provided data if available, otherwise use defaults
    const icon = skill.icon || info.icon;
    const titleZh = skill.title || info.title;
    const description = skill.description || info.description;
    const features = skill.features || info.features;
    const useCase = skill.use_case || info.useCase;
    const author = skill.author || info.author;
    const stars = skill.stars || '';
    const githubUrl = skill.github_url || info.github;
    const installCmd = skill.install_cmd || `clawdhub install ${name}`;

    card.innerHTML = `
        <div class="skill-header">
            <span class="skill-icon">${icon}</span>
            <div class="skill-title-group">
                <span class="skill-title-zh">${titleZh}</span>
                <span class="skill-title-en">${name}</span>
                ${installed ? '<span style="color: var(--success-color); font-size: 0.75rem; margin-left: 0.5rem;">✓ 已安装</span>' : ''}
            </div>
            <span class="skill-version">v${version}</span>
        </div>
        <p class="skill-desc">${description}</p>
        ${renderFeatureList(features)}
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
            💡 使用案例：${useCase}
        </p>
        <div class="skill-meta">
            <div class="skill-author">👤 ${author}</div>
            <div class="skill-stars">${stars ? '⭐ ' + stars : ''}</div>
        </div>
        <div class="skill-actions">
            <a href="${githubUrl}" target="_blank" class="github-btn">
                🔗 GitHub
            </a>
            ${renderInstallCommand(installCmd)}
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
