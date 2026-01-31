# Data Loader - Quick Start Guide

## 1. Basic Setup (2 minutes)

Add to your HTML `<head>` or before `</body>`:

```html
<script src="js/data-loader.js"></script>
<script src="js/app-data.js"></script>
```

## 2. Load Data (3 lines of code)

```javascript
// Load all data
const data = await DataAPI.load();

// Access data
console.log(data.news.items);    // News array
console.log(data.skills.skills); // Skills array
console.log(data.skills.categories); // Categories object
```

## 3. Filter Data

```javascript
// Get Chinese news only
const chineseNews = DataAPI.getNews({ platformType: '中文' });

// Get productivity skills
const productivitySkills = DataAPI.getSkills({ category: 'productivity' });

// Get all categories with counts
const categories = DataAPI.getCategories();
```

## 4. Search

```javascript
// Search in news and skills
const newsResults = DataAPI.searchNews('OpenClaw');
const skillResults = DataAPI.searchSkills('browser');
```

## 5. Handle Events

```javascript
// Subscribe to loading events
DataAPI.subscribe((event, data) => {
    if (event === 'loaded') {
        console.log('Data ready!');
    }
});
```

## Complete Example

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading state
    showLoadingSpinner();

    try {
        // Load all data
        const data = await DataAPI.load();

        // Render content
        renderNews(data.news.items);
        renderSkills(data.skills.skills);
        updateFilters(DataAPI.getCategories());

    } catch (error) {
        showError('Failed to load data');
    } finally {
        hideLoadingSpinner();
    }
});

// Filter handler
function onCategoryFilter(category) {
    const skills = DataAPI.getSkills({ category });
    renderSkills(skills);
}

// Search handler
function onSearch(query) {
    const news = DataAPI.searchNews(query);
    const skills = DataAPI.searchSkills(query);
    renderResults(news, skills);
}
```

## Common Patterns

### Pattern 1: Check if data is loaded

```javascript
const data = DataAPI.get();
if (data) {
    // Data is available
} else {
    // Need to load first
    await DataAPI.load();
}
```

### Pattern 2: Refresh data

```javascript
// Clear cache and reload
const freshData = await DataAPI.refresh();
```

### Pattern 3: Handle errors

```javascript
try {
    const data = await DataAPI.load();
    // Use data
} catch (error) {
    console.error('Error:', error);
    // Show error to user
}
```

### Pattern 4: Filter by multiple criteria

```javascript
const news = DataAPI.getNews({
    platformType: '英文',
    tags: ['发布', '教程'],
    startDate: '2026-01-01',
    endDate: '2026-01-31'
});
```

## Migration from Inline Data

### Before (index.html)
```javascript
const data = {
    news: { news_items: [...] },
    skills: { skills: [...] }
};

function renderSkills() {
    data.skills.skills.forEach(...);
}
```

### After (with data loader)
```javascript
async function init() {
    const data = await DataAPI.load();
    renderSkills(data.skills.skills);
}

function renderSkills(skills) {
    skills.forEach(...);
}
```

## API Cheatsheet

| Method | Description | Returns |
|--------|-------------|---------|
| `DataAPI.load()` | Load all data | Promise<object> |
| `DataAPI.get()` | Get loaded data | object \| null |
| `DataAPI.getNews(filters)` | Get filtered news | Array |
| `DataAPI.getSkills(filters)` | Get filtered skills | Array |
| `DataAPI.getCategories()` | Get categories | Array |
| `DataAPI.searchNews(query)` | Search news | Array |
| `DataAPI.searchSkills(query)` | Search skills | Array |
| `DataAPI.refresh()` | Reload data | Promise<object> |
| `DataAPI.subscribe(fn)` | Subscribe to events | unsubscribe function |
| `DataAPI.isLoading()` | Check loading state | boolean |
| `DataAPI.clearCache()` | Clear cache | void |

## Filter Options

### News Filters
- `platformType`: '英文' | '中文'
- `tags`: Array<string>
- `platform`: string
- `startDate`: ISO date string
- `endDate`: ISO date string

### Skills Filters
- `category`: category ID or name
- `tags`: Array<string>
- `author`: string (partial match)

## Data Structure

### News Item
```javascript
{
    id: string,
    title: string,
    summary: string,
    platform: string,
    platform_type: '英文' | '中文',
    source_url: string,
    publish_date: string,
    image: string,
    tags: string[]
}
```

### Skill Item
```javascript
{
    id: string,
    name: string,
    title: string,
    description: string,
    author: string,
    github_url: string,
    install_cmd: string,
    category: string,
    categoryId: string,
    features: string[],
    use_case: string,
    stars: string,
    image: string,
    tags: string[],
    icon: string
}
```

## Testing

Open `/js/test-data-loader.html` in your browser for interactive testing.

## Need Help?

- Full documentation: `/js/README.md`
- Implementation guide: `/js/IMPLEMENTATION_SUMMARY.md`
- Integration example: `/js/example-integration.js`
