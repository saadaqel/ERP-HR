/* ============================================
   HR/HCM System — Documents & Expiry Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.documents = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const employees = window.HRData.employees;
    
    // Extract all documents from all employees
    let allDocs = [];
    employees.forEach(emp => {
      emp.documents.forEach(doc => {
        allDocs.push({
          ...doc,
          empId: emp.id,
          empName: lang === 'ar' ? emp.nameAr : emp.nameEn,
          empAvatar: emp.avatar
        });
      });
    });
    
    // Calculate stats
    const stats = {
      total: allDocs.length,
      valid: allDocs.filter(d => d.status === 'valid').length,
      expiring: allDocs.filter(d => d.status === 'expiring').length,
      expired: allDocs.filter(d => d.status === 'expired').length,
      missing: allDocs.filter(d => d.status === 'missing').length
    };
    
    // Sort logic (missing & expired first, then expiring, then valid)
    const statusWeight = { missing: 0, expired: 1, expiring: 2, valid: 3 };
    allDocs.sort((a, b) => statusWeight[a.status] - statusWeight[b.status]);
    
    // Find expiring contracts
    const expiringContracts = employees.filter(e => {
      const days = window.Utils.daysUntil(e.contractEnd);
      return days >= 0 && days <= 30;
    });

    window.DocumentActions = {
      filterDocs: () => {
        const search = document.getElementById('doc-search').value.toLowerCase();
        const status = document.getElementById('doc-status').value;
        const cards = document.querySelectorAll('.doc-card-wrapper');
        
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          const dStatus = card.getAttribute('data-status');
          
          const matchSearch = text.includes(search);
          const matchStatus = !status || dStatus === status;
          
          card.style.display = (matchSearch && matchStatus) ? '' : 'none';
        });
      },
      showRequestModal: (empId, docName) => {
        const emp = window.Utils.getEmployee(empId);
        window.App.showModal(
          t('requestMissing'),
          `<div class="form-group">
            <p class="mb-4">إرسال طلب استكمال مستند إلى الموظف <strong>${lang === 'ar' ? emp.nameAr : emp.nameEn}</strong></p>
            <label class="form-label">المستند المطلوب</label>
            <input type="text" class="form-input" value="${window.Utils.getLocal(docName)}" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">رسالة للموظف (اختياري)</label>
            <textarea class="form-textarea">يرجى رفع المستند المطلوب في أقرب وقت لتحديث ملفكم الوظيفي.</textarea>
          </div>`,
          `<button class="btn btn-ghost" onclick="window.App.closeModal()">${t('cancel')}</button>
           <button class="btn btn-primary" onclick="window.App.closeModal(); window.App.showToast('تم إرسال الطلب للموظف', 'success')">إرسال الطلب</button>`
        );
      }
    };

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('navDocuments')}</h1>
          <p class="page-subtitle">${t('docSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.showToast('Upload modal opened', 'info')">
            <span>↑</span> ${t('uploadDocument')}
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-5 gap-4 mb-6 animate-fadeInUp stagger-1">
        <div class="card stat-card">
          <div><div class="stat-card-value">${stats.total}</div><div class="stat-card-label">إجمالي المستندات</div></div>
        </div>
        <div class="card stat-card">
          <div><div class="stat-card-value text-success">${stats.valid}</div><div class="stat-card-label">${t('valid')}</div></div>
        </div>
        <div class="card stat-card">
          <div><div class="stat-card-value text-warning">${stats.expiring}</div><div class="stat-card-label">${t('expiring')}</div></div>
        </div>
        <div class="card stat-card">
          <div><div class="stat-card-value text-danger">${stats.expired}</div><div class="stat-card-label">${t('expired')}</div></div>
        </div>
        <div class="card stat-card">
          <div><div class="stat-card-value text-danger">${stats.missing}</div><div class="stat-card-label">${t('missing')}</div></div>
        </div>
      </div>

      ${expiringContracts.length > 0 ? `
        <div class="card mb-6 border-danger animate-fadeInUp stagger-2" style="border-inline-start: 4px solid var(--danger);">
          <div class="card-header border-0 mb-0 pb-0">
            <h3 class="card-title text-danger flex items-center gap-2"><span>⚠️</span> ${t('expiringContracts')}</h3>
          </div>
          <div class="card-body">
            <div class="table-container border-0 mt-4">
              <table class="data-table">
                <thead><tr><th>الموظف</th><th>تاريخ انتهاء العقد</th><th>الأيام المتبقية</th><th>إجراء</th></tr></thead>
                <tbody>
                  ${expiringContracts.map(e => {
                    const days = window.Utils.daysUntil(e.contractEnd);
                    return `
                    <tr>
                      <td>${lang === 'ar' ? e.nameAr : e.nameEn} (${e.id})</td>
                      <td>${window.Utils.formatDate(e.contractEnd)}</td>
                      <td class="font-bold text-danger">${days} ${t('days')}</td>
                      <td><button class="btn btn-secondary btn-sm" onclick="window.App.navigate('employee:${e.id}')">تجديد العقد</button></td>
                    </tr>
                  `}).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="filter-bar animate-fadeInUp stagger-3">
        <div class="search-box" style="flex: 1;">
          <span class="search-icon">🔍</span>
          <input type="text" id="doc-search" class="form-input search-input" placeholder="${t('search')}..." onkeyup="window.DocumentActions.filterDocs()" />
        </div>
        <select class="form-select" id="doc-status" onchange="window.DocumentActions.filterDocs()">
          <option value="">${t('allStatuses')}</option>
          <option value="valid">${t('valid')}</option>
          <option value="expiring">${t('expiring')}</option>
          <option value="expired">${t('expired')}</option>
          <option value="missing">${t('missing')}</option>
        </select>
      </div>

      <div class="docs-grid animate-fadeInUp stagger-4">
        ${allDocs.map(doc => `
          <div class="doc-card-wrapper" data-status="${doc.status}">
            <div class="card doc-card" style="height:100%; display:flex; flex-direction:column;">
              <div style="display:flex; gap:var(--space-3); width:100%;">
                <div class="doc-icon" style="background: ${doc.status === 'missing' ? 'var(--danger-light)' : 'var(--bg-tertiary)'}; color: ${doc.status === 'missing' ? 'var(--danger)' : 'var(--text-secondary)'};">
                  ${doc.type === 'id' ? '🪪' : doc.type === 'contract' ? '📝' : doc.type === 'insurance' ? '🏥' : doc.type === 'iqama' ? '💳' : '📄'}
                </div>
                <div style="flex:1;">
                  <div class="doc-name truncate" title="${window.Utils.getLocal(doc.name)}">${window.Utils.getLocal(doc.name)}</div>
                  <div class="badge ${window.Utils.getStatusBadge(doc.status)} mb-1">${window.Utils.getStatusLabel(doc.status)}</div>
                  ${doc.expiry ? `<div class="doc-expiry">${t('expiryDate')}: <span class="${doc.status === 'expiring' ? 'text-warning font-bold' : ''}">${window.Utils.formatDate(doc.expiry)}</span></div>` : ''}
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto;">
                <div style="display:flex; align-items:center; gap:var(--space-2); font-size:var(--fs-xs);">
                  <div class="avatar" style="width:24px; height:24px; font-size:10px; background:${doc.empAvatar}">${window.Utils.getInitials(doc.empName)}</div>
                  <span class="truncate" style="max-width:100px;" title="${doc.empName}">${doc.empName}</span>
                </div>
                
                ${doc.status === 'missing' ? `
                  <button class="btn btn-secondary btn-sm" onclick="window.DocumentActions.showRequestModal('${doc.empId}', '${doc.name.ar}')">طلب</button>
                ` : `
                  <button class="btn btn-ghost btn-sm" onclick="window.App.showToast('Viewing document...', 'info')">عرض</button>
                `}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };
})();
