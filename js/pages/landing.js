/* ============================================
   HR/HCM System — Landing Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.landing = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    
    container.innerHTML = `
      <div class="landing-page">
        <!-- Header -->
        <header class="landing-header">
          ${lang === 'ar' ? `
            <div class="header-logo pointer" onclick="window.App.navigate('landing')">
              <div class="header-logo-icon">⚡</div>
              <span>${t('appNameShort')}</span>
            </div>
          ` : ''}
          
          <nav class="landing-nav hide-mobile">
            <a href="#dashboard">${t('navDashboard')}</a>
            <a href="#employee">${t('navEmployeeFile')}</a>
            <a href="#requests">${t('navRequests')}</a>
            <a href="#reports">${t('navReports')}</a>
          </nav>
          
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <div class="lang-toggle">
              <button class="lang-btn ${lang === 'ar' ? 'active' : ''}" onclick="window.App.setLang('ar')">عربي</button>
              <button class="lang-btn ${lang === 'en' ? 'active' : ''}" onclick="window.App.setLang('en')">EN</button>
            </div>
            <button class="btn btn-primary" onclick="window.App.navigate('dashboard')">${t('enterSystem')}</button>
          </div>
          
          ${lang === 'en' ? `
            <div class="header-logo pointer" onclick="window.App.navigate('landing')">
              <div class="header-logo-icon">⚡</div>
              <span>${t('appNameShort')}</span>
            </div>
          ` : ''}
        </header>

        <!-- Hero Section -->
        <section class="hero-section">
          <!-- Geometric Accents -->
          <div class="geo-accent geo-1"></div>
          <div class="geo-accent geo-2"></div>
          <div class="geo-accent geo-3"></div>
          <div class="geo-accent geo-4"></div>
          <div class="geo-accent geo-5"></div>
          
          <h1 class="hero-title animate-fadeInUp">${t('heroTitle')}</h1>
          <p class="hero-subtitle animate-fadeInUp" style="animation-delay: 100ms;">${t('heroSubtitle')}</p>
          
          <div class="hero-actions animate-fadeInUp" style="animation-delay: 200ms;">
            <button class="btn btn-primary btn-lg" onclick="window.App.navigate('dashboard')">
              ${t('heroCTA')}
            </button>
            <button class="btn btn-secondary btn-lg" onclick="document.getElementById('modules').scrollIntoView({behavior: 'smooth'})">
              ${t('heroSecondary')}
            </button>
          </div>
        </section>

        <!-- Modules Section -->
        <section id="modules" class="modules-section">
          <div class="modules-grid">
            <div class="card module-card card-clickable stagger-1 animate-fadeInUp" onclick="window.App.navigate('employee')">
              <div class="module-card-icon" style="background: var(--success-light); color: var(--success);">👥</div>
              <h3 class="module-card-title">${t('moduleEmployeeMgmt')}</h3>
              <p class="module-card-desc">${t('moduleEmployeeMgmtDesc')}</p>
            </div>
            
            <div class="card module-card card-clickable stagger-2 animate-fadeInUp" onclick="window.App.navigate('attendance')">
              <div class="module-card-icon" style="background: var(--info-light); color: var(--info);">🕐</div>
              <h3 class="module-card-title">${t('moduleAttendance')}</h3>
              <p class="module-card-desc">${t('moduleAttendanceDesc')}</p>
            </div>
            
            <div class="card module-card card-clickable stagger-3 animate-fadeInUp" onclick="window.App.navigate('payroll')">
              <div class="module-card-icon" style="background: var(--accent-orange-light); color: var(--accent-orange);">💰</div>
              <h3 class="module-card-title">${t('modulePayroll')}</h3>
              <p class="module-card-desc">${t('modulePayrollDesc')}</p>
            </div>
            
            <div class="card module-card card-clickable stagger-4 animate-fadeInUp" onclick="window.App.navigate('reports')">
              <div class="module-card-icon" style="background: var(--purple-light); color: var(--purple);">📈</div>
              <h3 class="module-card-title">${t('modulePerformance')}</h3>
              <p class="module-card-desc">${t('modulePerformanceDesc')}</p>
            </div>
          </div>
        </section>
      </div>
    `;
  };
})();
