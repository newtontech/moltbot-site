# Quick Start: Adding Skills

## Running the Script

From the project root directory:

```bash
node scripts/add-skill.js
```

## What You'll Need

Before running the script, have ready:

1. **Skill ID** - A unique identifier (e.g., `my-awesome-skill`)
2. **Title** - Display name for users
3. **Description** - What the skill does
4. **Author** - Your name or GitHub handle
5. **GitHub URL** - Repository link
6. **Features** (optional) - Comma-separated list
7. **Use case** (optional) - Example usage
8. **Stars** (optional) - Repository star count
9. **Image URL** (optional) - Defaults to placeholder
10. **Tags** (optional) - Comma-separated tags

## Categories

Choose from these categories:

1. **productivity** (📝 生产力) - Productivity tools and integrations
2. **ai-llm** (🤖 AI/LLM) - AI and language model tools
3. **development** (💻 开发) - Development and programming tools
4. **smart-home** (🏠 智能家居) - Smart home and IoT
5. **browser-automation** (🌐 浏览器自动化) - Browser automation

## Example Workflow

```bash
$ node scripts/add-skill.js

=== MoltBot Skill Addition Tool ===

Available categories:
  1. productivity         📝 生产力
  2. ai-llm              🤖 AI/LLM
  ...

Select category (enter number or key): 1

✓ Selected: 📝 生产力

Current skills in this category: 7

Enter skill details:

Skill ID (e.g., my-awesome-skill): notion-sync
Skill name (usually same as ID) [notion-sync]:
Skill title (display name): Notion Sync Tool
Skill description: Sync notes with Notion database
Author name: Your Name
GitHub URL: https://github.com/username/notion-sync
Install command [molt install notion-sync]:
Features (comma-separated): Real-time sync, Database support, Backup
Use case: Keep notes synced between local and Notion
Stars count [N/A]: 125
Image URL [https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80]:
Tags (comma-separated): Notion, Sync, Productivity
Icon (emoji) [📝]: 📓

=== Skill Summary ===
{
  "id": "notion-sync",
  "name": "notion-sync",
  "title": "Notion Sync Tool",
  "description": "Sync notes with Notion database",
  ...
}

Add this skill? (yes/no): yes

✓ Skill added to productivity.json
✓ JSON validation passed

=== Success ===
Category: 📝 生产力
Previous skill count: 7
New skill count: 8
Added: Notion Sync Tool
```

## Tips

- Press Enter to accept default values (shown in brackets)
- Use lowercase with hyphens for skill IDs (e.g., `my-awesome-skill`)
- Features and tags can be comma-separated lists
- You can type "y" instead of "yes" to confirm
- The script will validate JSON before saving

## Troubleshooting

**Script won't run?**
- Make sure you're in the project root directory
- Check that Node.js is installed: `node --version`

**Category selection fails?**
- Use either the number (1-5) or the category key (e.g., `productivity`)

**JSON validation fails?**
- Check for syntax errors in your input
- Ensure URLs are valid
- Make sure required fields are not empty

## File Locations

Skills are saved to:
```
data/skills/
├── productivity.json
├── ai-llm.json
├── development.json
├── smart-home.json
└── browser-automation.json
```

Categories are defined in:
```
data/categories.json
```
