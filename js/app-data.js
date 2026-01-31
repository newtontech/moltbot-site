/**
 * App Data Module
 * Simple, clean API for loading and managing application data.
 * Built on top of data-loader.js
 */

class AppData {
    constructor() {
        this.data = null;
        this.isLoading = false;
        this.loadPromise = null;
        this.listeners = new Set();
    }

    /**
     * Load all application data
     * @param {object} options - Loading options
     * @returns {Promise<object>} Application data
     */
    async load(options = {}) {
        // Return cached data if available
        if (this.data) {
            return this.data;
        }

        // Return existing promise if loading in progress
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.isLoading = true;
        this.loadPromise = dataLoader.loadAll(options);

        try {
            const rawData = await this.loadPromise;

            // Transform data into application format
            this.data = this._transformData(rawData);

            this.isLoading = false;
            this._notifyListeners('loaded', this.data);

            return this.data;
        } catch (error) {
            this.isLoading = false;
            this._notifyListeners('error', error);
            throw error;
        } finally {
            this.loadPromise = null;
        }
    }

    /**
     * Get loaded data (synchronous)
     * @returns {object|null} Application data or null if not loaded
     */
    get() {
        return this.data;
    }

    /**
     * Get news items
     * @param {object} filters - Optional filters
     * @returns {Array} News items
     */
    getNews(filters = {}) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call load() first.');
            return [];
        }

        const items = this.data.news.items;
        return filters && Object.keys(filters).length > 0
            ? dataLoader.filterNews(items, filters)
            : items;
    }

    /**
     * Get skills items
     * @param {object} filters - Optional filters
     * @returns {Array} Skill items
     */
    getSkills(filters = {}) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call load() first.');
            return [];
        }

        const items = this.data.skills.skills;
        return filters && Object.keys(filters).length > 0
            ? dataLoader.filterSkills(items, filters)
            : items;
    }

    /**
     * Get skill categories
     * @returns {Array} Skill categories with counts
     */
    getSkillCategories() {
        if (!this.data) {
            console.warn('Data not loaded yet. Call load() first.');
            return [];
        }

        const categories = this.data.skills.categories;
        return Object.entries(categories).map(([id, info]) => ({
            id,
            name: info.name,
            icon: info.icon,
            count: info.count
        }));
    }

    /**
     * Search news
     * @param {string} query - Search query
     * @returns {Array} Matching news items
     */
    searchNews(query) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call load() first.');
            return [];
        }

        return dataLoader.searchNews(this.data.news.items, query);
    }

    /**
     * Search skills
     * @param {string} query - Search query
     * @returns {Array} Matching skill items
     */
    searchSkills(query) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call load() first.');
            return [];
        }

        return dataLoader.searchSkills(this.data.skills.skills, query);
    }

    /**
     * Refresh data (clear cache and reload)
     * @param {object} options - Loading options
     * @returns {Promise<object>} Fresh application data
     */
    async refresh(options = {}) {
        dataLoader.clearCache();
        this.data = null;
        return this.load(options);
    }

    /**
     * Subscribe to data loading events
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Transform raw data into application format
     * @private
     */
    _transformData(raw) {
        return {
            config: raw.config,
            categories: raw.categories,
            news: {
                items: raw.news.items,
                count: raw.news.count,
                errors: raw.news.errors
            },
            skills: {
                skills: raw.skills.skills,
                categories: raw.skills.categories,
                count: raw.skills.count,
                errors: raw.skills.errors
            },
            timestamp: raw.timestamp
        };
    }

    /**
     * Notify all listeners of events
     * @private
     */
    _notifyListeners(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in data listener:', error);
            }
        });
    }
}

// Create singleton instance
const appData = new AppData();

// Convenience functions for common operations
const DataAPI = {
    /**
     * Load all data
     */
    load: (options) => appData.load(options),

    /**
     * Get all data
     */
    get: () => appData.get(),

    /**
     * Get news items
     */
    getNews: (filters) => appData.getNews(filters),

    /**
     * Get skills items
     */
    getSkills: (filters) => appData.getSkills(filters),

    /**
     * Get skill categories
     */
    getCategories: () => appData.getSkillCategories(),

    /**
     * Search news
     */
    searchNews: (query) => appData.searchNews(query),

    /**
     * Search skills
     */
    searchSkills: (query) => appData.searchSkills(query),

    /**
     * Refresh data
     */
    refresh: (options) => appData.refresh(options),

    /**
     * Subscribe to data events
     */
    subscribe: (callback) => appData.subscribe(callback),

    /**
     * Check if data is loading
     */
    isLoading: () => appData.isLoading,

    /**
     * Clear cache
     */
    clearCache: () => dataLoader.clearCache()
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppData, appData, DataAPI };
}
