// --- STATE MANAGEMENT ---
let currentTab = 'news';
let currentNewsFilter = 'all';
let currentSkillFilter = 'all';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing...');
    initializeApp();
});

// --- MAIN APP INITIALIZATION ---
async function initializeApp() {
    console.log('📥 Initializing app...');

    // Show loading state
    showLoadingState();

    try {
        // Load all data using dataLoader
        console.log('📥 Loading data...');
        const allData = await dataLoader.loadAll();
        if (allData?.hasFatalError) {
            throw new Error(allData.error || '数据加载失败：请检查数据文件路径与 GitHub Pages 子路径配置');
        }
        console.log('✅ Data loaded:', {
            newsCount: allData.news?.count || 0,
            skillsCount: allData.skills?.count || 0,
            timestamp: allData.timestamp
        });

        // Update global data object
        if (typeof data !== 'undefined') {
            data.news = {
                project_info: allData.config?.site || {},
                news_items: allData.news.items || []
            };
            data.skills = {
                skills: allData.skills.skills || [],
                categories: allData.skills.categories || {}
            };
            console.log('✅ Global data object updated:', {
                newsItems: data.news.news_items?.length || 0,
                skills: data.skills.skills?.length || 0,
                categories: Object.keys(data.skills.categories || {}).length
            });
        }

        // Render news with loaded data
        if (typeof renderNews === 'function') {
            console.log('📥 Rendering news...');
            renderNews(currentNewsFilter);
            console.log('✅ News rendered');
        }

        // Render skills with loaded data
        if (typeof renderSkills === 'function') {
            console.log('📥 Rendering skills...');
            renderSkills(currentSkillFilter, allData.skills);
            console.log('✅ Skills rendered');
        }

        console.log('✅ App initialized successfully');

    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        showErrorState(error);
    }
}

// --- LOADING STATE ---
function showLoadingState() {
    console.log('📥 Showing loading state...');

    const newsGrid = document.getElementById('news-grid');
    const skillsGrid = document.getElementById('skills-grid');

    if (newsGrid) {
        newsGrid.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                <div style="font-size: 2rem;">⏳</div>
                <div>正在加载数据...</div>
            </div>
        `;
        console.log('✅ News loading state set');
    }

    if (skillsGrid) {
        skillsGrid.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                <div style="font-size: 2rem;">⏳</div>
                <div>正在加载数据...</div>
            </div>
        `;
        console.log('✅ Skills loading state set');
    }
}

function showErrorState(error) {
    console.log('📥 Showing error state...');

    const newsGrid = document.getElementById('news-grid');
    const skillsGrid = document.getElementById('skills-grid');

    const errorMsg = `
        <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <div>数据加载失败</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                ${error.message}
            </div>
            <div style="font-size: 0.8rem; margin-top: 1rem; opacity: 0.5;">
                请刷新页面重试
            </div>
        </div>
    `;

    if (newsGrid) {
        newsGrid.innerHTML = errorMsg;
        console.log('✅ News error state set');
    }

    if (skillsGrid) {
        skillsGrid.innerHTML = errorMsg;
        console.log('✅ Skills error state set');
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
        console.log('📥 Filtering news:', filter, 'with data:', newsData);
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
        console.log('📥 Filtering skills:', category, 'with data:', skillsData);
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

console.log('✅ App script loaded');
