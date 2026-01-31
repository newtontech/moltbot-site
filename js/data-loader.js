/**
 * Data Loader Module
 * Provides asynchronous data loading capabilities for news and skills
 * with proper error handling and data aggregation.
 */

class DataLoader {
    constructor() {
        this.basePath = '/data';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Load JSON file from path with error handling
     * @param {string} path - Path to JSON file
     * @returns {Promise<object>} Parsed JSON data
     */
    async loadJSON(path) {
        // Check cache first
        const cached = this.cache.get(path);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Cache the result
            this.cache.set(path, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`Failed to load JSON from ${path}:`, error);
            throw new Error(`Failed to load data: ${error.message}`);
        }
    }

    /**
     * Load configuration and categories
     * @returns {Promise<object>} Configuration and categories data
     */
    async loadConfig() {
        try {
            const [config, categories] = await Promise.all([
                this.loadJSON(`${this.basePath}/config.json`),
                this.loadJSON(`${this.basePath}/categories.json`)
            ]);

            return {
                config,
                categories,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to load config:', error);
            // Return fallback config
            return {
                config: {
                    site: {
                        title: 'Moltbot - AI Assistant Hub',
                        description: 'OpenClaw/Moltbot Latest News and Skills',
                        version: '2.0.0'
                    }
                },
                categories: {},
                error: error.message
            };
        }
    }

    /**
     * Load news data from JSON files
     * @param {string} month - Month identifier (e.g., '2026-01')
     * @returns {Promise<object>} News data with items array
     */
    async loadNews(month = null) {
        try {
            // If no month specified, load current month
            if (!month) {
                const now = new Date();
                month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }

            const newsData = await this.loadJSON(`${this.basePath}/news/${month}.json`);

            return {
                month: newsData.month,
                items: newsData.items || [],
                count: newsData.items?.length || 0,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to load news:', error);
            return {
                month: month || 'unknown',
                items: [],
                count: 0,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Load all news data across multiple months
     * @param {Array<string>} months - Array of month identifiers
     * @returns {Promise<object>} Aggregated news data
     */
    async loadAllNews(months = null) {
        try {
            // Default to last 3 months if not specified
            if (!months) {
                const now = new Date();
                months = [];
                for (let i = 0; i < 3; i++) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
                }
            }

            const promises = months.map(month => this.loadNews(month));
            const results = await Promise.allSettled(promises);

            const allItems = [];
            const errors = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.items.length > 0) {
                    allItems.push(...result.value.items);
                } else if (result.status === 'rejected') {
                    errors.push({ month: months[index], error: result.reason.message });
                } else if (result.value.error) {
                    errors.push({ month: months[index], error: result.value.error });
                }
            });

            // Sort by date descending
            allItems.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));

            return {
                items: allItems,
                count: allItems.length,
                errors,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to load all news:', error);
            return {
                items: [],
                count: 0,
                errors: [{ error: error.message }],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Load skills data from a specific category
     * @param {string} category - Category file name (e.g., 'productivity')
     * @returns {Promise<object>} Skills data for category
     */
    async loadSkillsCategory(category) {
        try {
            const data = await this.loadJSON(`${this.basePath}/skills/${category}.json`);

            return {
                category: data.category,
                icon: data.icon,
                skills: data.skills || [],
                count: data.skills?.length || 0,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Failed to load skills category ${category}:`, error);
            return {
                category,
                skills: [],
                count: 0,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Load all skills data from all categories
     * @returns {Promise<object>} Aggregated skills data with categories
     */
    async loadAllSkills() {
        try {
            const config = await this.loadConfig();
            const categoryConfigs = config.config?.skills?.categories || [];

            // Load all category files in parallel
            const promises = categoryConfigs.map(cat => this.loadSkillsCategory(cat.id));
            const results = await Promise.allSettled(promises);

            const allSkills = [];
            const categoryData = {};
            const errors = [];

            results.forEach((result, index) => {
                const catConfig = categoryConfigs[index];

                if (result.status === 'fulfilled') {
                    const data = result.value;

                    // Store category info
                    categoryData[catConfig.id] = {
                        name: catConfig.name,
                        icon: catConfig.icon,
                        count: data.count
                    };

                    // Add category to each skill
                    const skillsWithCategory = data.skills.map(skill => ({
                        ...skill,
                        category: catConfig.name,
                        categoryId: catConfig.id
                    }));

                    allSkills.push(...skillsWithCategory);
                } else {
                    errors.push({
                        category: catConfig.id,
                        error: result.reason.message
                    });
                }
            });

            return {
                skills: allSkills,
                categories: categoryData,
                count: allSkills.length,
                errors,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to load all skills:', error);
            return {
                skills: [],
                categories: {},
                count: 0,
                errors: [{ error: error.message }],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Load all data (news and skills) in parallel
     * @param {object} options - Loading options
     * @param {Array<string>} options.newsMonths - Months to load news from
     * @returns {Promise<object>} All aggregated data
     */
    async loadAll(options = {}) {
        try {
            const [config, news, skills] = await Promise.all([
                this.loadConfig(),
                this.loadAllNews(options.newsMonths),
                this.loadAllSkills()
            ]);

            return {
                config: config.config,
                categories: config.categories,
                news: {
                    items: news.items,
                    count: news.count,
                    errors: news.errors
                },
                skills: {
                    skills: skills.skills,
                    categories: skills.categories,
                    count: skills.count,
                    errors: skills.errors
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to load all data:', error);
            return {
                config: {},
                categories: {},
                news: { items: [], count: 0, errors: [error.message] },
                skills: { skills: [], categories: {}, count: 0, errors: [error.message] },
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Filter news by various criteria
     * @param {Array} items - News items to filter
     * @param {object} filters - Filter criteria
     * @returns {Array} Filtered news items
     */
    filterNews(items, filters = {}) {
        let filtered = [...items];

        // Filter by platform type (English/Chinese)
        if (filters.platformType) {
            filtered = filtered.filter(item =>
                item.platform_type === filters.platformType
            );
        }

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(item =>
                filters.tags.some(tag => item.tags?.includes(tag))
            );
        }

        // Filter by platform
        if (filters.platform) {
            filtered = filtered.filter(item =>
                item.platform === filters.platform
            );
        }

        // Filter by date range
        if (filters.startDate) {
            filtered = filtered.filter(item =>
                new Date(item.publish_date) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            filtered = filtered.filter(item =>
                new Date(item.publish_date) <= new Date(filters.endDate)
            );
        }

        return filtered;
    }

    /**
     * Filter skills by category or other criteria
     * @param {Array} items - Skill items to filter
     * @param {object} filters - Filter criteria
     * @returns {Array} Filtered skill items
     */
    filterSkills(items, filters = {}) {
        let filtered = [...items];

        // Filter by category
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(item =>
                item.categoryId === filters.category || item.category === filters.category
            );
        }

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(item =>
                filters.tags.some(tag => item.tags?.includes(tag))
            );
        }

        // Filter by author
        if (filters.author) {
            filtered = filtered.filter(item =>
                item.author?.toLowerCase().includes(filters.author.toLowerCase())
            );
        }

        return filtered;
    }

    /**
     * Search news by text query
     * @param {Array} items - News items to search
     * @param {string} query - Search query
     * @returns {Array} Matching news items
     */
    searchNews(items, query) {
        const lowerQuery = query.toLowerCase();
        return items.filter(item =>
            item.title?.toLowerCase().includes(lowerQuery) ||
            item.summary?.toLowerCase().includes(lowerQuery) ||
            item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            item.platform?.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Search skills by text query
     * @param {Array} items - Skill items to search
     * @param {string} query - Search query
     * @returns {Array} Matching skill items
     */
    searchSkills(items, query) {
        const lowerQuery = query.toLowerCase();
        return items.filter(item =>
            item.title?.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery) ||
            item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            item.name?.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Clear the data cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Data loader cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Create singleton instance
const dataLoader = new DataLoader();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataLoader, dataLoader };
}
