/**
 * Example usage of the skill-card.html template
 * This demonstrates how to load the template and replace placeholders with actual data
 */

// Sample skill data matching the structure from index.html
const sampleSkill = {
    name: "bear-notes",
    title: "Bear Notes 集成",
    description: "在 macOS 上通过 grizzly CLI 创建、搜索和管理 Bear 笔记。支持创建带标签的笔记、追加文本和读取笔记内容。",
    author: "Tyler Wince (grizzly)",
    github_url: "https://github.com/tylerwince/grizzly",
    install_cmd: "molt install bear-notes",
    category: "生产力",
    features: [
        "创建带标题和标签的笔记",
        "向现有笔记追加文本",
        "按标签或内容搜索笔记"
    ],
    use_case: "快速将会议记录或想法记录到 Bear，无需离开终端。",
    stars: "N/A",
    icon: "📝"
};

/**
 * Method 1: Simple string replacement
 */
function renderSkillCardSimple(skill) {
    let template = `<div class="skill-card" data-category="{{category}}">
    <!-- Header: Icon and Titles -->
    <div class="skill-header">
        <span class="skill-icon">{{icon}}</span>
        <div class="skill-title-group">
            <span class="skill-title-zh">{{title}}</span>
            <span class="skill-title-en">{{name}}</span>
        </div>
    </div>

    <!-- Description -->
    <p class="skill-desc">{{description}}</p>

    <!-- Features List -->
    <ul class="skill-features">
        {{features}}
    </ul>

    <!-- Use Case -->
    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
        💡 使用案例：{{use_case}}
    </p>

    <!-- Metadata: Author and Stars -->
    <div class="skill-meta">
        <div class="skill-author">👤 {{author}}</div>
        <div class="skill-stars">{{stars_display}}</div>
    </div>

    <!-- Actions: GitHub Link and Install Command -->
    <div class="skill-actions">
        <a href="{{github_url}}" target="_blank" class="github-btn">
            🔗 GitHub
        </a>
        <div class="install-box">
            <code class="install-cmd">{{install_cmd}}</code>
            <button class="copy-btn" onclick="copyText('{{install_cmd}}', this)">📋 复制</button>
        </div>
    </div>
</div>`;

    // Generate features HTML
    const featuresHtml = skill.features.map(f => `<li>${f}</li>`).join('');
    const starsDisplay = skill.stars && skill.stars !== 'N/A' ? `⭐ ${skill.stars}` : '';

    // Replace all placeholders
    template = template
        .replace(/\{\{category\}\}/g, skill.category)
        .replace(/\{\{icon\}\}/g, skill.icon)
        .replace(/\{\{title\}\}/g, skill.title)
        .replace(/\{\{name\}\}/g, skill.name)
        .replace(/\{\{description\}\}/g, skill.description)
        .replace(/\{\{features\}\}/g, featuresHtml)
        .replace(/\{\{use_case\}\}/g, skill.use_case)
        .replace(/\{\{author\}\}/g, skill.author)
        .replace(/\{\{stars_display\}\}/g, starsDisplay)
        .replace(/\{\{github_url\}\}/g, skill.github_url)
        .replace(/\{\{install_cmd\}\}/g, skill.install_cmd);

    return template;
}

/**
 * Method 2: Using fetch to load external template file
 */
async function renderSkillCardFromTemplate(skill) {
    try {
        const response = await fetch('/templates/skill-card.html');
        let template = await response.text();

        // Generate features HTML
        const featuresHtml = skill.features.map(f => `<li>${f}</li>`).join('');
        const starsDisplay = skill.stars && skill.stars !== 'N/A' ? `⭐ ${skill.stars}` : '';

        // Replace all placeholders
        template = template
            .replace(/\{\{category\}\}/g, skill.category)
            .replace(/\{\{icon\}\}/g, skill.icon)
            .replace(/\{\{title\}\}/g, skill.title)
            .replace(/\{\{name\}\}/g, skill.name)
            .replace(/\{\{description\}\}/g, skill.description)
            .replace(/\{\{features\}\}/g, featuresHtml)
            .replace(/\{\{use_case\}\}/g, skill.use_case)
            .replace(/\{\{author\}\}/g, skill.author)
            .replace(/\{\{stars_display\}\}/g, starsDisplay)
            .replace(/\{\{github_url\}\}/g, skill.github_url)
            .replace(/\{\{install_cmd\}\}/g, skill.install_cmd);

        return template;
    } catch (error) {
        console.error('Error loading template:', error);
        return '';
    }
}

/**
 * Method 3: Batch render multiple skills
 */
async function renderMultipleSkills(skills) {
    const container = document.getElementById('skills-grid');
    if (!container) return;

    container.innerHTML = '';

    for (const skill of skills) {
        const cardHtml = await renderSkillCardFromTemplate(skill);
        container.innerHTML += cardHtml;
    }
}

// Example usage:
// console.log(renderSkillCardSimple(sampleSkill));
// renderMultipleSkills([sampleSkill]);
