# Templates Summary

This directory contains reusable HTML templates for the Moltbot website.

## Available Templates

### 1. news-card.html
**Purpose:** Template for news/announcement cards

**Placeholders:**
- `{{badge_text}}` - Platform name
- `{{badge_style}}` - CSS gradient style
- `{{image_url}}` - Image URL
- `{{image_alt}}` - Image alt text
- `{{date}}` - Publication date
- `{{title}}` - News title
- `{{summary}}` - News summary
- `{{tags_html}}` - Tags as HTML (pre-rendered)
- `{{source_url}}` - Link URL

**CSS Classes:**
- `.unified-card` - Main container
- `.card-badge` - Platform badge
- `.card-media` - Image container
- `.card-content` - Content wrapper
- `.card-date` - Date display
- `.card-title` - Title text
- `.card-summary` - Summary text
- `.card-footer` - Footer with tags
- `.tag-group` - Tags container
- `.mini-tag` - Individual tag
- `.action-btn` - Action button

### 2. skill-card.html
**Purpose:** Template for skill/plugin cards

**Placeholders:**
- `{{category}}` - Skill category (for filtering)
- `{{icon}}` - Emoji icon
- `{{title}}` - Chinese title
- `{{name}}` - English name
- `{{description}}` - Detailed description
- `{{features}}` - Features list as HTML `<li>` elements
- `{{use_case}}` - Use case description
- `{{author}}` - Author name
- `{{stars_display}}` - Star count with icon
- `{{github_url}}` - GitHub repository URL
- `{{install_cmd}}` - Installation command

**CSS Classes:**
- `.skill-card` - Main card container
- `.skill-header` - Icon and title section
- `.skill-icon` - Icon display
- `.skill-title-group` - Title wrapper
- `.skill-title-zh` - Chinese title
- `.skill-title-en` - English name
- `.skill-desc` - Description text
- `.skill-features` - Features list
- `.skill-meta` - Metadata section
- `.skill-author` - Author display
- `.skill-stars` - Star count
- `.skill-actions` - Actions section
- `.github-btn` - GitHub link button
- `.install-box` - Install command wrapper
- `.install-cmd` - Command display
- `.copy-btn` - Copy button

## Usage Pattern

Both templates follow the same usage pattern:

1. **Load Template:** Fetch template HTML file
2. **Prepare Data:** Format data (especially arrays to HTML)
3. **Replace Placeholders:** Use string replacement with `{{variable}}` syntax
4. **Insert to DOM:** Add rendered HTML to page

### JavaScript Example

```javascript
// Load template
const template = await fetch('/templates/skill-card.html').then(r => r.text());

// Prepare data
const skill = {
    name: "example-skill",
    title: "示例技能",
    description: "这是一个示例技能描述",
    features: ["功能1", "功能2", "功能3"],
    // ... other fields
};

// Convert arrays to HTML
const featuresHtml = skill.features.map(f => `<li>${f}</li>`).join('');

// Replace placeholders
let html = template
    .replace(/\{\{name\}\}/g, skill.name)
    .replace(/\{\{title\}\}/g, skill.title)
    .replace(/\{\{description\}\}/g, skill.description)
    .replace(/\{\{features\}\}/g, featuresHtml);
    // ... continue for all fields

// Insert to DOM
document.getElementById('skills-grid').innerHTML += html;
```

## Best Practices

1. **Use global flag (`/g`) in regex** to replace all occurrences
2. **Sanitize user input** before inserting into templates to prevent XSS
3. **Pre-render arrays** as HTML before template replacement
4. **Use consistent naming** between data fields and template variables
5. **Handle optional fields** (like stars) with conditional logic before replacement

## Files

- `/templates/skill-card.html` - Skill card template
- `/templates/news-card.html` - News card template
- `/templates/example-usage.js` - JavaScript usage examples
- `/templates/README.md` - Detailed documentation

## Related

- `/index.html` - Main page with all CSS styles and current implementation
- CSS for all template classes is defined in `/index.html` `<style>` section
