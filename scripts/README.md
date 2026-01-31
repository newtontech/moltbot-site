# Data Management Scripts

This directory contains scripts for managing news items and validating data in the moltbot-site project.

## validate-data.js

Comprehensive JSON validation script for all data files in the project.

### Usage

```bash
node scripts/validate-data.js
```

Or make it executable and run directly:

```bash
chmod +x scripts/validate-data.js
./scripts/validate-data.js
```

### Features

- **Validates JSON syntax**: Checks all JSON files for parsing errors
- **Required fields validation**: Ensures all required fields are present
- **URL format validation**: Validates all URL fields
- **Duplicate ID detection**: Checks for duplicate IDs across all files
- **Data type validation**: Validates field types and formats
- **Colored output**: Easy-to-read colored terminal output

### What It Checks

**News Files (`data/news/*.json`):**
- Root `month` field format (YYYY-MM)
- `items` array structure
- Required fields: id, title, summary, platform, platform_type, source_url, publish_date, image, tags
- URL validity (source_url, image)
- Date format (YYYY-MM-DD)
- Platform type values (中文/英文)
- Non-empty tags array

**Skills Files (`data/skills/*.json`):**
- Root `category` and `icon` fields
- `skills` array structure
- Required fields: id, name, title, description, author, github_url, install_cmd, category, features, use_case, stars, image, tags, icon
- URL validity (github_url, image)
- Stars format (N/A or number)
- Non-empty features and tags arrays

### Exit Codes

- **0**: All validations passed
- **1**: One or more validation errors found

### Example Output

```
═══════════════════════════════════════════════════════
  JSON Data Validation Script
═══════════════════════════════════════════════════════

Validating news files...
  Found 1 JSON file(s)

  Checking: 2026-01.json

Validating skills files...
  Found 5 JSON file(s)

  Checking: ai-llm.json
  Checking: browser-automation.json
  Checking: development.json
    ⚠ development.json[skill 2]: Field 'icon' should be a single emoji
  Checking: productivity.json
    ⚠ productivity.json[skill 1]: Field 'icon' should be a single emoji
  Checking: smart-home.json

═══════════════════════════════════════════════════════
  Validation Summary
═══════════════════════════════════════════════════════

⚠ Warnings: 2
  Total unique IDs: 36

═══════════════════════════════════════════════════════
```

---

## add-news.js

Interactive Node.js script for adding news items to the site.

### Usage

```bash
node scripts/add-news.js
```

Or make it executable and run directly:

```bash
chmod +x scripts/add-news.js
./scripts/add-news.js
```

### Features

- **Interactive prompts**: Step-by-step input collection using readline
- **Auto-generate unique IDs**: Creates IDs based on date with random suffix (format: `YYYY-MM-DD-XX`)
- **Smart file handling**: Automatically determines the correct file by date (format: `YYYY-MM.json`)
- **Creates new files**: Automatically creates new monthly files if they don't exist
- **JSON validation**: Validates the JSON file after adding the news item
- **Error handling**: Validates required fields before saving

### Required Fields

1. **Title**: The news item title
2. **Summary**: Brief description of the news
3. **Platform**: Platform name (e.g., "GitHub Releases", "Product Hunt", "Hacker News")
4. **Platform type**: Language type (中文/英文, defaults to 英文)
5. **Source URL**: URL to the original news source
6. **Publish date**: Publication date in YYYY-MM-DD format (defaults to today)
7. **Image URL**: URL to the news image (optional, defaults to a placeholder)
8. **Tags**: Comma-separated tags (optional)

### Example Session

```
=== Add News Item ===

Title: 🚀 OpenClaw v2026.1.29 发布
Summary: OpenClaw 发布了新版本，包含重大架构重构
Platform: GitHub Releases
Platform type (中文/英文, default: 英文): 英文
Source URL: https://github.com/openclaw/openclaw/releases
Publish date (YYYY-MM-DD, default: today): 2026-01-30
Image URL (optional, press Enter to skip):

Enter tags (comma-separated):
Enter tags (comma-separated, e.g., "发布,热门,GitHub"): 发布,GitHub,热门

✓ News item added successfully!
  File: /home/yhm/desktop/code/moltbot-site/data/news/2026-01.json
  ID: 2026-01-30-42
✓ JSON validation passed.
```

### File Structure

News items are stored in `/data/news/` directory with the following structure:

```json
{
  "month": "2026-01",
  "items": [
    {
      "id": "2026-01-30-01",
      "title": "News Title",
      "summary": "News summary",
      "platform": "Platform Name",
      "platform_type": "中文",
      "source_url": "https://example.com",
      "publish_date": "2026-01-30",
      "image": "https://example.com/image.jpg",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

### Error Handling

The script will exit with an error if:
- Required fields are missing (title, summary, platform, source URL)
- Invalid date format is provided
- File write permission issues occur
- JSON validation fails after adding the item

---

## add-skill.js

Interactive Node.js script for adding skills to the MoltBot site.

### Usage

```bash
node scripts/add-skill.js
```

Or make it executable and run directly:

```bash
chmod +x scripts/add-skill.js
./scripts/add-skill.js
```

### Features

1. **Category Selection**: Displays available categories and allows selection by number or key
2. **Interactive Prompts**: Guides you through all required skill fields
3. **Smart Defaults**: Provides sensible defaults for optional fields
4. **Auto-Detection**: Automatically determines the correct file based on category
5. **File Creation**: Creates new category files if they don't exist
6. **JSON Validation**: Validates the JSON file after adding the skill
7. **Summary Display**: Shows before/after skill counts for the category

### Required Fields

- **Skill ID**: Unique identifier (e.g., `my-awesome-skill`)
- **Title**: Display name for the skill
- **Description**: Detailed description of what the skill does
- **Author**: Name or handle of the author
- **GitHub URL**: Link to the repository

### Optional Fields (with defaults)

- **Name**: Defaults to skill ID
- **Install command**: Defaults to `molt install <id>`
- **Features**: Comma-separated list of features
- **Use case**: Example use case
- **Stars**: Defaults to `N/A`
- **Image**: Defaults to placeholder Unsplash image
- **Tags**: Comma-separated list of tags
- **Icon**: Defaults to category icon

### Example Session

```
=== MoltBot Skill Addition Tool ===

Available categories:
  1. productivity         📝 生产力
  2. ai-llm              🤖 AI/LLM
  3. development         💻 开发
  4. smart-home          🏠 智能家居
  5. browser-automation  🌐 浏览器自动化

Select category (enter number or key): 2

✓ Selected: 🤖 AI/LLM

Current skills in this category: 2

Enter skill details:

Skill ID (e.g., my-awesome-skill): chatgpt-wrapper
Skill name (usually same as ID) [chatgpt-wrapper]: chatgpt-wrapper
Skill title (display name): ChatGPT Wrapper
Skill description: A wrapper for ChatGPT API integration
Author name: John Doe
GitHub URL: https://github.com/johndoe/chatgpt-wrapper
Install command [molt install chatgpt-wrapper]:
Features (comma-separated): API integration, chat completion, streaming
Use case: Integrate ChatGPT into your workflow
Stars count [N/A]: 150
Image URL [https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80]:
Tags (comma-separated): AI, ChatGPT, OpenAI, LLM
Icon (emoji) [🤖]: 🧠

=== Skill Summary ===
{
  "id": "chatgpt-wrapper",
  "name": "chatgpt-wrapper",
  "title": "ChatGPT Wrapper",
  ...
}

Add this skill? (yes/no): yes

✓ Skill added to ai-llm.json
✓ JSON validation passed

=== Success ===
Category: 🤖 AI/LLM
Previous skill count: 2
New skill count: 3
Added: ChatGPT Wrapper
```

### File Structure

The script works with the following structure:

```
moltbot-site/
├── data/
│   ├── categories.json          # Category definitions
│   └── skills/
│       ├── productivity.json     # Productivity skills
│       ├── ai-llm.json          # AI/LLM skills
│       ├── development.json     # Development skills
│       ├── smart-home.json      # Smart home skills
│       └── browser-automation.json  # Browser automation skills
└── scripts/
    └── add-skill.js             # This script
```

### Error Handling

The script includes validation for:
- Required fields
- JSON syntax after modifications
- File read/write operations
- Invalid category selections

If validation fails, the script will exit with an error message without modifying any files.
