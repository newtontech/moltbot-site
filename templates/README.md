# Templates Directory

This directory contains HTML templates used for dynamic content rendering in the Moltbot website.

## Files

### skill-card.html
Template for displaying individual skill/plugin cards with all necessary elements.

## Template Variables

### skill-card.html Placeholders

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `{{category}}` | string | Skill category for filtering | "生产力", "AI/LLM", "开发" |
| `{{icon}}` | string | Emoji or icon representing the skill | "📝", "🤖", "💻" |
| `{{title}}` | string | Chinese title of the skill | "Bear Notes 集成" |
| `{{name}}` | string | English name/code identifier | "bear-notes" |
| `{{description}}` | string | Detailed description of the skill | "在 macOS 上通过 grizzly CLI 创建..." |
| `{{features}}` | HTML string | List of features (as `<li>` elements) | `<li>创建带标签的笔记</li><li>搜索笔记</li>` |
| `{{use_case}}` | string | Practical use case description | "快速将会议记录记录到 Bear" |
| `{{author}}` | string | Author name or attribution | "Tyler Wince (grizzly)" |
| `{{stars_display}}` | string | Formatted star count with icon | "⭐ 200+" or empty string |
| `{{github_url}}` | string | Full URL to GitHub repository | "https://github.com/tylerwince/grizzly" |
| `{{install_cmd}}` | string | Installation command | "molt install bear-notes" |

## Usage Examples

### JavaScript Implementation

```javascript
// Load template from file
async function loadSkillCardTemplate() {
    const response = await fetch('/templates/skill-card.html');
    return await response.text();
}

// Render a skill card
async function renderSkillCard(skill) {
    const template = await loadSkillCardTemplate();

    // Prepare features HTML
    const featuresHtml = skill.features.map(f => `<li>${f}</li>`).join('');
    const starsDisplay = skill.stars && skill.stars !== 'N/A' ? `⭐ ${skill.stars}` : '';

    // Replace placeholders
    return template
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
}

// Sample skill data
const skill = {
    name: "bear-notes",
    title: "Bear Notes 集成",
    description: "在 macOS 上通过 grizzly CLI 创建、搜索和管理 Bear 笔记。",
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

// Render and append to DOM
const cardHtml = await renderSkillCard(skill);
document.getElementById('skills-grid').innerHTML = cardHtml;
```

## Styling

The template uses CSS classes defined in `/index.html`:
- `.skill-card` - Main card container
- `.skill-header` - Icon and title section
- `.skill-icon` - Emoji icon display
- `.skill-title-zh` - Chinese title
- `.skill-title-en` - English name
- `.skill-desc` - Description text
- `.skill-features` - Features list
- `.skill-meta` - Author and stars metadata
- `.skill-actions` - Action buttons and install command

## Data Structure

Skills should follow this structure:

```typescript
interface Skill {
    name: string;           // Unique identifier
    title: string;          // Display title (Chinese)
    description: string;    // Detailed description
    author: string;         // Author attribution
    github_url: string;     // Repository URL
    install_cmd: string;    // Installation command
    category: string;       // Category for filtering
    features: string[];     // List of features
    use_case: string;       // Use case description
    stars: string;          // GitHub stars count
    icon: string;           // Emoji icon
}
```

## Related Files

- `/index.html` - Main page with CSS styles and rendering logic
- `/templates/example-usage.js` - JavaScript usage examples
