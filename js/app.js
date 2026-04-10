/* ============================================================
   LearnFlow – All Page Logic & Interactions
   js/app.js
   ============================================================ */

'use strict';

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
const State = {
  currentPage: 'home',
  currentTheme: localStorage.getItem('lf-theme')  || 'dark',
  currentAccent: localStorage.getItem('lf-accent') || 'violet',
  selectedDomain: null,
  courseView: 'grid',   // 'grid' | 'list'
  courseSort: 'popular',
  activeCategoryId: null,
  activeSubId: null,
  liveFilters: { topics: [], levels: [], times: [] },
  selectedSession: null,
  searchQuery: '',
  searchOpen: false,
};

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(State.currentTheme);
  applyAccent(State.currentAccent);
  syncThemeUI();
  syncAccentUI();

  buildTicker();
  buildDomainGrid();
  buildRecommended();
  buildContinueLearning();
  buildCourseTree();
  buildCoursesDisplay();
  buildLiveTopicFilters();
  buildLiveSessions();
  buildCertificateModal();

  updateTotalCount();

  wireNavigation();
  wireHeader();
  wireSearch();
  wireProfileDropdown();
  wireSettings();
  wireLiveFilters();
  wireModals();
  wireScrollHeader();

  // Deep-link via hash
  const hash = location.hash.replace('#', '');
  if (['home', 'courses', 'live'].includes(hash)) navigateTo(hash);
});

// ═══════════════════════════════════════════════════════
// THEME & ACCENT
// ═══════════════════════════════════════════════════════
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  State.currentTheme = theme;
  localStorage.setItem('lf-theme', theme);
  // Sync header icon
  const sun  = document.getElementById('theme-icon-sun');
  const moon = document.getElementById('theme-icon-moon');
  if (sun && moon) {
    sun.style.display  = theme === 'dark'  ? 'block' : 'none';
    moon.style.display = theme === 'light' ? 'block' : 'none';
  }
}

function applyAccent(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  State.currentAccent = accent;
  localStorage.setItem('lf-accent', accent);
}

function syncThemeUI() {
  document.querySelectorAll('.theme-option').forEach(btn => {
    const active = btn.dataset.theme === State.currentTheme;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-checked', active);
  });
}

function syncAccentUI() {
  document.querySelectorAll('.accent-swatch').forEach(btn => {
    const active = btn.dataset.accent === State.currentAccent;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-checked', active);
  });
}

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
function navigateTo(page) {
  if (!['home', 'courses', 'live'].includes(page)) return;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.page === page;
    link.classList.toggle('active', active);
  });

  // Update hash
  history.pushState(null, '', `#${page}`);
  State.currentPage = page;

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function wireNavigation() {
  // Main nav links
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const page = el.dataset.page;
      if (page) navigateTo(page);
    });
  });

  // Hero buttons
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => navigateTo('courses'));
  document.getElementById('hero-live-btn')?.addEventListener('click', () => navigateTo('live'));
  document.getElementById('footer-logo')?.addEventListener('click', e => { e.preventDefault(); navigateTo('home'); });
  document.getElementById('nav-home-logo')?.addEventListener('click', e => { e.preventDefault(); navigateTo('home'); });
}

// ═══════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════
function wireHeader() {
  // Theme toggle button (top-right sun/moon)
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    const next = State.currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    syncThemeUI();
    // Sync settings modal buttons too
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === next);
      btn.setAttribute('aria-checked', btn.dataset.theme === next);
    });
  });

  // Notification bell
  document.getElementById('notif-btn')?.addEventListener('click', () => {
    showToast('🔔 No new notifications', 'info');
    // Remove dot
    const dot = document.querySelector('.notif-dot');
    if (dot) dot.style.display = 'none';
  });
}

function wireScrollHeader() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════
function wireSearch() {
  const input    = document.getElementById('global-search');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    State.searchQuery = q;
    if (q.length < 2) { closeSearch(); return; }
    renderSearchResults(q);
  });

  input.addEventListener('focus', () => {
    if (State.searchQuery.length >= 2) renderSearchResults(State.searchQuery);
  });

  // Keyboard shortcut ⌘K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === 'Escape') closeSearch();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-wrapper')) closeSearch();
  });
}

function renderSearchResults(q) {
  const dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;

  const results = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) ||
    (item.sub && item.sub.toLowerCase().includes(q))
  ).slice(0, 8);

  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-empty">No results for "<strong>${escHtml(q)}</strong>"</div>`;
    dropdown.classList.add('open');
    return;
  }

  const grouped = { course: [], live: [], domain: [] };
  results.forEach(r => { if (grouped[r.type]) grouped[r.type].push(r); });

  let html = '';
  const labels = { course: '📚 Courses', live: '🔴 Live Sessions', domain: '🗂 Domains' };

  Object.entries(grouped).forEach(([type, items]) => {
    if (!items.length) return;
    html += `<div class="search-section-label">${labels[type]}</div>`;
    items.forEach(item => {
      html += `
        <div class="search-item" tabindex="0" role="option"
             data-page="${item.page}" data-id="${item.id}"
             onclick="handleSearchSelect(this)">
          <div class="search-item-icon">${item.type === 'live' ? '<span style="font-size:.75rem;font-weight:700">' + item.emoji + '</span>' : item.emoji}</div>
          <div class="search-item-text">
            <strong>${highlight(escHtml(item.title), q)}</strong>
            <span>${escHtml(item.sub || '')}</span>
          </div>
          <span class="search-item-type">${type === 'course' ? 'Course' : type === 'live' ? 'Live' : 'Domain'}</span>
        </div>`;
    });
    html += '<div class="search-divider"></div>';
  });

  dropdown.innerHTML = html;
  dropdown.classList.add('open');
}

window.handleSearchSelect = function(el) {
  const page = el.dataset.page;
  closeSearch();
  navigateTo(page);
  document.getElementById('global-search').value = '';
};

function closeSearch() {
  const dropdown = document.getElementById('search-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function highlight(text, q) {
  if (!q) return text;
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--accent-glow);color:var(--accent-1);border-radius:2px;padding:0 2px">$1</mark>');
}

// ═══════════════════════════════════════════════════════
// PROFILE DROPDOWN
// ═══════════════════════════════════════════════════════
function wireProfileDropdown() {
  const trigger  = document.getElementById('profile-trigger');
  const dropdown = document.getElementById('profile-dropdown');
  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const open = dropdown.classList.contains('open');
    if (open) closeProfileDropdown();
    else openProfileDropdown();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#profile-wrapper')) closeProfileDropdown();
  });

  // Keyboard nav
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
  });

  // Menu items
  document.getElementById('dd-settings')?.addEventListener('click', () => {
    closeProfileDropdown();
    openSettingsModal();
  });

  document.getElementById('dd-cert-download')?.addEventListener('click', () => {
    closeProfileDropdown();
    openCertModal();
  });

  document.getElementById('dd-certificates')?.addEventListener('click', e => {
    e.preventDefault();
    closeProfileDropdown();
    openCertModal();
  });

  document.getElementById('dd-my-learning')?.addEventListener('click', e => {
    e.preventDefault();
    closeProfileDropdown();
    navigateTo('courses');
  });

  document.getElementById('dd-logout')?.addEventListener('click', () => {
    closeProfileDropdown();
    showToast('👋 Logged out successfully. See you tomorrow!', 'info');
  });
}

function openProfileDropdown() {
  const trigger  = document.getElementById('profile-trigger');
  const dropdown = document.getElementById('profile-dropdown');
  trigger?.setAttribute('aria-expanded', 'true');
  dropdown?.classList.add('open');
}

function closeProfileDropdown() {
  const trigger  = document.getElementById('profile-trigger');
  const dropdown = document.getElementById('profile-dropdown');
  trigger?.setAttribute('aria-expanded', 'false');
  dropdown?.classList.remove('open');
}

// ═══════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════
function wireSettings() {
  // Theme options inside modal
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-option').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // Accent swatches inside modal
  document.querySelectorAll('.accent-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.accent-swatch').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // Save
  document.getElementById('settings-save-btn')?.addEventListener('click', () => {
    const themeBtn  = document.querySelector('.theme-option.active');
    const accentBtn = document.querySelector('.accent-swatch.active');
    if (themeBtn)  applyTheme(themeBtn.dataset.theme);
    if (accentBtn) applyAccent(accentBtn.dataset.accent);
    closeSettingsModal();
    showToast('✅ Settings saved!', 'success');
  });

  // Cancel
  document.getElementById('settings-cancel-btn')?.addEventListener('click', closeSettingsModal);
  document.getElementById('settings-modal-close')?.addEventListener('click', closeSettingsModal);
  document.getElementById('settings-modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSettingsModal();
  });
}

function openSettingsModal() {
  syncThemeUI();
  syncAccentUI();
  const overlay = document.getElementById('settings-modal-overlay');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeSettingsModal() {
  const overlay = document.getElementById('settings-modal-overlay');
  if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
}

// ═══════════════════════════════════════════════════════
// CERTIFICATE MODAL
// ═══════════════════════════════════════════════════════
function buildCertificateModal() {
  const body = document.getElementById('cert-modal-body');
  if (!body) return;

  let html = '<div class="cert-list">';
  CERTIFICATES.forEach(cert => {
    html += `
      <div class="cert-item">
        <div class="cert-icon">${cert.emoji}</div>
        <div class="cert-info">
          <div class="cert-title">${escHtml(cert.title)}</div>
          <div class="cert-meta">${escHtml(cert.instructor)}</div>
          <div class="cert-date">${escHtml(cert.date)} &nbsp;·&nbsp; ID: ${escHtml(cert.credentialId)}</div>
        </div>
        <button class="cert-download-btn" onclick="downloadCert('${cert.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF
        </button>
      </div>`;
  });
  html += '</div>';
  body.innerHTML = html;
}

window.downloadCert = function(id) {
  const cert = CERTIFICATES.find(c => c.id === id);
  if (cert) showToast(`⬇️ Downloading "${cert.title.slice(0, 30)}…"`, 'success');
};

function openCertModal() {
  const overlay = document.getElementById('cert-modal-overlay');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeCertModal() {
  const overlay = document.getElementById('cert-modal-overlay');
  if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
}

function wireModals() {
  document.getElementById('cert-modal-close')?.addEventListener('click', closeCertModal);
  document.getElementById('cert-modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCertModal();
  });
  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSettingsModal(); closeCertModal(); }
  });
}

// ═══════════════════════════════════════════════════════
// TICKER
// ═══════════════════════════════════════════════════════
function buildTicker() {
  const inner = document.getElementById('ticker-inner');
  if (!inner) return;

  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  inner.innerHTML = items.map(item => `
    <span class="ticker-item">
      ${escHtml(item.text)}
      <span class="ticker-tag">${escHtml(item.tag)}</span>
    </span>
  `).join('');

  // Adjust animation duration based on content width
  const totalWidth = inner.scrollWidth / 2;
  const speed = totalWidth / 60; // 60px/s
  inner.style.animationDuration = `${speed}s`;
}

// ═══════════════════════════════════════════════════════
// HOME – DOMAIN GRID
// ═══════════════════════════════════════════════════════
function buildDomainGrid() {
  const grid = document.getElementById('domain-grid');
  if (!grid) return;

  grid.innerHTML = DOMAINS.map(d => `
    <div class="domain-card" role="listitem" data-domain="${d.id}"
         onclick="filterByDomain('${d.id}')"
         tabindex="0" aria-label="${d.name} — ${d.count} courses">
      <div class="domain-emoji">${d.emoji}</div>
      <div class="domain-name">${escHtml(d.name)}</div>
      <div class="domain-count">${d.count} courses</div>
    </div>
  `).join('');
}

window.filterByDomain = function(domainId) {
  const domain = DOMAINS.find(d => d.id === domainId);
  if (!domain) return;

  // Toggle active state
  const already = State.selectedDomain === domainId;
  State.selectedDomain = already ? null : domainId;

  document.querySelectorAll('.domain-card').forEach(el => {
    el.classList.toggle('active', el.dataset.domain === State.selectedDomain);
  });

  // Update recommended section
  buildRecommended(State.selectedDomain);
};

// ═══════════════════════════════════════════════════════
// HOME – RECOMMENDED COURSES
// ═══════════════════════════════════════════════════════
function buildRecommended(domainFilter = null) {
  const grid = document.getElementById('recommended-grid');
  if (!grid) return;

  let courses = domainFilter
    ? COURSES.filter(c => c.domain === domainFilter)
    : COURSES.slice(0, 6);

  if (!courses.length) {
    grid.innerHTML = `<p style="color:var(--text-muted);padding:var(--space-8)">No courses found for this domain yet.</p>`;
    return;
  }

  grid.innerHTML = courses.slice(0, 6).map(c => buildCourseCard(c)).join('');
}

// ═══════════════════════════════════════════════════════
// HOME – CONTINUE LEARNING
// ═══════════════════════════════════════════════════════
function buildContinueLearning() {
  const grid = document.getElementById('continue-grid');
  if (!grid) return;

  grid.innerHTML = CONTINUE_COURSES.map(c => `
    <div class="continue-card" role="listitem" tabindex="0"
         aria-label="Continue ${c.title}"
         onclick="showToast('▶️ Resuming ${escHtml(c.title).slice(0,30)}…', 'info')">
      <div class="continue-thumb">${c.emoji}</div>
      <div class="continue-info">
        <div class="continue-title">${escHtml(c.title)}</div>
        <div class="continue-instructor">${escHtml(c.instructor)}</div>
        <div class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${c.progress}%"></div>
          </div>
          <span class="progress-pct">${c.progress}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════
// COURSES PAGE – TREE SIDEBAR
// ═══════════════════════════════════════════════════════
function buildCourseTree() {
  const tree = document.getElementById('sidebar-tree');
  if (!tree) return;

  tree.innerHTML = COURSE_TREE.map(cat => `
    <div class="tree-category" data-cat="${cat.id}">
      <div class="tree-category-header" role="treeitem" aria-expanded="false"
           tabindex="0" onclick="toggleTreeCategory('${cat.id}', this)">
        <span>
          <span class="tree-category-icon">${cat.emoji}</span>
          ${escHtml(cat.label)}
        </span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="tree-count">${cat.count}</span>
          <svg class="tree-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
      <div class="tree-subcategories" id="sub-${cat.id}">
        ${cat.children.map(sub => `
          <div class="tree-subitem" role="treeitem" tabindex="-1"
               data-cat="${cat.id}" data-sub="${sub.id}"
               onclick="filterCoursesBySubcat('${cat.id}', '${sub.id}', this)">
            <span>${escHtml(sub.label)}</span>
            <span class="tree-subitem-count">${sub.count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Filter sidebar search
  document.getElementById('courses-filter-input')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.tree-category').forEach(catEl => {
      const catLabel = catEl.querySelector('.tree-category-header span')?.textContent?.toLowerCase() || '';
      const subItems = catEl.querySelectorAll('.tree-subitem');
      let anyVisible = catLabel.includes(q);
      subItems.forEach(sub => {
        const match = sub.textContent.toLowerCase().includes(q);
        sub.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      catEl.style.display = anyVisible ? '' : 'none';
      if (anyVisible && q) {
        // Auto-expand
        const header = catEl.querySelector('.tree-category-header');
        const subCont = catEl.querySelector('.tree-subcategories');
        if (!header.classList.contains('open')) {
          header.classList.add('open');
          subCont.classList.add('open');
        }
      }
    });
  });
}

window.toggleTreeCategory = function(catId, headerEl) {
  const subCont = document.getElementById(`sub-${catId}`);
  if (!subCont) return;
  const isOpen = headerEl.classList.contains('open');
  // Close all first
  document.querySelectorAll('.tree-category-header').forEach(h => h.classList.remove('open'));
  document.querySelectorAll('.tree-subcategories').forEach(s => s.classList.remove('open'));

  if (!isOpen) {
    headerEl.classList.add('open');
    subCont.classList.add('open');
    headerEl.setAttribute('aria-expanded', 'true');
  } else {
    headerEl.setAttribute('aria-expanded', 'false');
  }

  // Filter by domain
  const cat = COURSE_TREE.find(c => c.id === catId);
  if (cat) {
    State.activeCategoryId = isOpen ? null : catId;
    State.activeSubId = null;
    buildCoursesDisplay();
    updateResultsCount();
  }
};

window.filterCoursesBySubcat = function(catId, subId, el) {
  const already = State.activeSubId === subId && State.activeCategoryId === catId;
  State.activeCategoryId = already ? null : catId;
  State.activeSubId      = already ? null : subId;

  document.querySelectorAll('.tree-subitem').forEach(s => s.classList.remove('active'));
  if (!already) el.classList.add('active');

  buildCoursesDisplay();
  updateResultsCount();
};

// ═══════════════════════════════════════════════════════
// COURSES PAGE – DISPLAY
// ═══════════════════════════════════════════════════════
function buildCoursesDisplay() {
  const display = document.getElementById('courses-display');
  if (!display) return;

  let courses = getFilteredCourses();

  display.className = `courses-display ${State.courseView === 'grid' ? 'grid-mode' : 'list-mode'}`;

  if (!courses.length) {
    display.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:var(--space-16);color:var(--text-muted)">
      <div style="font-size:3rem;margin-bottom:var(--space-4)">🔍</div>
      <p style="font-size:1.1rem;font-weight:600;margin-bottom:var(--space-2)">No courses found</p>
      <p>Try selecting a different category or clearing the filter.</p>
    </div>`;
    return;
  }

  display.innerHTML = courses.map(c => buildCourseCard(c)).join('');
}

function getFilteredCourses() {
  let courses = [...COURSES];

  // Domain/subcategory filter
  if (State.activeCategoryId) {
    courses = courses.filter(c => c.domain === State.activeCategoryId);
  }
  // Note: subId filter would require subcategory tags on courses; for demo we just use domain
  if (State.activeSubId) {
    // Show same domain courses (subcategory filtering is illustrative)
    courses = courses.filter(c => c.domain === State.activeCategoryId);
  }

  // Sort
  switch (State.courseSort) {
    case 'newest':   courses.sort((a, b) => b.id.localeCompare(a.id)); break;
    case 'rating':   courses.sort((a, b) => b.rating - a.rating); break;
    case 'price-low':courses.sort((a, b) => a.price - b.price); break;
    default:         courses.sort((a, b) => parseInt(b.students) - parseInt(a.students)); break;
  }

  return courses;
}

function updateResultsCount() {
  const count = getFilteredCourses().length;
  const el = document.getElementById('results-count');
  if (el) {
    const sub = State.activeCategoryId
      ? COURSE_TREE.find(c => c.id === State.activeCategoryId)?.label || ''
      : '';
    el.innerHTML = `Showing <strong>${count}</strong> ${sub ? `"${sub}" ` : ''}courses`;
  }
}

function updateTotalCount() {
  const el = document.getElementById('total-courses-count');
  if (el) el.textContent = COURSES.length;
}

// ── Course Card Builder ──
function buildCourseCard(c) {
  const badgeHtml = c.badge
    ? `<div class="course-badge-row"><span class="course-badge badge-${c.badge}">${c.badge.charAt(0).toUpperCase() + c.badge.slice(1)}</span></div>`
    : '';

  const priceHtml = c.price === 0
    ? `<span class="course-price course-price-free">FREE</span>`
    : `<span class="course-price">₹${c.price.toLocaleString('en-IN')}</span>
       ${c.originalPrice ? `<span class="course-price-original">₹${c.originalPrice.toLocaleString('en-IN')}</span>` : ''}`;

  const discount = (c.originalPrice && c.price > 0)
    ? Math.round((1 - c.price / c.originalPrice) * 100)
    : 0;

  return `
    <div class="course-card" role="listitem" tabindex="0"
         aria-label="${escHtml(c.title)}"
         onclick="enrollCourse('${c.id}')">
      <div style="position:relative">
        <div class="course-thumb-placeholder">${c.emoji}</div>
        ${badgeHtml}
        ${discount > 0 ? `<div style="position:absolute;top:var(--space-3);right:var(--space-3);background:hsl(0,75%,58%);color:#fff;font-size:.7rem;font-weight:700;padding:2px 7px;border-radius:var(--radius-full)">-${discount}%</div>` : ''}
      </div>
      <div class="course-body">
        <div class="course-domain-tag">${escHtml(c.domainLabel)}</div>
        <div class="course-title">${escHtml(c.title)}</div>
        <div class="course-instructor">by ${escHtml(c.instructor)}</div>
        <div class="course-meta">
          <div class="course-rating">
            <span class="stars">${starRating(c.rating)}</span>
            <span class="rating-val">${c.rating} (${(c.reviews/1000).toFixed(1)}K)</span>
          </div>
          <span class="level-pill level-${c.level}">${c.level}</span>
        </div>
        <div class="course-meta">
          <span class="course-duration">⏱ ${c.duration}</span>
          <span class="course-students">👥 ${c.students} students</span>
        </div>
      </div>
      <div class="course-footer">
        <div>${priceHtml}</div>
        <button class="course-enroll-btn" onclick="event.stopPropagation();enrollCourse('${c.id}')">
          ${c.price === 0 ? 'Enrol Free' : 'Enrol Now'}
        </button>
      </div>
    </div>`;
}

window.enrollCourse = function(courseId) {
  const course = COURSES.find(c => c.id === courseId);
  if (course) showToast(`🎉 Enrolled in "${course.title.slice(0, 40)}…"`, 'success');
};

// View toggle & sort
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('grid-view-btn')?.addEventListener('click', () => {
    State.courseView = 'grid';
    document.getElementById('grid-view-btn').classList.add('active');
    document.getElementById('list-view-btn').classList.remove('active');
    document.getElementById('grid-view-btn').setAttribute('aria-pressed', 'true');
    document.getElementById('list-view-btn').setAttribute('aria-pressed', 'false');
    buildCoursesDisplay();
  });
  document.getElementById('list-view-btn')?.addEventListener('click', () => {
    State.courseView = 'list';
    document.getElementById('list-view-btn').classList.add('active');
    document.getElementById('grid-view-btn').classList.remove('active');
    document.getElementById('list-view-btn').setAttribute('aria-pressed', 'true');
    document.getElementById('grid-view-btn').setAttribute('aria-pressed', 'false');
    buildCoursesDisplay();
  });
  document.getElementById('sort-select')?.addEventListener('change', e => {
    State.courseSort = e.target.value;
    buildCoursesDisplay();
  });
});

// ═══════════════════════════════════════════════════════
// LIVE PAGE – FILTERS
// ═══════════════════════════════════════════════════════
function buildLiveTopicFilters() {
  const container = document.getElementById('live-topic-filters');
  if (!container) return;

  const topics = [...new Set(LIVE_SESSIONS.map(s => s.topicLabel))];
  container.innerHTML = topics.map(t => `
    <label class="filter-chip">
      <input type="checkbox" value="${escHtml(t)}" class="live-filter-check" />
      ${escHtml(t)}
    </label>
  `).join('');
}

function wireLiveFilters() {
  document.addEventListener('change', e => {
    if (e.target.classList.contains('live-filter-check') || e.target.classList.contains('live-time-check') ) {
      collectLiveFilters();
      buildLiveSessions();
    }
  });

  document.getElementById('reset-live-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.live-filter-check, .live-time-check').forEach(el => el.checked = false);
    State.liveFilters = { topics: [], levels: [], times: [] };
    buildLiveSessions();
  });
}

function collectLiveFilters() {
  const topics = [...document.querySelectorAll('.live-filter-check:checked')].map(el => el.value);
  const levels = [...document.querySelectorAll('.live-level-filters .live-filter-check:checked')].map(el => el.value);
  const times  = [...document.querySelectorAll('.live-time-check:checked')].map(el => el.value);
  State.liveFilters = { topics, levels, times };
}

// ═══════════════════════════════════════════════════════
// LIVE PAGE – SESSIONS LIST
// ═══════════════════════════════════════════════════════
function buildLiveSessions() {
  const list  = document.getElementById('live-sessions-list');
  const badge = document.getElementById('live-count-badge');
  if (!list) return;

  let sessions = filterLiveSessions();

  if (badge) badge.textContent = `${sessions.length} session${sessions.length !== 1 ? 's' : ''}`;

  if (!sessions.length) {
    list.innerHTML = `<div style="text-align:center;padding:var(--space-16);color:var(--text-muted)">
      <div style="font-size:3rem;margin-bottom:var(--space-4)">📭</div>
      <p style="font-weight:600;margin-bottom:var(--space-2)">No sessions match your filters</p>
      <p>Try resetting or changing your filter selection.</p>
    </div>`;
    return;
  }

  list.innerHTML = sessions.map(s => buildSessionCard(s)).join('');

  // Auto-select first session (show AI summary)
  if (sessions.length > 0) selectSession(sessions[0].id);
}

function filterLiveSessions() {
  const { topics, levels } = State.liveFilters;
  return LIVE_SESSIONS.filter(s => {
    if (topics.length && !topics.includes(s.topicLabel)) return false;
    if (levels.length && !levels.includes(s.level))      return false;
    return true;
  });
}

function buildSessionCard(s) {
  const statusClass = s.status === 'live' ? 'status-live' : 'status-upcoming';
  const statusText  = s.status === 'live' ? '🔴 LIVE' : '⏰ Upcoming';
  const viewersText = s.status === 'live' ? `${s.viewers} watching` : `${s.enrolled.toLocaleString('en-IN')} registered`;

  return `
    <div class="session-card" id="session-${s.id}" role="listitem"
         onclick="selectSession('${s.id}')">
      <div class="session-card-inner">
        <div class="session-avatar">${s.instructorInitial}</div>
        <div class="session-info">
          <div class="session-top">
            <span class="session-status ${statusClass}">${statusText}</span>
            <span class="level-pill level-${s.level}">${s.level}</span>
          </div>
          <div class="session-title">${escHtml(s.title)}</div>
          <div class="session-instructor">by ${escHtml(s.instructor)}</div>
          <div class="session-tags">${s.tags.map(t => `<span class="session-tag">${escHtml(t)}</span>`).join('')}</div>
        </div>
      </div>
      <div class="session-meta">
        <span class="session-meta-item">⏱ ${s.duration}</span>
        <span class="session-meta-item">${s.status === 'live' ? '👁' : '📅'} ${viewersText}</span>
        <span class="session-meta-item">🕒 ${s.startTime}</span>
      </div>
      <button class="join-session-btn" onclick="event.stopPropagation();joinSession('${s.id}')">
        ${s.status === 'live' ? 'Join Live →' : 'Register →'}
      </button>
    </div>`;
}

window.selectSession = function(sessionId) {
  const session = LIVE_SESSIONS.find(s => s.id === sessionId);
  if (!session) return;

  State.selectedSession = sessionId;

  // Highlight card
  document.querySelectorAll('.session-card').forEach(el => el.classList.remove('selected'));
  const card = document.getElementById(`session-${sessionId}`);
  if (card) card.classList.add('selected');

  renderAISummary(session);
};

window.joinSession = function(sessionId) {
  const session = LIVE_SESSIONS.find(s => s.id === sessionId);
  if (session) {
    if (session.status === 'live') {
      showToast(`🔴 Joining "${session.title.slice(0, 30)}…"`, 'success');
    } else {
      showToast(`✅ Registered for "${session.title.slice(0, 30)}…"`, 'success');
    }
  }
};

function renderAISummary(session) {
  const body = document.getElementById('ai-sidebar-body');
  if (!body) return;

  const joinLabel = session.status === 'live' ? 'Join Live Session →' : 'Register for Session →';

  body.innerHTML = `
    <div class="ai-summary-card">
      <div class="ai-summary-title-row">
        <div class="ai-session-avatar">${session.instructorInitial}</div>
        <div>
          <div class="ai-session-name">${escHtml(session.title)}</div>
          <div class="ai-session-by">by ${escHtml(session.instructor)}</div>
        </div>
      </div>

      <div class="ai-section-label">AI Overview</div>
      <div class="ai-overview-text">${escHtml(session.overview)}</div>

      <div class="ai-section-label">Key Topics Covered</div>
      <div class="ai-topics-list">
        ${session.topics.map(t => `
          <div class="ai-topic-item">
            <div class="ai-topic-dot"></div>
            ${escHtml(t)}
          </div>`).join('')}
      </div>

      <div class="ai-section-label">Instructor Insights</div>
      <div class="ai-insights-list">
        ${session.insights.map((ins, i) => `
          <div class="ai-insight-item">
            <div class="ai-insight-num">${i + 1}</div>
            <span>${escHtml(ins)}</span>
          </div>`).join('')}
      </div>

      <button class="ai-join-btn" onclick="joinSession('${session.id}')">${joinLabel}</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const iconMap = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${iconMap[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('exiting');
    setTimeout(() => toast.remove(), 280);
  }, 3500);
};

// ═══════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════
function starRating(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
