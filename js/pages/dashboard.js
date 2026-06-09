/* ============================================
   HR/HCM System — Dashboard Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.dashboard = function(container) {
    const t = window.App.t.bind(window.App);
    const stats = window.HRData.dashboardStats;
    const roles = window.HRData.roles;
    const currentLang = window.App.currentLang;

    // Render Leave Request Modal HTML
    const renderLeaveModal = () => {
      const types = [
        {id: 'annual', ar: 'إجازة سنوية', en: 'Annual Leave'},
        {id: 'sick', ar: 'إجازة مرضية', en: 'Sick Leave'},
        {id: 'bereavement', ar: 'إجازة وفاة', en: 'Bereavement Leave'},
        {id: 'marriage', ar: 'إجازة زواج', en: 'Marriage Leave'},
        {id: 'maternity', ar: 'إجازة أمومة', en: 'Maternity Leave'},
        {id: 'paternity', ar: 'إجازة أبوة', en: 'Paternity Leave'}
      ];
      
      const employees = window.HRData.employees;
      
      return `
        <div class="form-group">
          <label class="form-label">${t('leaveType')}</label>
          <select class="form-select" id="leave-type">
            ${types.map(type => `<option value="${type.id}">${currentLang === 'ar' ? type.ar : type.en}</option>`).join('')}
          </select>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('startDate')}</label>
            <input type="date" class="form-input" id="leave-start" />
          </div>
          <div class="form-group">
            <label class="form-label">${t('endDate')}</label>
            <input type="date" class="form-input" id="leave-end" />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${t('numberOfDays')}</label>
            <input type="number" class="form-input" id="leave-days" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">${t('substitute')}</label>
            <select class="form-select" id="leave-substitute">
              <option value="">--</option>
              ${employees.map(e => `<option value="${e.id}">${currentLang === 'ar' ? e.nameAr : e.nameEn}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">${t('reason')}</label>
          <textarea class="form-textarea" id="leave-reason" placeholder="..."></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">${t('attachments')}</label>
          <div class="form-file">
            <div class="form-file-icon">📎</div>
            <div class="form-file-text">${t('uploadDocument')}</div>
          </div>
        </div>
      `;
    };

    // Make functions available globally for onclick handlers
    window.DashboardActions = {
      showLeaveModal: () => {
        window.App.showModal(
          t('qaLeaveRequest'), 
          renderLeaveModal(), 
          `<button class="btn btn-ghost" onclick="window.App.closeModal()">${t('cancel')}</button>
           <button class="btn btn-primary" onclick="window.DashboardActions.submitLeave()">${t('submit')}</button>`
        );
        
        // Add minimal date calculation logic
        setTimeout(() => {
          const start = document.getElementById('leave-start');
          const end = document.getElementById('leave-end');
          const days = document.getElementById('leave-days');
          
          const calcDays = () => {
            if(start.value && end.value) {
              const d1 = new Date(start.value);
              const d2 = new Date(end.value);
              const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
              days.value = diff >= 0 ? diff + 1 : 0;
            }
          };
          
          if(start) start.addEventListener('change', calcDays);
          if(end) end.addEventListener('change', calcDays);
        }, 100);
      },
      submitLeave: () => {
        window.App.closeModal();
        window.App.showToast(t('toastRequestSubmitted'), 'success');
      },
      showAddEmployeeModal: () => {
        window.App.showModal(
          t('qaAddEmployee'),
          `<div class="empty-state">
            <div class="empty-state-icon">👥</div>
            <p>${t('moduleEmployeeMgmtDesc')}</p>
           </div>`,
           `<button class="btn btn-ghost" onclick="window.App.closeModal()">${t('cancel')}</button>`
        );
      }
    };

    const recentNotifications = window.HRData.notifications.slice(0, 5);

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('dashTitle')}</h1>
          <p class="page-subtitle">${t('dashSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.navigate('requests')">
            <span>+</span> ${t('qaCreateRequest')}
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-4 gap-4 section">
        <div class="card stat-card stagger-1">
          <div class="stat-card-icon" style="background: var(--info-light); color: var(--info);">👥</div>
          <div>
            <div class="stat-card-value">${stats.totalEmployees}</div>
            <div class="stat-card-label">${t('totalEmployees')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-2">
          <div class="stat-card-icon" style="background: var(--accent-orange-light); color: var(--accent-orange);">🆕</div>
          <div>
            <div class="stat-card-value">${stats.newAwaitingReview}</div>
            <div class="stat-card-label">${t('newAwaitingReview')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-3 card-clickable" onclick="window.App.navigate('approvals')">
          <div class="stat-card-icon" style="background: var(--warning-light); color: #B8860B;">⏳</div>
          <div>
            <div class="stat-card-value">${stats.pendingApprovals}</div>
            <div class="stat-card-label">${t('pendingApprovals')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-4 card-clickable" onclick="window.App.navigate('attendance')">
          <div class="stat-card-icon" style="background: var(--success-light); color: var(--success);">🏖️</div>
          <div>
            <div class="stat-card-value">${stats.onLeave}</div>
            <div class="stat-card-label">${t('onLeave')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-5 card-clickable" onclick="window.App.navigate('documents')">
          <div class="stat-card-icon" style="background: var(--danger-light); color: var(--danger);">📝</div>
          <div>
            <div class="stat-card-value">${stats.expiringContracts}</div>
            <div class="stat-card-label">${t('expiringContracts')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-6 card-clickable" onclick="window.App.navigate('documents')">
          <div class="stat-card-icon" style="background: var(--danger-light); color: var(--danger);">📄</div>
          <div>
            <div class="stat-card-value">${stats.missingDocuments}</div>
            <div class="stat-card-label">${t('missingDocuments')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-7 card-clickable" onclick="window.App.navigate('attendance')">
          <div class="stat-card-icon" style="background: var(--warning-light); color: #B8860B;">🕐</div>
          <div>
            <div class="stat-card-value">${stats.attendanceIssues}</div>
            <div class="stat-card-label">${t('attendanceIssues')}</div>
          </div>
        </div>
        
        <div class="card stat-card stagger-8 card-clickable" onclick="window.App.navigate('approvals')">
          <div class="stat-card-icon" style="background: var(--accent-orange-light); color: var(--accent-orange);">⏰</div>
          <div>
            <div class="stat-card-value">${stats.overtimePending}</div>
            <div class="stat-card-label">${t('overtimePending')}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-2 gap-6 section">
        <!-- Quick Actions -->
        <div>
          <h2 class="section-title mb-4">${t('quickActions')}</h2>
          <div class="quick-actions">
            <div class="quick-action-btn" onclick="window.App.navigate('requests')">
              <span class="qa-icon">📋</span>
              <span class="qa-label">${t('qaCreateRequest')}</span>
            </div>
            <div class="quick-action-btn" onclick="window.DashboardActions.showAddEmployeeModal()">
              <span class="qa-icon">👥</span>
              <span class="qa-label">${t('qaAddEmployee')}</span>
            </div>
            <div class="quick-action-btn" onclick="window.App.navigate('requests:salary-certificate')">
              <span class="qa-icon">📜</span>
              <span class="qa-label">${t('qaSalaryCert')}</span>
            </div>
            <div class="quick-action-btn" onclick="window.DashboardActions.showLeaveModal()">
              <span class="qa-icon">🏖️</span>
              <span class="qa-label">${t('qaLeaveRequest')}</span>
            </div>
            <div class="quick-action-btn" onclick="window.App.navigate('requests:overtime')">
              <span class="qa-icon">⏰</span>
              <span class="qa-label">${t('qaOvertimeRequest')}</span>
            </div>
            <div class="quick-action-btn" onclick="window.App.navigate('offboarding')">
              <span class="qa-icon">📦</span>
              <span class="qa-label">${t('qaStartOffboarding')}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="section-title mb-4">${t('recentActivity')}</h2>
          <div class="card">
            <div class="notif-list">
              ${recentNotifications.map(n => `
                <div class="notif-item" onclick="window.App.toggleNotifPanel()">
                  <div class="notif-icon" style="background:${n.bgColor}">${n.icon}</div>
                  <div class="notif-content">
                    <div class="notif-title">${currentLang === 'ar' ? n.titleAr : n.titleEn}</div>
                    <div class="notif-desc">${currentLang === 'ar' ? n.descAr : n.descEn}</div>
                    <div class="notif-time">${window.Utils.timeAgo(n.time)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="card-footer" style="padding-top: var(--space-2); margin-top: 0; justify-content: center; cursor: pointer" onclick="window.App.navigate('notifications')">
              <span class="text-orange font-medium">${t('viewAll')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Roles Section -->
      <div class="section">
        <h2 class="section-title mb-4">${t('roleDashboards')}</h2>
        <div class="role-cards">
          ${roles.map(r => `
            <div class="card role-card ${r.id === window.App.currentRole ? 'active' : ''}" onclick="window.App.setRole('${r.id}')">
              <div class="role-icon" style="background: ${r.bgColor}; color: ${r.color};">${r.icon}</div>
              <div class="role-name">${currentLang === 'ar' ? r.nameAr : r.nameEn}</div>
              <div class="role-desc">${currentLang === 'ar' ? r.descAr : r.descEn}</div>
              ${r.id === window.App.currentRole ? `
                <div class="badge badge-orange mt-2" style="margin-top: 8px;">${t('current')}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };
})();
