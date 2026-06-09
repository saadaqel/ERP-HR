/* ============================================
   HR/HCM System — Approvals Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.approvals = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const reqs = window.HRData.requests;
    
    // Group requests by status
    const pending = reqs.filter(r => r.status === 'pending');
    const inProgress = reqs.filter(r => r.status === 'in-progress');
    const approved = reqs.filter(r => r.status === 'approved');
    const rejected = reqs.filter(r => r.status === 'rejected' || r.status === 'returned');
    
    window.ApprovalActions = {
      toggleView: (view) => {
        document.getElementById('kanban-view').style.display = view === 'kanban' ? 'flex' : 'none';
        document.getElementById('table-view').style.display = view === 'table' ? 'block' : 'none';
        document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${view}`).classList.add('active');
      },
      
      showActionModal: (reqId) => {
        const req = reqs.find(r => r.id === reqId);
        const emp = window.Utils.getEmployee(req.employeeId);
        
        window.App.showModal(
          `إجراء على الطلب ${reqId}`,
          `
          <div style="background:var(--bg-secondary); padding:var(--space-4); border-radius:var(--radius-md); margin-bottom:var(--space-4);">
            <div style="display:flex; justify-content:space-between; margin-bottom:var(--space-2);">
              <span class="font-bold">${window.Utils.getLocal(req.typeLabel)}</span>
              <span class="badge ${window.Utils.getStatusBadge(req.status)}">${window.Utils.getLocal(req.statusLabel)}</span>
            </div>
            <div class="text-sm">الموظف: <strong>${lang === 'ar' ? emp.nameAr : emp.nameEn}</strong> (${window.Utils.getLocal(emp.department)})</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">${t('comments')} (اختياري، إلزامي في حال الرفض)</label>
            <textarea class="form-textarea" id="approval-comment" placeholder="أضف ملاحظاتك هنا..."></textarea>
          </div>
          
          <div style="display:flex; gap:var(--space-2); margin-top:var(--space-4);">
            <button class="btn btn-ghost btn-sm" onclick="window.App.navigate('employee:${req.employeeId}'); window.App.closeModal()">
              👤 ${t('viewEmployeeFile')}
            </button>
            <button class="btn btn-ghost btn-sm" onclick="window.App.showToast('Workload view coming soon', 'info')">
              📊 ${t('viewWorkload')}
            </button>
          </div>
          `,
          `
          <div style="display:flex; justify-content:space-between; width:100%;">
            <div>
              <button class="btn btn-ghost text-orange" onclick="window.ApprovalActions.takeAction('returned')">${t('returnForCorrection')}</button>
            </div>
            <div style="display:flex; gap:var(--space-2);">
              <button class="btn btn-secondary text-danger border-danger" onclick="window.ApprovalActions.takeAction('rejected')">${t('reject')}</button>
              <button class="btn btn-primary bg-success border-success" onclick="window.ApprovalActions.takeAction('approved')">${t('approve')}</button>
            </div>
          </div>
          `
        );
      },
      
      takeAction: (action) => {
        const msgs = {
          'approved': t('toastRequestApproved'),
          'rejected': t('toastRequestRejected'),
          'returned': t('toastRequestReturned')
        };
        const types = {
          'approved': 'success',
          'rejected': 'error',
          'returned': 'warning'
        };
        window.App.closeModal();
        window.App.showToast(msgs[action], types[action]);
      }
    };
    
    const renderCard = (req) => {
      const emp = window.Utils.getEmployee(req.employeeId);
      return `
        <div class="card kanban-card card-clickable" onclick="window.ApprovalActions.showActionModal('${req.id}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-2);">
            <span class="font-semibold text-sm">${req.id}</span>
            <span class="badge ${window.Utils.getStatusBadge(req.status)}" style="font-size:10px;">${req.sla} ${t('days')}</span>
          </div>
          <div class="font-bold mb-1">${window.Utils.getLocal(req.typeLabel)}</div>
          <div class="text-sm text-secondary mb-2">${lang === 'ar' ? emp.nameAr : emp.nameEn}</div>
          <div class="text-xs text-tertiary border-t border-color mt-2 pt-2">${window.Utils.getLocal(emp.department)}</div>
        </div>
      `;
    };

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('appTitle')}</h1>
          <p class="page-subtitle">${t('appSubtitle')}</p>
        </div>
        <div class="page-actions">
          <div class="view-toggle" style="display:flex; background:var(--bg-secondary); padding:4px; border-radius:var(--radius-md);">
            <button id="btn-kanban" class="btn btn-ghost btn-sm active" onclick="window.ApprovalActions.toggleView('kanban')">Kanban</button>
            <button id="btn-table" class="btn btn-ghost btn-sm" onclick="window.ApprovalActions.toggleView('table')">Table</button>
          </div>
        </div>
      </div>

      <div class="filter-bar animate-fadeInUp stagger-1">
        <select class="form-select" style="min-width: 150px;">
          <option value="">${t('reqType')}</option>
        </select>
        <select class="form-select" style="min-width: 150px;">
          <option value="">${t('department')}</option>
        </select>
        <div style="display:flex; align-items:center; gap:var(--space-2); margin-inline-start:auto;">
          <span class="text-sm text-secondary">تفويض الصلاحيات:</span>
          <label class="toggle-switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- KANBAN VIEW -->
      <div id="kanban-view" class="kanban-board animate-fadeInUp stagger-2" style="display:flex; gap:var(--space-4); overflow-x:auto; padding-bottom:var(--space-4);">
        <!-- Column 1: Pending -->
        <div class="kanban-column" style="flex:1; min-width:300px; background:var(--bg-secondary); border-radius:var(--radius-lg); padding:var(--space-3);">
          <div class="kanban-column-header" style="display:flex; justify-content:space-between; margin-bottom:var(--space-3); font-weight:bold;">
            <span>${window.Utils.getStatusLabel('pending')}</span>
            <span class="badge badge-warning">${pending.length}</span>
          </div>
          <div class="kanban-cards" style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${pending.map(renderCard).join('')}
          </div>
        </div>

        <!-- Column 2: In Progress -->
        <div class="kanban-column" style="flex:1; min-width:300px; background:var(--bg-secondary); border-radius:var(--radius-lg); padding:var(--space-3);">
          <div class="kanban-column-header" style="display:flex; justify-content:space-between; margin-bottom:var(--space-3); font-weight:bold;">
            <span>${window.Utils.getStatusLabel('in-progress')}</span>
            <span class="badge badge-info">${inProgress.length}</span>
          </div>
          <div class="kanban-cards" style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${inProgress.map(renderCard).join('')}
          </div>
        </div>

        <!-- Column 3: Approved -->
        <div class="kanban-column" style="flex:1; min-width:300px; background:var(--bg-secondary); border-radius:var(--radius-lg); padding:var(--space-3);">
          <div class="kanban-column-header" style="display:flex; justify-content:space-between; margin-bottom:var(--space-3); font-weight:bold;">
            <span>${window.Utils.getStatusLabel('approved')}</span>
            <span class="badge badge-success">${approved.length}</span>
          </div>
          <div class="kanban-cards" style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${approved.map(renderCard).join('')}
          </div>
        </div>

        <!-- Column 4: Rejected / Returned -->
        <div class="kanban-column" style="flex:1; min-width:300px; background:var(--bg-secondary); border-radius:var(--radius-lg); padding:var(--space-3);">
          <div class="kanban-column-header" style="display:flex; justify-content:space-between; margin-bottom:var(--space-3); font-weight:bold;">
            <span>مرفوض / معاد</span>
            <span class="badge badge-danger">${rejected.length}</span>
          </div>
          <div class="kanban-cards" style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${rejected.map(renderCard).join('')}
          </div>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div id="table-view" class="card" style="display:none;">
        <div class="table-container border-0">
          <table class="data-table">
            <thead>
              <tr>
                <th>${t('reqNumber')}</th>
                <th>${t('reqType')}</th>
                <th>${t('initiator')}</th>
                <th>${t('slaWaiting')}</th>
                <th>${t('status')}</th>
                <th>${t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${reqs.map(r => {
                const emp = window.Utils.getEmployee(r.employeeId);
                return `
                <tr>
                  <td class="font-semibold">${r.id}</td>
                  <td>${window.Utils.getLocal(r.typeLabel)}</td>
                  <td>${lang === 'ar' ? emp.nameAr : emp.nameEn}</td>
                  <td>${r.sla} ${t('days')}</td>
                  <td><span class="badge ${window.Utils.getStatusBadge(r.status)}">${window.Utils.getLocal(r.statusLabel)}</span></td>
                  <td>
                    ${r.status === 'pending' ? `
                      <div style="display:flex; gap:var(--space-1);">
                        <button class="btn btn-sm btn-success text-white px-2 py-1" onclick="window.ApprovalActions.takeAction('approved')" title="${t('approve')}">✓</button>
                        <button class="btn btn-sm btn-danger text-white px-2 py-1" onclick="window.ApprovalActions.takeAction('rejected')" title="${t('reject')}">✕</button>
                        <button class="btn btn-sm btn-secondary px-2 py-1" onclick="window.ApprovalActions.showActionModal('${r.id}')">...</button>
                      </div>
                    ` : `
                      <button class="btn btn-sm btn-secondary" onclick="window.App.navigate('requests:view-${r.id}')">${t('viewDetails')}</button>
                    `}
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };
})();
