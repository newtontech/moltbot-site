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
function renderInitialView() {
    // Skills need JavaScript rendering
    if (typeof renderSkills === 'function') {
        renderSkills(currentSkillFilter);
    }

    // News cards have static HTML, no initial render needed
    // They are only rendered when filters are applied
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
    btn.classList.add('active');

    // Re-render news with new filter
    if (typeof renderNews === 'function') {
        renderNews(filter);
    }
}

// --- SKILL FILTERING ---
function filterSkills(category, btn) {
    currentSkillFilter = category;

    // Update filter button states
    document.querySelectorAll('.skill-filter-btn').forEach(button => button.classList.remove('active'));
    btn.classList.add('active');

    // Re-render skills with new filter
    if (typeof renderSkills === 'function') {
        renderSkills(category);
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
