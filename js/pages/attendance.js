/* ============================================
   HR/HCM System — Attendance & Shifts Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.attendance = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const atts = window.HRData.attendance;
    
    // Stats for "Today" (assuming last date in dummy data is today)
    const stats = {
      present: atts.filter(a => a.status === 'present').length,
      late: atts.filter(a => a.status === 'late').length,
      earlyDept: atts.filter(a => a.status === 'early-departure').length,
      absent: atts.filter(a => a.status === 'absent').length,
      remote: atts.filter(a => a.status === 'remote-work').length,
      missingCheckout: atts.filter(a => a.status === 'missing-checkout').length
    };

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('attTitle')}</h1>
          <p class="page-subtitle">${t('attSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.showToast('Punch in registered', 'success')">
            <span>🕐</span> ${t('checkIn')} (Web)
          </button>
        </div>
      </div>

      <div class="filter-bar animate-fadeInUp stagger-1">
        <input type="date" class="form-input" value="2024-05-15" />
        <select class="form-select">
          <option value="">${t('allDepartments')}</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="form-input search-input" placeholder="${t('search')}..." />
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-6 gap-4 mb-6 animate-fadeInUp stagger-2">
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-success">${stats.present}</div><div class="stat-card-label">${t('present')}</div></div></div>
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-warning">${stats.late}</div><div class="stat-card-label">${t('lateArrival')}</div></div></div>
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-warning">${stats.earlyDept}</div><div class="stat-card-label">${t('earlyDeparture')}</div></div></div>
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-danger">${stats.absent}</div><div class="stat-card-label">${t('absent')}</div></div></div>
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-info">${stats.remote}</div><div class="stat-card-label">${t('remoteWork')}</div></div></div>
        <div class="card stat-card"><div class="text-center w-full"><div class="stat-card-value text-orange">${stats.missingCheckout}</div><div class="stat-card-label">خروج مفقود</div></div></div>
      </div>

      <div class="grid grid-2 gap-6 animate-fadeInUp stagger-3">
        <!-- Daily Records Table -->
        <div class="card" style="grid-column: span 2;">
          <div class="card-header"><h3 class="card-title">سجل اليوم (15 مايو 2024)</h3></div>
          <div class="table-container border-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>${t('checkIn')}</th>
                  <th>${t('checkOut')}</th>
                  <th>${t('hours')}</th>
                  <th>${t('status')}</th>
                  <th>${t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${atts.map(a => {
                  const emp = window.Utils.getEmployee(a.empId);
                  return `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:var(--space-2);">
                        <div class="avatar avatar-sm" style="background:${emp.avatar}">${window.Utils.getInitials(lang === 'ar' ? emp.nameAr : emp.nameEn)}</div>
                        <span>${lang === 'ar' ? emp.nameAr : emp.nameEn}</span>
                      </div>
                    </td>
                    <td>${a.checkIn || '—'}</td>
                    <td>${a.checkOut || '—'}</td>
                    <td>${a.hours !== null ? a.hours.toFixed(2) : '—'}</td>
                    <td><span class="badge ${window.Utils.getStatusBadge(a.status)}">${window.Utils.getStatusLabel(a.status)}</span></td>
                    <td><button class="btn btn-ghost btn-sm" onclick="window.App.showToast('Edit feature', 'info')">تعديل</button></td>
                  </tr>
                `}).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Shift Schedule -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">${t('shiftSchedule')}</h3></div>
          <div class="card-body">
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <div class="badge badge-success">08:00 - 16:00 (صباحي)</div>
              <div class="badge badge-info">16:00 - 00:00 (مسائي)</div>
              <div class="badge badge-warning">00:00 - 08:00 (ليلي)</div>
            </div>
            <div class="mt-4 p-4 text-center text-tertiary" style="border:1px dashed var(--border-color); border-radius:var(--radius-md);">
              تقويم الورديات (Interactive Calendar View)
            </div>
          </div>
        </div>

        <!-- Excel Import -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">${t('importExcel')}</h3></div>
          <div class="card-body">
            <div class="excel-import-area" style="border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: var(--space-8); text-align: center; cursor: pointer; background: var(--bg-secondary); transition: var(--transition-fast);" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border-color)'" onclick="window.App.showToast('Uploading file...', 'info')">
              <div style="font-size: 32px; margin-bottom: var(--space-2);">📊</div>
              <div class="font-bold mb-1">اسحب ملف Excel هنا أو انقر للاستعراض</div>
              <div class="text-sm text-tertiary">صيغ مدعومة: .xlsx, .csv (من أجهزة البصمة)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
})();
