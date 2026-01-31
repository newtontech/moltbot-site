// --- STATE MANAGEMENT ---
let currentTab = 'news';
let currentNewsFilter = 'all';
let currentSkillFilter = 'all';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// --- MAIN APP INITIALIZATION ---
function initializeApp() {
    // Initialize global state
    initGlobalState();

    // Initial render
    renderInitialView();
}

// --- GLOBAL STATE INITIALIZATION ---
function initGlobalState() {
    // Reset to default state
    currentTab = 'news';
    currentNewsFilter = 'all';
    currentSkillFilter = 'all';

    // Set up event listeners for navigation
    setupNavigationHandlers();

    // Set up event listeners for filters
    setupFilterHandlers();
}

// --- NAVIGATION HANDLERS ---
function setupNavigationHandlers() {
    // Tab switching is handled via onclick attributes in HTML
    // This function is a placeholder for future event delegation
}

// --- FILTER HANDLERS ---
function setupFilterHandlers() {
    // News and skill filters are handled via onclick attributes in HTML
    // This function is a placeholder for future event delegation
}

// --- INITIAL RENDER ---
async function renderInitialView() {
    try {
        // Load all data using dataLoader
        const allData = await dataLoader.loadAll();

        // Update global data object with loaded data
        if (typeof data !== 'undefined') {
            data.news = {
                project_info: allData.config?.site || {},
                news_items: allData.news.items || []
            };
            data.skills = {
                skills: allData.skills.skills || [],
                categories: allData.skills.categories || {}
            };
        }

        // Also update data.news to include items for backward compatibility
        if (typeof data !== 'undefined' && allData.news) {
            data.news.items = allData.news.items || [];
        }

        // Render news with loaded data
        if (typeof renderNews === 'function') {
            renderNews(currentNewsFilter);
        }

        // Render skills with loaded data
        if (typeof renderSkills === 'function') {
            renderSkills(currentSkillFilter, allData.skills);
        }

        console.log('Data loaded successfully:', {
            newsCount: allData.news.count,
            skillsCount: allData.skills.count
        });
    } catch (error) {
        console.error('Failed to load data:', error);

        // Show error message
        const newsGrid = document.getElementById('news-grid');
        const skillsGrid = document.getElementById('skills-grid');

        if (newsGrid) {
            newsGrid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <div>数据加载失败</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                        ${error.message}
                    </div>
                </div>
            `;
        }

        if (skillsGrid) {
            skillsGrid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <div>数据加载失败</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                        ${error.message}
                    </div>
                </div>
            `;
        }
    }
}

// --- TAB SWITCHING ---
function switchTab(tab, btn) {
    currentTab = tab;

    // Update UI
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${tab}-section`).classList.add('active');
}

// --- NEWS FILTERING ---
function filterNews(filter, btn) {
    currentNewsFilter = filter;

    // Update filter button states
    document.querySelectorAll('#news-section .filter-chip').forEach(chip => chip.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    }

    // Re-render news with new filter (using global data object)
    if (typeof renderNews === 'function') {
        const newsData = typeof data !== 'undefined' ? data.news : null;
        renderNews(filter, newsData);
    }
}

// --- SKILL FILTERING ---
function filterSkills(category, btn) {
    currentSkillFilter = category;

    // Update filter button states
    document.querySelectorAll('.skill-filter-btn').forEach(button => button.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    }

    // Re-render skills with new filter (using global data object)
    if (typeof renderSkills === 'function') {
        const skillsData = typeof data !== 'undefined' ? data.skills : null;
        renderSkills(category, skillsData);
    }
}

// --- UTILITY: COPY TO CLIPBOARD ---
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ 已复制!';
        setTimeout(() => btn.innerHTML = original, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        btn.innerHTML = '❌ 复制失败';
        setTimeout(() => btn.innerHTML = '📋 复制', 2000);
    });
}
