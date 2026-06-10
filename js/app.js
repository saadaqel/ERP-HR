/* ============================================
   HR/HCM System — Main App (Router & Shell)
   ============================================ */
(function() {

const App = {
  currentLang: 'ar',
  currentRole: 'hr-manager',
  currentPage: 'landing',
  toastTimeout: null,

  init() {
    this.currentLang = localStorage.getItem('hr-lang') || 'ar';
    this.currentRole = localStorage.getItem('hr-role') || 'hr-manager';
    document.documentElement.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.currentLang);
    this.renderShell();
    // Check URL hash for initial page
    const hash = window.location.hash.replace('#', '') || 'landing';
    this.navigate(hash);
    window.addEventListener('hashchange', () => {
      const pg = window.location.hash.replace('#', '') || 'landing';
      this.navigate(pg, true);
    });
  },

  t(key) {
    return window.i18n[this.currentLang][key] || key;
  },

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('hr-lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    // Re-render
    this.renderShell();
    this.navigate(this.currentPage, true);
  },

  setRole(role) {
    this.currentRole = role;
    localStorage.setItem('hr-role', role);
    // Update role display
    this.updateRoleDisplay();
    // Notify current page
    this.navigate(this.currentPage, true);
    this.closeDropdowns();
  },

  navigate(page, skipHash) {
    // Handle sub-pages with params (e.g., 'employee:1001')
    const parts = page.split(':');
    this.currentPage = parts[0];
    const param = parts[1] || null;
    
    if (!skipHash) {
      window.location.hash = page;
    }

    // Show/hide shell based on page
    const shell = document.getElementById('app-shell');
    const landing = document.getElementById('landing-page');
    
    if (this.currentPage === 'landing') {
      if (shell) shell.style.display = 'none';
      if (landing) landing.style.display = 'block';
      if (window.Pages && window.Pages.landing) {
        window.Pages.landing(landing);
      }
    } else {
      if (shell) shell.style.display = 'flex';
      if (landing) landing.style.display = 'none';
      
      // Update active nav
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === this.currentPage);
      });
      
      // Render page content
      const container = document.getElementById('page-content');
      if (container && window.Pages && window.Pages[this.currentPage]) {
        window.Pages[this.currentPage](container, param);
      } else if (container) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚧</div><div class="empty-state-title">${this.currentPage}</div><div class="empty-state-desc">Coming soon</div></div>`;
      }
    }

    // Close mobile sidebar
    this.closeSidebar();
  },

  renderShell() {
    const appDiv = document.getElementById('app');
    const t = this.t.bind(this);
    const lang = this.currentLang;
    
    const currentRoleObj = window.HRData.roles.find(r => r.id === this.currentRole) || window.HRData.roles[0];
    const roleName = lang === 'ar' ? currentRoleObj.nameAr : currentRoleObj.nameEn;
    
    const navItems = [
      { page: 'dashboard', icon: '📊', label: t('navDashboard') },
      { page: 'employee', icon: '👤', label: t('navEmployeeFile') },
      { page: 'structure', icon: '🌳', label: t('navStructure') },
      { page: 'requests', icon: '📋', label: t('navRequests') },
      { page: 'approvals', icon: '✅', label: t('navApprovals'), badge: window.HRData.dashboardStats.pendingApprovals },
      { page: 'attendance', icon: '🕐', label: t('navAttendance') },
      { page: 'payroll', icon: '💰', label: t('navPayroll') },
      { page: 'performance', icon: '📈', label: t('navPerformance') },
      { page: 'documents', icon: '📄', label: t('navDocuments') },
      { page: 'reports', icon: '📑', label: t('navReports') },
      { page: 'notifications', icon: '🔔', label: t('navNotifications'), badge: window.HRData.notifications.filter(n => !n.read).length },
      { page: 'offboarding', icon: '📦', label: t('navOffboarding') },
    ];

    const unreadCount = window.HRData.notifications.filter(n => !n.read).length;

    appDiv.innerHTML = `
      <!-- Landing Page Container -->
      <div id="landing-page" style="display:none;"></div>

      <!-- App Shell -->
      <div id="app-shell" class="app-shell" style="display:none;">
        <!-- Header -->
        <header class="header">
          <div class="header-start">
            <button class="sidebar-toggle" onclick="App.toggleSidebar()" aria-label="Toggle Menu">☰</button>
            <div class="header-logo pointer" onclick="App.navigate('landing')">
              <div class="header-logo-icon"><img src="images/logo.png" alt="Logo"></div>
              <span class="hide-mobile">${t('appNameShort')}</span>
            </div>
          </div>
          
          <div class="header-center hide-mobile">
            <div class="header-search">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="${t('search')}" class="form-input" />
            </div>
          </div>
          
          <div class="header-end">
            <!-- Language Toggle -->
            <div class="lang-toggle">
              <button class="lang-btn ${lang === 'ar' ? 'active' : ''}" onclick="App.setLang('ar')">عربي</button>
              <button class="lang-btn ${lang === 'en' ? 'active' : ''}" onclick="App.setLang('en')">EN</button>
            </div>

            <!-- Notifications -->
            <div class="notif-bell" onclick="App.toggleNotifPanel()">
              🔔
              ${unreadCount > 0 ? `<span class="notif-bell-count">${unreadCount}</span>` : ''}
            </div>

            <!-- Role Switcher -->
            <div class="dropdown" id="role-dropdown">
              <div class="role-switcher" onclick="App.toggleDropdown('role-dropdown')">
                <div class="role-switcher-avatar">${currentRoleObj.icon}</div>
                <span class="hide-mobile" id="role-display">${roleName}</span>
                <span style="font-size:10px;color:var(--text-tertiary)">▼</span>
              </div>
              <div class="dropdown-menu" style="min-width:240px;">
                ${window.HRData.roles.map(r => `
                  <div class="dropdown-item ${r.id === this.currentRole ? 'active' : ''}" onclick="App.setRole('${r.id}')">
                    <span>${r.icon}</span>
                    <span>${lang === 'ar' ? r.nameAr : r.nameEn}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </header>

        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebar-overlay" onclick="App.closeSidebar()"></div>
        
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <nav>
            <div class="nav-section">
              <div class="nav-section-title">${lang === 'ar' ? 'القائمة الرئيسية' : 'MAIN MENU'}</div>
              ${navItems.map(item => `
                <div class="nav-item ${this.currentPage === item.page ? 'active' : ''}" data-page="${item.page}" onclick="App.navigate('${item.page}')">
                  <span class="nav-icon">${item.icon}</span>
                  <span>${item.label}</span>
                  ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content" id="page-content">
        </main>
      </div>

      <!-- Notification Panel -->
      <div class="notif-panel" id="notif-panel">
        <div class="notif-panel-header">
          <h3>${t('notifTitle')}</h3>
          <div style="display:flex;gap:var(--space-2);">
            <button class="btn btn-ghost btn-sm" onclick="App.markAllRead()">${t('markAllRead')}</button>
            <button class="modal-close" onclick="App.closeNotifPanel()">✕</button>
          </div>
        </div>
        <div class="notif-panel-body" id="notif-panel-body">
          ${window.HRData.notifications.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}">
              <div class="notif-icon" style="background:${n.bgColor}">${n.icon}</div>
              <div class="notif-content">
                <div class="notif-title">${lang === 'ar' ? n.titleAr : n.titleEn}</div>
                <div class="notif-desc">${lang === 'ar' ? n.descAr : n.descEn}</div>
                <div class="notif-time">${window.Utils.timeAgo(n.time)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop" id="modal-backdrop" onclick="App.closeModal()"></div>
      
      <!-- Modal -->
      <div class="modal" id="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title"></h3>
          <button class="modal-close" onclick="App.closeModal()">✕</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>

      <!-- Toast Container -->
      <div class="toast-container" id="toast-container"></div>
    `;
  },

  updateRoleDisplay() {
    const roleDisplay = document.getElementById('role-display');
    const currentRoleObj = window.HRData.roles.find(r => r.id === this.currentRole);
    if (roleDisplay && currentRoleObj) {
      roleDisplay.textContent = this.currentLang === 'ar' ? currentRoleObj.nameAr : currentRoleObj.nameEn;
    }
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  },

  toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      // Close other dropdowns first
      document.querySelectorAll('.dropdown.open').forEach(d => {
        if (d.id !== id) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    }
  },

  closeDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  },

  toggleNotifPanel() {
    const panel = document.getElementById('notif-panel');
    if (panel) panel.classList.toggle('open');
  },

  closeNotifPanel() {
    const panel = document.getElementById('notif-panel');
    if (panel) panel.classList.remove('open');
  },

  markAllRead() {
    window.HRData.notifications.forEach(n => n.read = true);
    // Update bell
    const bell = document.querySelector('.notif-bell-count');
    if (bell) bell.remove();
    // Update panel items
    document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
    // Update nav badge
    const navBadge = document.querySelector('.nav-item[data-page="notifications"] .nav-badge');
    if (navBadge) navBadge.remove();
  },

  showModal(title, bodyHtml, footerHtml) {
    const backdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = footerHtml || '';
    modalFooter.style.display = footerHtml ? 'flex' : 'none';
    
    backdrop.classList.add('active');
    modal.classList.add('active');
  },

  closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('modal');
    backdrop.classList.remove('active');
    modal.classList.remove('active');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 5000);
  }
};

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    App.closeDropdowns();
  }
  if (!e.target.closest('.notif-panel') && !e.target.closest('.notif-bell')) {
    App.closeNotifPanel();
  }
});

window.App = App;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

})();
