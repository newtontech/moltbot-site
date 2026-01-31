# Data Loader API Documentation

## Overview

The data loader system provides a clean, asynchronous API for loading and managing application data (news and skills) from JSON files. It includes caching, error handling, and data aggregation capabilities.

## Architecture

The system consists of two main modules:

1. **`data-loader.js`** - Core data loading engine with low-level operations
2. **`app-data.js`** - High-level application API with caching and event system

## File Structure

```
/data
├── config.json           # Site configuration and feature flags
├── categories.json       # Category metadata and definitions
├── news/
│   └── 2026-01.json     # News items by month
└── skills/
    ├── productivity.json           # Productivity skills
    ├── ai-llm.json                # AI/LLM skills
    ├── development.json           # Development skills
    ├── smart-home.json            # Smart home skills
    └── browser-automation.json    # Browser automation skills
```

## Quick Start

### Basic Usage

```javascript
// Load all data
async function init() {
    const data = await DataAPI.load();

    console.log('News items:', data.news.count);
    console.log('Skills:', data.skills.count);
    console.log('Categories:', DataAPI.getCategories());
}

init();
```

### Get Filtered Data

```javascript
// Get all news
const allNews = DataAPI.getNews();

// Get only Chinese news
const chineseNews = DataAPI.getNews({
    platformType: '中文'
});

// Get skills by category
const productivitySkills = DataAPI.getSkills({
    category: 'productivity'
});

// Get all categories
const categories = DataAPI.getCategories();
```

### Search

```javascript
// Search news
const results = DataAPI.searchNews('OpenClaw');

// Search skills
const tools = DataAPI.searchSkills('browser');
```

### Subscribe to Events

```javascript
// Subscribe to data loading events
const unsubscribe = DataAPI.subscribe((event, data) => {
    if (event === 'loaded') {
        console.log('Data loaded successfully!');
        renderApp(data);
    } else if (event === 'error') {
        console.error('Failed to load data:', data);
    }
});

// Unsubscribe when done
// unsubscribe();
```

## API Reference

### DataAPI

The main interface for interacting with application data.

#### Methods

##### `DataAPI.load(options)`

Load all application data asynchronously.

**Parameters:**
- `options.newsMonths` (Array<string>, optional): Specific months to load news from (e.g., `['2026-01', '2025-12']`)

**Returns:** Promise<object>

**Example:**
```javascript
const data = await DataAPI.load({
    newsMonths: ['2026-01', '2025-12']
});
```

---

##### `DataAPI.get()`

Get all loaded data synchronously.

**Returns:** object | null

**Example:**
```javascript
const data = DataAPI.get();
if (data) {
    console.log('News:', data.news.items);
}
```

---

##### `DataAPI.getNews(filters)`

Get news items, optionally filtered.

**Parameters:**
- `filters.platformType` (string): Filter by platform type ('英文' or '中文')
- `filters.tags` (Array<string>): Filter by tags
- `filters.platform` (string): Filter by platform name
- `filters.startDate` (string): Filter by start date (ISO format)
- `filters.endDate` (string): Filter by end date (ISO format)

**Returns:** Array

**Examples:**
```javascript
// All news
const all = DataAPI.getNews();

// English only
const english = DataAPI.getNews({ platformType: '英文' });

// By tag
const releases = DataAPI.getNews({ tags: ['发布'] });

// Multiple tags
const tagged = DataAPI.getNews({ tags: ['教程', 'Dev.to'] });

// Date range
const recent = DataAPI.getNews({
    startDate: '2026-01-01',
    endDate: '2026-01-31'
});
```

---

##### `DataAPI.getSkills(filters)`

Get skill items, optionally filtered.

**Parameters:**
- `filters.category` (string): Filter by category ID or name (e.g., 'productivity', '生产力')
- `filters.tags` (Array<string>): Filter by tags
- `filters.author` (string): Filter by author name

**Returns:** Array

**Examples:**
```javascript
// All skills
const all = DataAPI.getSkills();

// By category ID
const productivity = DataAPI.getSkills({ category: 'productivity' });

// By category name
const same = DataAPI.getSkills({ category: '生产力' });

// By author
const byAuthor = DataAPI.getSkills({ author: 'OpenClaw' });

// By tag
const aiTools = DataAPI.getSkills({ tags: ['AI'] });
```

---

##### `DataAPI.getCategories()`

Get all skill categories with metadata.

**Returns:** Array of objects with `id`, `name`, `icon`, and `count`

**Example:**
```javascript
const categories = DataAPI.getCategories();
// [
//   { id: 'productivity', name: '生产力', icon: '📝', count: 7 },
//   { id: 'ai-llm', name: 'AI/LLM', icon: '🤖', count: 2 },
//   ...
// ]
```

---

##### `DataAPI.searchNews(query)`

Search news items by text.

**Parameters:**
- `query` (string): Search query string

**Returns:** Array of matching news items

**Example:**
```javascript
const results = DataAPI.searchNews('GitHub');
// Searches in title, summary, tags, and platform
```

---

##### `DataAPI.searchSkills(query)`

Search skill items by text.

**Parameters:**
- `query` (string): Search query string

**Returns:** Array of matching skill items

**Example:**
```javascript
const results = DataAPI.searchSkills('browser');
// Searches in title, description, tags, and name
```

---

##### `DataAPI.refresh(options)`

Refresh data by clearing cache and reloading.

**Parameters:**
- `options` (object, optional): Same as `DataAPI.load()`

**Returns:** Promise<object>

**Example:**
```javascript
const freshData = await DataAPI.refresh();
```

---

##### `DataAPI.subscribe(callback)`

Subscribe to data loading events.

**Parameters:**
- `callback` (Function): Callback function that receives `(event, data)`

**Returns:** Function to unsubscribe

**Events:**
- `'loaded'`: Data successfully loaded
- `'error'`: Error occurred during loading

**Example:**
```javascript
const unsubscribe = DataAPI.subscribe((event, data) => {
    if (event === 'loaded') {
        console.log('Loaded:', data.news.count, 'news items');
    } else if (event === 'error') {
        console.error('Error:', data);
    }
});

// Later: unsubscribe();
```

---

##### `DataAPI.isLoading()`

Check if data is currently being loaded.

**Returns:** boolean

**Example:**
```javascript
if (DataAPI.isLoading()) {
    showLoadingSpinner();
}
```

---

##### `DataAPI.clearCache()`

Clear the data loader cache.

**Example:**
```javascript
DataAPI.clearCache();
```

## Data Structure

### Loaded Data Format

```javascript
{
    config: {
        site: {
            title: "Moltbot - 个人 AI 助手新闻站",
            description: "OpenClaw/Moltbot 最新资讯和技能插件",
            version: "2.0.0",
            author: "newtontech",
            github: "https://github.com/moltbot/moltbot",
            docs: "https://docs.molt.bot"
        },
        features: { ... },
        news: { ... },
        skills: { ... }
    },
    categories: { ... },
    news: {
        items: [
            {
                id: "2026-01-30-01",
                title: "🚀 OpenClaw v2026.1.29 发布",
                summary: "OpenClaw 发布了 v2026.1.29 版本...",
                platform: "GitHub Releases",
                platform_type: "英文",
                source_url: "https://github.com/...",
                publish_date: "2026-01-30",
                image: "https://...",
                tags: ["发布", "重构", "架构"]
            },
            ...
        ],
        count: 20,
        errors: []
    },
    skills: {
        skills: [
            {
                id: "bear-notes",
                name: "bear-notes",
                title: "Bear Notes 集成",
                description: "在 macOS 上通过 grizzly CLI...",
                author: "Tyler Wince (grizzly)",
                github_url: "https://github.com/...",
                install_cmd: "molt install bear-notes",
                category: "生产力",
                categoryId: "productivity",
                features: [...],
                use_case: "快速将会议记录...",
                stars: "N/A",
                image: "https://...",
                tags: ["笔记", "macOS", "Bear"],
                icon: "📝"
            },
            ...
        ],
        categories: {
            productivity: { name: "生产力", icon: "📝", count: 7 },
            "ai-llm": { name: "AI/LLM", icon: "🤖", count: 2 },
            ...
        },
        count: 16,
        errors: []
    },
    timestamp: "2026-01-31T12:00:00.000Z"
}
```

## Advanced Usage

### Custom Data Loading

If you need more control, use the `dataLoader` instance directly:

```javascript
// Load specific news month
const news = await dataLoader.loadNews('2026-01');

// Load specific skill category
const skills = await dataLoader.loadSkillsCategory('productivity');

// Load config only
const config = await dataLoader.loadConfig();

// Get cache stats
const stats = dataLoader.getCacheStats();
```

### Error Handling

All data loading methods include error handling. When errors occur:

```javascript
try {
    const data = await DataAPI.load();

    // Check for partial errors
    if (data.news.errors.length > 0) {
        console.warn('Some news failed to load:', data.news.errors);
    }

    if (data.skills.errors.length > 0) {
        console.warn('Some skills failed to load:', data.skills.errors);
    }
} catch (error) {
    console.error('Critical error loading data:', error);
}
```

### Performance Optimization

The data loader includes:

1. **Automatic Caching**: Data is cached for 5 minutes
2. **Parallel Loading**: Multiple files load simultaneously
3. **Promise Caching**: Concurrent load calls share the same promise

```javascript
// These calls will share the same loading promise
const promise1 = DataAPI.load();
const promise2 = DataAPI.load();

const data1 = await promise1;
const data2 = await promise2; // Returns immediately

// Clear cache to force reload
DataAPI.clearCache();
const fresh = await DataAPI.load();
```

## Integration Example

Here's a complete example of integrating with the UI:

```javascript
// Initialize data
async function initApp() {
    // Show loading state
    showLoadingIndicator();

    // Subscribe to loading events
    DataAPI.subscribe((event, data) => {
        if (event === 'loaded') {
            hideLoadingIndicator();
            renderNews(data.news.items);
            renderSkills(data.skills.skills);
            renderCategories(DataAPI.getCategories());
        } else if (event === 'error') {
            hideLoadingIndicator();
            showErrorNotification(data.message);
        }
    });

    // Load data
    await DataAPI.load();
}

// Filter news
function filterNewsByType(type) {
    const news = DataAPI.getNews({
        platformType: type === 'english' ? '英文' : '中文'
    });
    renderNews(news);
}

// Filter skills by category
function filterSkillsByCategory(category) {
    const skills = DataAPI.getSkills({
        category: category
    });
    renderSkills(skills);
}

// Search functionality
function handleSearch(query) {
    const newsResults = DataAPI.searchNews(query);
    const skillResults = DataAPI.searchSkills(query);
    renderSearchResults(newsResults, skillResults);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);
```

## Browser Compatibility

- Modern browsers with ES6 support
- Requires `fetch` API support
- Requires `Promise` support

For older browsers, include polyfills for:
- `fetch`
- `Promise`
- `Array.prototype.includes`
- `Array.prototype.find`
- `Object.assign`

## License

MIT
