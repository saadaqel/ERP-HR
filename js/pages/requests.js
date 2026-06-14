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
          ${reqTypes.map(rt => {
            const name = window.Utils.getLocal({ ar: rt.nameAr, en: rt.nameEn });
            const desc = window.Utils.getLocal({ ar: rt.descAr, en: rt.descEn });
            const initiator = window.Utils.getLocal({ ar: rt.initiatorAr, en: rt.initiatorEn });
            
            return `
              <div class="card card-clickable request-type-card" onclick="window.App.navigate('requests:${rt.id}')">
                <div class="req-header">
                  <div class="req-icon" style="background: ${rt.bgColor}; color: ${rt.color};">${rt.icon}</div>
                  <h3 class="req-title">${name}</h3>
                </div>
                <p class="request-type-desc" style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-4); line-height: var(--lh-normal); flex: 1;">${desc}</p>
                <div class="req-meta">
                  <span class="badge badge-neutral" style="font-size: 10px;">${t('initiator')}: ${initiator}</span>
                </div>
              </div>
            `;
          }).join('')}
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
      const name = window.Utils.getLocal({ ar: rType.nameAr, en: rType.nameEn });
      const desc = window.Utils.getLocal({ ar: rType.descAr, en: rType.descEn });
      const initiator = window.Utils.getLocal({ ar: rType.initiatorAr, en: rType.initiatorEn });
      
      const requiredData = rType.requiredData || [
        { ar: 'اسم الموظف والرقم الوظيفي', en: 'Employee Name & ID' },
        { ar: 'القسم أو الإدارة المعنية', en: 'Relevant Department / Sector' },
        { ar: 'تفاصيل ومبررات الطلب', en: 'Request details and justification' }
      ];
      const requiredDocs = rType.requiredDocs || [];
      const afterApproval = rType.afterApproval || { 
        ar: 'سيتم تحديث سجلاتك تلقائياً في النظام وتنبيه الجهات المعنية بعد الاعتماد النهائي.', 
        en: 'Your records will be updated automatically and relevant departments notified upon final approval.' 
      };
      const workflowSteps = rType.workflowSteps || [
        { ar: 'تقديم الطلب من الموظف', en: 'Request Submission' },
        { ar: 'موافقة المدير المباشر', en: 'Direct Manager Approval' },
        { ar: 'اعتماد إدارة الموارد البشرية', en: 'HR Approval & Execution' }
      ];

      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div style="display:flex; align-items:center; gap:var(--space-4);">
            <button class="btn btn-ghost" onclick="window.App.navigate('requests')">← ${t('back')}</button>
            <div>
              <h1 class="page-title">${name}</h1>
            </div>
          </div>
        </div>

        <div class="request-detail-grid animate-fadeInUp stagger-1">
          <!-- Left Column: Details -->
          <div class="card card-body">
            <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-6);">
              <div class="req-icon" style="background: ${rType.bgColor}; color: ${rType.color}; width:48px; height:48px; font-size:24px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">${rType.icon}</div>
              <div>
                <h2 class="font-bold text-lg">${name}</h2>
                <p class="text-tertiary">${desc}</p>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <h3 class="font-semibold mb-2" style="font-size: var(--fs-md); color: var(--text-primary); margin-top: var(--space-4);">${t('conditions') || 'شروط التقديم'}</h3>
            <ul style="list-style-type: disc; padding-inline-start: var(--space-5); margin-bottom: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2); color: var(--text-secondary); font-size: var(--fs-base); line-height: var(--lh-relaxed);">
              <li>يحق للموظف التقديم على هذا الطلب: <strong>${initiator}</strong></li>
              ${rType.id === 'leave' ? '<li>يجب ألا يتجاوز رصيد الإجازة المتاح.</li><li>يجب تحديد موظف بديل للموافقة.</li>' : ''}
              ${rType.id === 'overtime' ? '<li>يجب الحصول على موافقة مبدئية قبل العمل.</li>' : ''}
              ${rType.id === 'salary-certificate' ? '<li>يصدر الخطاب باللغة المطلوبة وموجهاً للجهة المحددة.</li>' : ''}
            </ul>

            <h3 class="font-semibold mb-2" style="font-size: var(--fs-md); color: var(--text-primary); margin-top: var(--space-4);">${t('requiredData')}</h3>
            <div style="display:flex; flex-direction:column; gap:var(--space-2); padding-inline-start: var(--space-3); margin-bottom: var(--space-5);">
              ${requiredData.map(d => `
                <div style="display:flex; align-items:center; gap:var(--space-2); font-size: var(--fs-base); color: var(--text-secondary);">
                  <span style="color:var(--accent-orange); font-size: 14px;">▪</span> 
                  <span>${window.Utils.getLocal(d)}</span>
                </div>
              `).join('')}
            </div>
            
            ${requiredDocs.length > 0 ? `
              <h3 class="font-semibold mb-2" style="font-size: var(--fs-md); color: var(--text-primary); margin-top: var(--space-4);">${t('requiredDocs')}</h3>
              <div style="display:flex; flex-wrap:wrap; gap:var(--space-2); margin-bottom: var(--space-5);">
                ${requiredDocs.map(d => `<div class="badge badge-neutral">📎 ${window.Utils.getLocal(d)}</div>`).join('')}
              </div>
            ` : ''}

            <h3 class="font-semibold mb-2" style="font-size: var(--fs-md); color: var(--text-primary); margin-top: var(--space-4);">${t('afterReview')}</h3>
            <div class="timeline timeline-sm" style="padding: 0; margin-bottom: var(--space-2);">
              <div class="timeline-item completed">
                <div class="timeline-marker">✓</div>
                <div class="timeline-content">
                  <div class="timeline-title text-success" style="font-weight: var(--fw-bold);">في حال الموافقة</div>
                  <div class="text-sm text-secondary" style="line-height: var(--lh-normal);">${window.Utils.getLocal(afterApproval)}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Sidebar -->
          <div class="request-sidebar-card card card-body">
            <button class="btn btn-primary btn-lg w-full mb-6" onclick="window.App.showToast('Opening form...', 'info')">${t('submitRequest')}</button>
            
            <h3 class="font-semibold mb-4" style="font-size: var(--fs-md); color: var(--text-primary); text-align: right;">${t('approvalWorkflow')}</h3>
            <div class="timeline timeline-sm" style="padding-top: 0;">
              ${workflowSteps.map((step, idx) => `
                <div class="timeline-item ${idx === 0 ? 'current' : 'pending'}">
                  ${idx < workflowSteps.length - 1 ? `<div class="timeline-connector"></div>` : ''}
                  <div class="timeline-marker">${idx + 1}</div>
                  <div class="timeline-content">
                    <div class="timeline-title" style="font-size: var(--fs-base); font-weight: ${idx === 0 ? 'var(--fw-bold)' : 'var(--fw-medium)'};">${window.Utils.getLocal(step)}</div>
                    ${idx === 0 ? `<div class="text-xs text-tertiary" style="margin-top: 2px;">الخطوة الأولى</div>` : ''}
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
            <h3 class="font-semibold mb-4" style="font-size: var(--fs-md); color: var(--text-primary); text-align: right;">${t('approvalWorkflow')}</h3>
            <div class="timeline timeline-sm" style="padding-top: 0;">
              <div class="timeline-item completed">
                <div class="timeline-connector"></div>
                <div class="timeline-marker">✓</div>
                <div class="timeline-content">
                  <div class="timeline-title" style="font-size: var(--fs-base); font-weight: var(--fw-medium);">تقديم الطلب</div>
                  <div class="timeline-time" style="margin-top: 2px;">${window.Utils.formatDate(req.createdDate)}</div>
                  <div class="text-sm text-secondary" style="margin-top: 2px;">بواسطة الموظف</div>
                </div>
              </div>
              
              <div class="timeline-item ${req.status === 'pending' ? 'current' : 'completed'}">
                <div class="timeline-connector"></div>
                <div class="timeline-marker">${req.status === 'pending' ? '⏳' : '✓'}</div>
                <div class="timeline-content">
                  <div class="timeline-title" style="font-size: var(--fs-base); font-weight: var(--fw-medium);">موافقة المدير المباشر</div>
                  ${req.status === 'pending' ? `<div class="timeline-time text-warning" style="margin-top: 2px;">قيد الانتظار</div>` : `<div class="timeline-time" style="margin-top: 2px;">${window.Utils.formatDate(req.createdDate)}</div>`}
                  <div class="text-sm text-secondary" style="margin-top: 2px;">${window.Utils.getLocal(req.currentApprover)}</div>
                </div>
              </div>
              
              <div class="timeline-item ${req.status === 'approved' ? 'completed' : 'pending'}">
                <div class="timeline-marker">${req.status === 'approved' ? '✓' : '🔒'}</div>
                <div class="timeline-content">
                  <div class="timeline-title" style="font-size: var(--fs-base); font-weight: var(--fw-medium);">الاعتماد النهائي (الموارد البشرية)</div>
                  ${req.status === 'approved' ? `<div class="timeline-time" style="margin-top: 2px;">${window.Utils.formatDate(req.createdDate)}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
