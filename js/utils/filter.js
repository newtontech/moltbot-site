/**
 * Filter Utility Module
 * Handles all filtering, tab switching, and state management for the Moltbot site
 */

// Filter State Management
const FilterState = {
    currentTab: 'news',
    currentNewsFilter: 'all',
    currentSkillFilter: 'all',

    // Set tab state
    setTab(tab) {
        this.currentTab = tab;
    },

    // Set news filter state
    setNewsFilter(filter) {
        this.currentNewsFilter = filter;
    },

    // Set skill filter state
    setSkillFilter(category) {
        this.currentSkillFilter = category;
    },

    // Get current states
    getCurrentTab() {
        return this.currentTab;
    },

    getCurrentNewsFilter() {
        return this.currentNewsFilter;
    },

    getCurrentSkillFilter() {
        return this.currentSkillFilter;
    }
};

/**
 * Filter news items based on the selected filter type
 * @param {string} filter - The filter type ('all', 'news', 'showcase', 'code', 'screenshot')
 * @param {HTMLElement} btn - The button element that was clicked
 */
function filterNews(filter, btn) {
    // Update state
    FilterState.setNewsFilter(filter);

    // Remove active class from all filter chips
    document.querySelectorAll('#news-section .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });

    // Add active class to clicked button
    btn.classList.add('active');

    // Re-render news with the new filter
    if (typeof renderNews === 'function') {
        renderNews(filter);
    }
}

/**
 * Filter skills items based on the selected category
 * @param {string} category - The category name ('all', '生产力', 'AI/LLM', '开发', '智能家居', '浏览器自动化')
 * @param {HTMLElement} btn - The button element that was clicked
 */
function filterSkills(category, btn) {
    // Update state
    FilterState.setSkillFilter(category);

    // Remove active class from all skill filter buttons
    document.querySelectorAll('.skill-filter-btn').forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to clicked button
    btn.classList.add('active');

    // Re-render skills with the new filter
    if (typeof renderSkills === 'function') {
        renderSkills(category);
    }
}

/**
 * Switch between main tabs (news and skills)
 * @param {string} tab - The tab name ('news' or 'skills')
 * @param {HTMLElement} btn - The button element that was clicked
 */
function switchTab(tab, btn) {
    // Update state
    FilterState.setTab(tab);

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
    });

    // Remove active class from all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Add active class to clicked button
    btn.classList.add('active');

    // Show the selected section
    const targetSection = document.getElementById(`${tab}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

/**
 * Toggle active class on a button or element
 * @param {HTMLElement} element - The element to toggle active state on
 * @param {string} className - The class name to toggle (default: 'active')
 */
function toggleActiveClass(element, className = 'active') {
    if (!element) return;

    const isActive = element.classList.contains(className);

    if (isActive) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

/**
 * Set active class on a single element and remove from siblings
 * @param {HTMLElement} element - The element to activate
 * @param {NodeList} siblings - Sibling elements to deactivate
 * @param {string} className - The class name to use (default: 'active')
 */
function setActiveOnly(element, siblings, className = 'active') {
    if (!element) return;

    // Remove active class from all siblings
    siblings.forEach(sibling => {
        sibling.classList.remove(className);
    });

    // Add active class to the target element
    element.classList.add(className);
}

/**
 * Reset all filters to default state
 */
function resetAllFilters() {
    // Reset state
    FilterState.setNewsFilter('all');
    FilterState.setSkillFilter('all');

    // Reset news filter buttons
    const newsButtons = document.querySelectorAll('#news-section .filter-chip');
    newsButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === 0) btn.classList.add('active'); // First button (All)
    });

    // Reset skill filter buttons
    const skillButtons = document.querySelectorAll('.skill-filter-btn');
    skillButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === 0) btn.classList.add('active'); // First button (All)
    });

    // Re-render with default filters
    if (typeof renderNews === 'function') {
        renderNews('all');
    }
    if (typeof renderSkills === 'function') {
        renderSkills('all');
    }
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FilterState,
        filterNews,
        filterSkills,
        switchTab,
        toggleActiveClass,
        setActiveOnly,
        resetAllFilters
    };
}
