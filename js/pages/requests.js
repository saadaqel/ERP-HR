/* ============================================
   HR/HCM System — Requests Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.requests = function(container, reqParam) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const reqTypes = window.HRData.requestTypes;
    
    // VIEW 1: Request Catalog
    if (!reqParam) {
      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div>
            <h1 class="page-title">${t('reqTitle')}</h1>
            <p class="page-subtitle">${t('reqSubtitle')}</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="window.App.navigate('requests:all')">
              <span>📋</span> عرض طلباتي
            </button>
          </div>
        </div>

        <div class="request-catalog animate-fadeInUp stagger-1">
          ${reqTypes.map(rt => `
            <div class="card card-clickable request-type-card" onclick="window.App.navigate('requests:${rt.id}')">
              <div class="request-type-icon" style="background: ${rt.bgColor}; color: ${rt.color};">${rt.icon}</div>
              <h3 class="request-type-title">${window.Utils.getLocal(rt.name)}</h3>
              <p class="request-type-desc">${window.Utils.getLocal(rt.desc)}</p>
              
              <div class="mt-4" style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
                <span class="badge badge-neutral" style="font-size: 10px;">${t('initiator')}: ${window.Utils.getLocal(rt.initiator)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      return;
    }
    
    // VIEW 2: My Requests (if param is 'all')
    if (reqParam === 'all') {
      const myReqs = window.HRData.requests.filter(r => r.employeeId === '1001'); // Mocking current user as 1001
      
      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div style="display:flex; align-items:center; gap:var(--space-4);">
            <button class="btn btn-ghost" onclick="window.App.navigate('requests')">← ${t('back')}</button>
            <div>
              <h1 class="page-title">طلباتي</h1>
              <p class="page-subtitle">سجل جميع الطلبات التي قمت بتقديمها</p>
            </div>
          </div>
        </div>
        
        <div class="card animate-fadeInUp stagger-1">
          <div class="table-container border-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t('reqNumber')}</th>
                  <th>${t('reqType')}</th>
                  <th>${t('date')}</th>
                  <th>${t('currentApprover')}</th>
                  <th>${t('status')}</th>
                  <th>${t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${myReqs.map(r => `
                  <tr>
                    <td class="font-semibold">${r.id}</td>
                    <td>${window.Utils.getLocal(r.typeLabel)}</td>
                    <td>${window.Utils.formatDate(r.createdDate)}</td>
                    <td>${window.Utils.getLocal(r.currentApprover) || '—'}</td>
                    <td><span class="badge ${window.Utils.getStatusBadge(r.status)}">${window.Utils.getLocal(r.statusLabel)}</span></td>
                    <td><button class="btn btn-secondary btn-sm" onclick="window.App.navigate('requests:view-${r.id}')">${t('viewDetails')}</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      return;
    }

    // VIEW 3: Request Detail (Submitting a new request)
    // Check if reqParam is an ID from HRData.requestTypes
    const rType = reqTypes.find(rt => rt.id === reqParam);
    
    if (rType) {
      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div style="display:flex; align-items:center; gap:var(--space-4);">
            <button class="btn btn-ghost" onclick="window.App.navigate('requests')">← ${t('back')}</button>
            <div>
              <h1 class="page-title">${window.Utils.getLocal(rType.name)}</h1>
            </div>
          </div>
        </div>

        <div class="request-detail-grid animate-fadeInUp stagger-1">
          <!-- Left Column: Details -->
          <div class="card card-body">
            <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-6);">
              <div class="request-type-icon" style="background: ${rType.bgColor}; color: ${rType.color}; width:48px; height:48px; font-size:24px;">${rType.icon}</div>
              <div>
                <h2 class="font-bold text-lg">${window.Utils.getLocal(rType.name)}</h2>
                <p class="text-tertiary">${window.Utils.getLocal(rType.desc)}</p>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <h3 class="font-semibold mb-3">شروط التقديم</h3>
            <ul class="list-disc pr-5 mb-6 text-secondary" style="margin-inline-start: 1rem;">
              <li>يحق للموظف التقديم على هذا الطلب: <strong>${window.Utils.getLocal(rType.initiator)}</strong></li>
              ${rType.id === 'leave' ? '<li>يجب ألا يتجاوز رصيد الإجازة المتاح.</li><li>يجب تحديد موظف بديل للموافقة.</li>' : ''}
              ${rType.id === 'overtime' ? '<li>يجب الحصول على موافقة مبدئية قبل العمل.</li>' : ''}
              ${rType.id === 'salary-certificate' ? '<li>يصدر الخطاب باللغة المطلوبة وموجهاً للجهة المحددة.</li>' : ''}
            </ul>

            <h3 class="font-semibold mb-3">${t('requiredData')}</h3>
            <div class="grid grid-2 gap-4 mb-6">
              ${rType.requiredData.map(d => `<div class="info-item"><span style="color:var(--primary); margin-inline-end:4px;">▪</span> ${window.Utils.getLocal(d)}</div>`).join('')}
            </div>
            
            ${rType.requiredDocs.length > 0 ? `
              <h3 class="font-semibold mb-3">${t('requiredDocs')}</h3>
              <div class="mb-6">
                ${rType.requiredDocs.map(d => `<div class="badge badge-neutral mb-2 ml-2" style="margin-inline-end: 8px;">📎 ${window.Utils.getLocal(d)}</div>`).join('')}
              </div>
            ` : ''}

            <h3 class="font-semibold mb-3">${t('afterReview')}</h3>
            <div class="timeline mt-4">
              <div class="timeline-item completed">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-title text-success">في حال الموافقة</div>
                  <div class="text-sm text-secondary">${rType.afterApproval[lang]}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sidebar -->
          <div class="request-sidebar-card card card-body">
            <button class="btn btn-primary btn-lg w-full mb-6" onclick="window.App.showToast('Opening form...', 'info')">${t('submitRequest')}</button>
            
            <h3 class="font-semibold mb-4">${t('approvalWorkflow')}</h3>
            <div class="timeline">
              ${rType.workflowSteps.map((step, idx) => `
                <div class="timeline-item ${idx === 0 ? 'current' : ''}">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">${window.Utils.getLocal(step)}</div>
                    ${idx === 0 ? `<div class="text-xs text-tertiary">الخطوة الأولى</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      return;
    }

    // VIEW 4: Existing Request Details (e.g. reqParam = 'view-REQ-2023-001')
    if (reqParam && reqParam.startsWith('view-')) {
      const reqId = reqParam.replace('view-', '');
      const req = window.HRData.requests.find(r => r.id === reqId);
      
      if (!req) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-title">Request not found</div></div>`;
        return;
      }
      
      const emp = window.Utils.getEmployee(req.employeeId);
      
      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div style="display:flex; align-items:center; gap:var(--space-4);">
            <button class="btn btn-ghost" onclick="window.App.navigate('requests:all')">← ${t('back')}</button>
            <div>
              <div style="display:flex; align-items:center; gap:var(--space-2);">
                <h1 class="page-title">${req.id}</h1>
                <span class="badge ${window.Utils.getStatusBadge(req.status)}">${window.Utils.getLocal(req.statusLabel)}</span>
              </div>
              <p class="page-subtitle">${window.Utils.getLocal(req.typeLabel)}</p>
            </div>
          </div>
          ${req.status === 'pending' ? `
            <div class="page-actions">
              <button class="btn btn-ghost text-danger" onclick="window.App.showToast('Request cancelled', 'info'); window.App.navigate('requests:all')">إلغاء الطلب</button>
            </div>
          ` : ''}
        </div>

        <div class="request-detail-grid animate-fadeInUp stagger-1">
          <div class="card card-body">
            <h3 class="section-title mb-4">معلومات الموظف</h3>
            <div class="info-grid mb-6">
              <div class="info-item">
                <div class="info-label">${t('empName')}</div>
                <div class="info-value font-bold">${lang === 'ar' ? emp.nameAr : emp.nameEn}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t('department')}</div>
                <div class="info-value">${window.Utils.getLocal(emp.department)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t('jobTitle')}</div>
                <div class="info-value">${window.Utils.getLocal(emp.jobTitle)}</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <h3 class="section-title mb-4">تفاصيل الطلب</h3>
            <div class="info-grid mb-6" style="background:var(--bg-secondary); padding:var(--space-4); border-radius:var(--radius-md);">
              ${Object.entries(req.data).map(([k, v]) => `
                <div class="info-item">
                  <div class="info-label text-xs uppercase" style="color:var(--text-tertiary)">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div class="info-value font-medium">${v}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card card-body">
            <h3 class="font-semibold mb-4">${t('approvalWorkflow')}</h3>
            <div class="timeline">
              <div class="timeline-item completed">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-title">تقديم الطلب</div>
                  <div class="timeline-time">${window.Utils.formatDate(req.createdDate)}</div>
                  <div class="text-sm text-secondary">بواسطة الموظف</div>
                </div>
              </div>
              
              <div class="timeline-item ${req.status === 'pending' ? 'current' : 'completed'}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-title">موافقة المدير المباشر</div>
                  ${req.status === 'pending' ? `<div class="timeline-time text-warning">قيد الانتظار</div>` : `<div class="timeline-time">${window.Utils.formatDate(req.createdDate)}</div>`}
                  <div class="text-sm text-secondary">${window.Utils.getLocal(req.currentApprover)}</div>
                </div>
              </div>
              
              <div class="timeline-item ${req.status === 'approved' ? 'completed' : ''}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-title">الاعتماد النهائي (الموارد البشرية)</div>
                  ${req.status === 'approved' ? `<div class="timeline-time">${window.Utils.formatDate(req.createdDate)}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
