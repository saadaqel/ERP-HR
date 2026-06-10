/* ============================================
   HR/HCM System — Employee Profile Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.employee = function(container, empId) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const employees = window.HRData.employees;
    
    // VIEW 1: Employee Directory
    if (!empId) {
      container.innerHTML = `
        <div class="page-header animate-fadeInDown">
          <div>
            <h1 class="page-title">${t('moduleEmployeeMgmt')}</h1>
            <p class="page-subtitle">${t('dashSubtitle')}</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" onclick="window.App.navigate('dashboard')">
              <span>+</span> ${t('qaAddEmployee')}
            </button>
          </div>
        </div>
        
        <div class="filter-bar animate-fadeInUp">
          <div class="search-box" style="flex: 3; min-width: 400px;">
            <span class="search-icon">🔍</span>
            <input type="text" id="emp-search" class="form-input search-input" placeholder="${t('search')} ${t('empName')} / ${t('empNumber')}..." onkeyup="window.EmployeeActions.filterTable()" />
          </div>
          <select class="form-select" id="emp-dept" onchange="window.EmployeeActions.filterTable()">
            <option value="">${t('allDepartments')}</option>
            ${[...new Set(employees.map(e => e.department[lang === 'ar' ? 'ar' : 'en']))].map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
          <select class="form-select" id="emp-status" onchange="window.EmployeeActions.filterTable()">
            <option value="">${t('allStatuses')}</option>
            <option value="active">${window.Utils.getStatusLabel('active')}</option>
            <option value="on-leave">${window.Utils.getStatusLabel('on-leave')}</option>
            <option value="probation">${window.Utils.getStatusLabel('probation')}</option>
          </select>
        </div>
        
        <div class="table-container animate-fadeInUp stagger-2">
          <table class="data-table" id="emp-table">
            <thead>
              <tr>
                <th>${t('empNumber')}</th>
                <th>${t('empName')}</th>
                <th>${t('department')}</th>
                <th>${t('jobTitle')}</th>
                <th>${t('status')}</th>
                <th>${t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${employees.map(e => `
                <tr data-name="${lang === 'ar' ? e.nameAr : e.nameEn}" data-id="${e.id}" data-dept="${e.department[lang === 'ar' ? 'ar' : 'en']}" data-status="${e.status}">
                  <td class="font-semibold">${e.id}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2);">
                      <div class="avatar avatar-sm" style="background:${e.avatar}">${window.Utils.getInitials(lang === 'ar' ? e.nameAr : e.nameEn)}</div>
                      <span>${lang === 'ar' ? e.nameAr : e.nameEn}</span>
                    </div>
                  </td>
                  <td>${lang === 'ar' ? e.department.ar : e.department.en}</td>
                  <td>${lang === 'ar' ? e.jobTitle.ar : e.jobTitle.en}</td>
                  <td><span class="badge ${window.Utils.getStatusBadge(e.status)}">${window.Utils.getStatusLabel(e.status)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('employee:${e.id}')">${t('viewDetails')}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      
      window.EmployeeActions = {
        filterTable: () => {
          const search = document.getElementById('emp-search').value.toLowerCase();
          const dept = document.getElementById('emp-dept').value;
          const status = document.getElementById('emp-status').value;
          const rows = document.querySelectorAll('#emp-table tbody tr');
          
          rows.forEach(row => {
            const name = row.getAttribute('data-name').toLowerCase();
            const id = row.getAttribute('data-id').toLowerCase();
            const rDept = row.getAttribute('data-dept');
            const rStatus = row.getAttribute('data-status');
            
            const matchSearch = name.includes(search) || id.includes(search);
            const matchDept = !dept || rDept === dept;
            const matchStatus = !status || rStatus === status;
            
            row.style.display = (matchSearch && matchDept && matchStatus) ? '' : 'none';
          });
        }
      };
      
      return;
    }
    
    // VIEW 2: Employee Profile
    const emp = window.Utils.getEmployee(empId);
    if (!emp) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-title">Employee not found</div></div>`;
      return;
    }
    
    const empName = lang === 'ar' ? emp.nameAr : emp.nameEn;
    const daysUntilExpiry = window.Utils.daysUntil(emp.contractEnd);
    const contractAlertHtml = (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) 
      ? `<div class="integration-indicator mb-4" style="background:var(--danger-light); color:var(--danger); border-left:4px solid var(--danger);">
          <span>⚠️</span> ${t('contractAlert')} (${daysUntilExpiry} ${t('days')})
         </div>` : '';
         
    const renderTab1 = () => `
      <div class="card card-body">
        <h3 class="section-title mb-4">${t('tabPersonal')}</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">${t('empNumber')}</div>
            <div class="info-value">${emp.id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('nationalId')}</div>
            <div class="info-value">${emp.nationalId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('nationality')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.nationality)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('mobile')}</div>
            <div class="info-value" dir="ltr" style="text-align: ${lang === 'ar' ? 'right' : 'left'};">${emp.mobile}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('email')}</div>
            <div class="info-value">${emp.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('nationalAddress')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.nationalAddress)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('qualification')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.qualification)}</div>
          </div>
          ${emp.iqamaExpiry ? `
            <div class="info-item">
              <div class="info-label">${t('expiryDate')} (الإقامة)</div>
              <div class="info-value">${window.Utils.formatDate(emp.iqamaExpiry)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    const renderTab2 = () => `
      <div class="card card-body">
        <h3 class="section-title mb-4">${t('tabJob')}</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">${t('department')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.department)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('sector')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.sector)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('jobTitle')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.jobTitle)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('directManager')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.managerName) || '—'} ${emp.manager ? `(${emp.manager})` : ''}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('empType')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.empType)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('workLocation')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.workLocation)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('shift')}</div>
            <div class="info-value">${window.Utils.getLocal(emp.shift)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('fingerprintId')}</div>
            <div class="info-value">${emp.fingerprintId}</div>
          </div>
        </div>
      </div>
    `;
    
    const renderTab3 = () => `
      <div class="card card-body">
        ${contractAlertHtml}
        <h3 class="section-title mb-4">${t('tabContract')}</h3>
        <div class="info-grid mb-6">
          <div class="info-item">
            <div class="info-label">${t('contractStart')}</div>
            <div class="info-value">${window.Utils.formatDate(emp.contractStart)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('contractEnd')}</div>
            <div class="info-value">${window.Utils.formatDate(emp.contractEnd)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('contractValue')}</div>
            <div class="info-value">${window.Utils.formatCurrency(emp.contractValue)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${t('contractPdf')}</div>
            <div class="info-value"><a href="#" onclick="event.preventDefault(); window.App.showToast('Downloading contract PDF...', 'info')">📎 ${emp.id}_Contract.pdf</a></div>
          </div>
        </div>
        
        <h4 class="font-bold mb-3">${t('renewalHistory')}</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="text-align: center;">${t('date')}</th>
                <th style="text-align: center;">${t('from')}</th>
                <th style="text-align: center;">${t('to')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">${window.Utils.formatDate('2024-03-15')}</td>
                <td style="text-align: center;">${window.Utils.formatDate('2024-03-15')}</td>
                <td style="text-align: center;">${window.Utils.formatDate('2026-03-14')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const renderTab4 = () => `
      <div class="card card-body">
        <h3 class="section-title mb-4">${t('tabSalary')}</h3>
        <div class="grid grid-2 gap-6">
          <div>
            <h4 class="font-bold mb-3">${t('payrollComponents')}</h4>
            <div class="payroll-breakdown" style="grid-template-columns: 1fr;">
              <div class="payroll-item">
                <span class="payroll-label">${t('basicSalary')}</span>
                <span class="payroll-amount">${window.Utils.formatCurrency(emp.basicSalary)}</span>
              </div>
              <div class="payroll-item">
                <span class="payroll-label">${t('housingAllowance')}</span>
                <span class="payroll-amount positive">+${window.Utils.formatCurrency(emp.allowances.housing)}</span>
              </div>
              <div class="payroll-item">
                <span class="payroll-label">${t('transportAllowance')}</span>
                <span class="payroll-amount positive">+${window.Utils.formatCurrency(emp.allowances.transport)}</span>
              </div>
              <div class="payroll-item">
                <span class="payroll-label">${t('foodAllowance')}</span>
                <span class="payroll-amount positive">+${window.Utils.formatCurrency(emp.allowances.food)}</span>
              </div>
              <div class="payroll-item">
                <span class="payroll-label">${t('gosi')}</span>
                <span class="payroll-amount negative">-${window.Utils.formatCurrency(emp.gosi)}</span>
              </div>
              ${emp.iqamaRenewalCost ? `
                <div class="payroll-item">
                  <span class="payroll-label">${t('iqamaRenewal')} (Company cost)</span>
                  <span class="payroll-amount">-${window.Utils.formatCurrency(emp.iqamaRenewalCost)}</span>
                </div>
              ` : ''}
              <div class="payroll-total">
                <span>${t('totalSalary')}</span>
                <span class="text-primary">${window.Utils.formatCurrency(emp.totalSalary)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-bold mb-3">البنك</h4>
            <div class="info-grid" style="grid-template-columns: 1fr;">
              <div class="info-item">
                <div class="info-label">${t('bankName')}</div>
                <div class="info-value">${window.Utils.getLocal(emp.bankName)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${t('iban')}</div>
                <div class="info-value" dir="ltr" style="text-align: ${lang === 'ar' ? 'right' : 'left'};">${emp.iban}</div>
              </div>
            </div>
            
            <h4 class="font-bold mb-3 mt-6">${t('endOfService')} (${lang === 'ar' ? 'تقديري' : 'Estimated'})</h4>
            <div class="integration-indicator" style="font-size: var(--fs-base); justify-content: space-between;">
              <span>${lang === 'ar' ? `الاحتساب بناءً على ${window.Utils.formatNumber(window.Utils.daysUntil(emp.hireDate)*-1)} يوم من الخدمة` : `Calculation based on ${window.Utils.daysUntil(emp.hireDate)*-1} days of service`}</span>
              <span class="font-bold">${window.Utils.formatCurrency(45000)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const renderTab5 = () => `
      <div class="docs-grid">
        ${emp.documents.map(doc => `
          <div class="card doc-card card-clickable" onclick="window.EmployeeActions.viewDocModal('${doc.type}', '${window.Utils.getLocal(doc.name)}', '${doc.status}', '${doc.expiry ? window.Utils.formatDate(doc.expiry) : ''}', '${emp.id}')">
            <div class="doc-icon" style="background: ${doc.status === 'missing' ? 'var(--danger-light)' : 'var(--bg-tertiary)'}; color: ${doc.status === 'missing' ? 'var(--danger)' : 'var(--text-secondary)'};">
              ${doc.type === 'id' ? '🪪' : doc.type === 'contract' ? '📝' : doc.type === 'insurance' ? '🏥' : '📄'}
            </div>
            <div>
              <div class="doc-name">${window.Utils.getLocal(doc.name)}</div>
              <div class="badge ${window.Utils.getStatusBadge(doc.status)} mb-1">${window.Utils.getStatusLabel(doc.status)}</div>
              ${doc.expiry ? `<div class="doc-expiry">${t('expiryDate')}: ${window.Utils.formatDate(doc.expiry)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const renderTab6 = () => {
      const atts = window.HRData.attendance.filter(a => a.empId === emp.id);
      return `
        <div class="grid grid-5 gap-4 mb-6">
          <div class="card stat-card">
            <div>
              <div class="stat-card-value">${emp.leaveBalance.annual}</div>
              <div class="stat-card-label">${t('annualLeave')}</div>
            </div>
          </div>
          <div class="card stat-card">
            <div>
              <div class="stat-card-value text-success">${emp.leaveBalance.remaining}</div>
              <div class="stat-card-label">${t('remainingDays')}</div>
            </div>
          </div>
          <div class="card stat-card">
            <div>
              <div class="stat-card-value text-orange">${emp.leaveBalance.used}</div>
              <div class="stat-card-label">${t('usedDays')}</div>
            </div>
          </div>
          <div class="card stat-card">
            <div>
              <div class="stat-card-value text-info">${emp.leaveBalance.sick}</div>
              <div class="stat-card-label">${t('sickLeave')}</div>
            </div>
          </div>
          <div class="card stat-card">
            <div>
              <div class="stat-card-value text-purple">${emp.leaveBalance.carriedOver}</div>
              <div class="stat-card-label">${t('carriedOver')}</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><h3 class="card-title">سجل الحضور الأخير</h3></div>
          <div class="table-container border-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t('date')}</th>
                  <th>${t('checkIn')}</th>
                  <th>${t('checkOut')}</th>
                  <th>${t('hours')}</th>
                  <th>${t('status')}</th>
                </tr>
              </thead>
              <tbody>
                ${atts.length > 0 ? atts.map(a => `
                  <tr>
                    <td>${window.Utils.formatDate(a.date)}</td>
                    <td>${a.checkIn || '—'}</td>
                    <td>${a.checkOut || '—'}</td>
                    <td>${a.hours !== null ? a.hours.toFixed(2) : '—'}</td>
                    <td><span class="badge ${window.Utils.getStatusBadge(a.status)}">${window.Utils.getStatusLabel(a.status)}</span></td>
                  </tr>
                `).join('') : `<tr><td colspan="5" class="text-center text-tertiary">${t('noData')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      `;
    };

    const renderTab7 = () => `
      <div class="grid grid-3 gap-6">
        <div class="card text-center eval-card">
          <h4 class="font-semibold text-secondary mb-2">${t('performanceScore')}</h4>
          <div class="eval-score">${emp.performanceScore || '—'} <span style="font-size:var(--fs-base); color:var(--text-tertiary)">/ 5.0</span></div>
          <div class="eval-bar">
            <div class="eval-bar-fill" style="width: ${(emp.performanceScore / 5) * 100}%; background: var(--purple);"></div>
          </div>
          <div class="text-sm text-tertiary mt-2">${t('lastEvaluation')}: ${window.Utils.formatDate(emp.lastEvaluation)}</div>
        </div>
        
        <div class="card col-span-2" style="grid-column: span 2;">
          <div class="card-header"><h3 class="card-title">${t('goals')} & ${t('kpis')}</h3></div>
          <div class="table-container border-0">
            <table class="data-table">
              <thead><tr><th>الهدف</th><th>المستهدف</th><th>الفعلي</th><th>النسبة</th></tr></thead>
              <tbody>
                <tr><td>تطوير النظام الأساسي</td><td>100%</td><td>95%</td><td><div class="eval-bar mt-1"><div class="eval-bar-fill bg-success" style="width:95%"></div></div></td></tr>
                <tr><td>تقليل الأعطال</td><td>< 5%</td><td>2%</td><td><div class="eval-bar mt-1"><div class="eval-bar-fill bg-success" style="width:100%"></div></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const renderTab8 = () => {
      const reqs = window.HRData.requests.filter(r => r.employeeId === emp.id);
      return `
        <div class="card">
          <div class="table-container border-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>${t('reqNumber')}</th>
                  <th>${t('reqType')}</th>
                  <th>${t('date')}</th>
                  <th>${t('status')}</th>
                  <th>${t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${reqs.length > 0 ? reqs.map(r => `
                  <tr>
                    <td class="font-semibold">${r.id}</td>
                    <td>${window.Utils.getLocal(r.typeLabel)}</td>
                    <td>${window.Utils.formatDate(r.createdDate)}</td>
                    <td><span class="badge ${window.Utils.getStatusBadge(r.status)}">${window.Utils.getLocal(r.statusLabel)}</span></td>
                    <td><button class="btn btn-secondary btn-sm" onclick="window.App.navigate('requests:${r.id}')">${t('viewDetails')}</button></td>
                  </tr>
                `).join('') : `<tr><td colspan="5" class="text-center text-tertiary">${t('noData')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      `;
    };

    const renderTab9 = () => {
      const changes = window.HRData.sensitiveChanges.filter(c => c.empId === emp.id);
      return `
        <div class="card">
          <div class="table-container border-0">
            <table class="data-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>نوع التغيير</th>
                  <th>من</th>
                  <th>إلى</th>
                  <th>تم الاعتماد بواسطة</th>
                </tr>
              </thead>
              <tbody>
                ${changes.length > 0 ? changes.map(c => `
                  <tr>
                    <td>${window.Utils.formatDate(c.date)}</td>
                    <td><span class="badge badge-orange badge-dot">${window.Utils.getLocal(c.type)}</span></td>
                    <td>${c.from}</td>
                    <td class="font-bold text-success">${c.to}</td>
                    <td>${window.Utils.getLocal(c.approvedBy)}</td>
                  </tr>
                `).join('') : `<tr><td colspan="5" class="text-center text-tertiary">${t('noData')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      `;
    };

    window.EmployeeActions = {
      switchTab: (tabId) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
      },
      viewDocModal: (type, name, status, expiry, empId) => {
        const emp = window.Utils.getEmployee(empId);
        if (!emp) return;
        
        if (status === 'missing') {
          window.App.showToast(window.App.currentLang === 'ar' ? 'المستند غير متوفر في ملف الموظف' : 'Document not available in employee file', 'error');
          return;
        }

        const lang = window.App.currentLang;
        let docHtml = '';
        const nameAr = emp.nameAr || '';
        
        if (type === 'id') {
          // Saudi National ID Card (JPG)
          docHtml = `
            <div style="background: linear-gradient(135deg, #e6dfd1 0%, #c8bc9f 100%); padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: 'Cairo', sans-serif; position: relative; overflow: hidden; border: 1px solid #b5a887; max-width: 450px; margin: 0 auto; color: #333; direction: rtl; border-collapse: separate;">
              <!-- Card Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #5a4b32; padding-bottom: 8px; margin-bottom: 15px;">
                <div style="text-align: right;">
                  <div style="font-size: 10px; font-weight: bold; color: #5a4b32;">المملكة العربية السعودية</div>
                  <div style="font-size: 9px; color: #5a4b32;">وزارة الداخلية</div>
                  <div style="font-size: 8px; color: #5a4b32;">وكالة الأحوال المدنية</div>
                </div>
                <div style="font-size: 16px;">🌴</div>
                <div style="text-align: left;">
                  <div style="font-size: 10px; font-weight: bold; color: #5a4b32;">Kingdom of Saudi Arabia</div>
                  <div style="font-size: 9px; color: #5a4b32;">Ministry of Interior</div>
                </div>
              </div>
              
              <!-- Card Title -->
              <div style="text-align: center; font-size: 12px; font-weight: bold; color: #5a4b32; margin-bottom: 15px; letter-spacing: 1px;">بطاقة الهوية الوطنية</div>
              
              <!-- Card Body -->
              <div style="display: flex; gap: 15px; align-items: flex-start;">
                <!-- Photo -->
                <div style="width: 100px; height: 125px; border-radius: 6px; background: #d0c5ad; border: 1.5px solid #a89a7a; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);">
                  <div style="font-size: 48px; opacity: 0.25;">👤</div>
                  <div style="position: absolute; bottom: 0; width: 100%; background: rgba(90, 75, 50, 0.7); color: #fff; text-align: center; font-size: 8px; padding: 2px 0;">الأحوال المدنية</div>
                </div>
                
                <!-- Info -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
                  <div>
                    <span style="color: #6e5e48; font-weight: bold; display: block; font-size: 9px; margin-bottom: 1px;">الاسم الكامل / Full Name</span>
                    <span style="font-weight: bold; font-size: 12px; color: #222;">${nameAr}</span>
                  </div>
                  <div>
                    <span style="color: #6e5e48; font-weight: bold; display: block; font-size: 9px; margin-bottom: 1px;">رقم الهوية / ID Number</span>
                    <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #222; letter-spacing: 1px;">${emp.nationalId}</span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                      <span style="color: #6e5e48; font-weight: bold; display: block; font-size: 8px; margin-bottom: 1px;">الجنسية / Nationality</span>
                      <span style="font-weight: bold;">${lang === 'ar' ? 'سعودي' : 'Saudi'}</span>
                    </div>
                    <div>
                      <span style="color: #6e5e48; font-weight: bold; display: block; font-size: 8px; margin-bottom: 1px;">تاريخ الانتهاء / Expiry</span>
                      <span style="font-weight: bold; font-family: monospace;">${expiry || '١٤٤٩/١٢/٢٥'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Card Footer -->
              <div style="margin-top: 15px; border-top: 1px dashed #a89a7a; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #6e5e48;">
                <div>رقم النسخة: ١</div>
                <div style="font-family: monospace; font-size: 9px; letter-spacing: 0.5px;"><< SAUARBI<<${emp.nameEn.split(' ')[0].toUpperCase()}<<<<<<<<<<<<<<<<<<</div>
              </div>
            </div>
          `;
        } else if (type === 'insurance') {
          // Medical Insurance Card (JPG)
          docHtml = `
            <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-family: 'Cairo', sans-serif; position: relative; overflow: hidden; border: 1px solid #142a52; max-width: 450px; margin: 0 auto; color: #fff; direction: rtl;">
              <div style="position: absolute; right: -50px; bottom: -50px; font-size: 180px; opacity: 0.05; color: #fff; pointer-events: none;">🏥</div>
              
              <!-- Card Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 20px;">🛡️</span>
                  <span style="font-weight: bold; font-size: 14px; letter-spacing: 0.5px;">ساعد للتأمين الطبي</span>
                </div>
                <div style="font-size: 10px; opacity: 0.8; font-weight: bold; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">فئة أ / Class A</div>
              </div>
              
              <!-- Card Body -->
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 11px;">
                <div>
                  <span style="opacity: 0.7; font-size: 9px; display: block; margin-bottom: 2px;">اسم العضو / Member Name</span>
                  <span style="font-weight: bold; font-size: 14px;">${nameAr}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <span style="opacity: 0.7; font-size: 9px; display: block; margin-bottom: 2px;">رقم العضوية / Member ID</span>
                    <span style="font-weight: bold; font-family: monospace; font-size: 12px;">INS-98765432</span>
                  </div>
                  <div>
                    <span style="opacity: 0.7; font-size: 9px; display: block; margin-bottom: 2px;">رقم الهوية / ID Number</span>
                    <span style="font-weight: bold; font-family: monospace; font-size: 12px;">${emp.nationalId}</span>
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <span style="opacity: 0.7; font-size: 9px; display: block; margin-bottom: 2px;">شبكة المستشفيات / Network</span>
                    <span style="font-weight: bold;">المستشفيات الكبرى (VIP)</span>
                  </div>
                  <div>
                    <span style="opacity: 0.7; font-size: 9px; display: block; margin-bottom: 2px;">تاريخ الانتهاء / Expiry Date</span>
                    <span style="font-weight: bold; font-family: monospace;">${expiry || '2026-07-01'}</span>
                  </div>
                </div>
              </div>
              
              <!-- Card Footer -->
              <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; opacity: 0.8;">
                <div>بشراكة مع التعاونية للتأمين</div>
                <div>Bupa & Tawuniya Network</div>
              </div>
            </div>
          `;
        } else if (type === 'qualification') {
          // Qualification Certificate (PDF/JPG)
          docHtml = `
            <div style="background: #faf7f0; padding: 30px; border-radius: 8px; border: 8px double #c0a060; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; font-family: 'Cairo', sans-serif; text-align: center; color: #444; direction: rtl; position: relative;">
              <div style="position: absolute; left: 20px; top: 20px; font-size: 40px; opacity: 0.15; pointer-events: none;">🎓</div>
              
              <div style="font-size: 12px; font-weight: bold; color: #8a703d; margin-bottom: 5px;">وزارة التعليم العالي</div>
              <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 25px;">جامعة الملك سعود</div>
              
              <div style="font-size: 20px; font-family: Georgia, serif; font-weight: bold; color: #8a703d; margin-bottom: 20px; border-bottom: 1px solid #e0d0b0; padding-bottom: 10px; display: inline-block;">وثيقة تخرج</div>
              
              <p style="font-size: 12px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
                تشهد عمادة القبول والتسجيل بجامعة الملك سعود بأن الموظف/ 
                <strong style="font-size: 14px; color: #111;">${nameAr}</strong>،
                قد أكمل بنجاح متطلبات التخرج وحصل على درجة:
                <strong style="color: #8a703d; display: block; font-size: 16px; margin: 10px 0;">${window.Utils.getLocal(emp.qualification)}</strong>
                بتقدير ممتاز مع مرتبة الشرف الثانية.
              </p>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 35px; font-size: 11px; color: #666; border-top: 1px dashed #e0d0b0; padding-top: 15px;">
                <div>تاريخ التخرج: ١٤٤٣/٠٨/١٥ هـ</div>
                <div style="text-align: left;">
                  <div style="font-weight: bold; color: #333; margin-bottom: 5px;">عميد القبول والتسجيل</div>
                  <div style="font-size: 14px; font-family: cursive; color: #999;">خالد بن سليمان</div>
                </div>
              </div>
            </div>
          `;
        } else if (type === 'contract') {
          // Contract Document (PDF)
          docHtml = `
            <div style="background: #fff; padding: 25px; border-radius: 4px; border: 1px solid #ddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 500px; margin: 0 auto; font-family: 'Cairo', sans-serif; color: #333; direction: rtl; text-align: right; line-height: 1.6;">
              <!-- PDF Toolbar -->
              <div style="display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 8px 12px; border-radius: 4px; margin-bottom: 20px; font-size: 11px; border: 1px solid #e5e7eb; color: #666;">
                <div>صفحة ١ من ١</div>
                <div style="display: flex; gap: 10px;">
                  <span style="cursor: pointer;" onclick="window.App.showToast('Zoom In', 'info')">🔍+</span>
                  <span style="cursor: pointer;" onclick="window.App.showToast('Zoom Out', 'info')">🔍-</span>
                  <span style="cursor: pointer; font-weight: bold;" onclick="window.App.showToast('Contract Downloaded', 'success')">💾 تحميل العقد</span>
                </div>
              </div>
              
              <!-- Document Body -->
              <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 20px;">
                <h2 style="font-size: 16px; margin: 0; color: #111;">عقد عمل موحد محدد المدة</h2>
                <div style="font-size: 10px; color: #666; margin-top: 3px;">وزارة الموارد البشرية والتنمية الاجتماعية</div>
              </div>
              
              <p style="font-size: 11px; margin-bottom: 15px;">
                إنه في يوم الموافق ${emp.contractStart} م تم إبرام هذا العقد بين كل من:
              </p>
              
              <div style="font-size: 11px; margin-bottom: 15px; padding-inline-start: 10px; border-inline-start: 3px solid var(--accent-orange);">
                <strong>الطرف الأول:</strong> شركة ساعد للنظم والتقنية (ممثلة بالمدير التنفيذي)<br>
                <strong>الطرف الثاني:</strong> الموظف: ${nameAr} | الجنسية: سعودي | الهوية: ${emp.nationalId}
              </div>
              
              <p style="font-size: 11px; text-align: justify; margin-bottom: 15px;">
                <strong>البند الأول:</strong> يوافق الطرف الثاني بموجب هذا العقد على العمل لدى الطرف الأول وتحت إشرافه بمهنة (<strong>${window.Utils.getLocal(emp.jobTitle)}</strong>) في فرع الشركة بمدينة الرياض.
              </p>
              
              <p style="font-size: 11px; text-align: justify; margin-bottom: 15px;">
                <strong>البند الثاني:</strong> مدة هذا العقد هي من تاريخ بداية العمل في ${emp.contractStart} وحتى ${emp.contractEnd}، وهو عقد قابل للتجديد بموافقة الطرفين.
              </p>
              
              <p style="font-size: 11px; text-align: justify; margin-bottom: 20px;">
                <strong>البند الثالث:</strong> يدفع الطرف الأول للطرف الثاني راتباً أساسياً شهرياً قدره (${window.Utils.formatCurrency(emp.basicSalary)}) بالإضافة إلى البدلات المقرة بالأنظمة واللوائح للشركة.
              </p>
              
              <!-- Signatures -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center; font-size: 11px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
                <div>
                  <strong style="color: #111;">توقيع الطرف الأول (المؤسسة)</strong>
                  <div style="height: 35px; line-height: 35px; color: #ccc; font-style: italic;">شركة ساعد (مختوم)</div>
                </div>
                <div>
                  <strong style="color: #111;">توقيع الطرف الثاني (الموظف)</strong>
                  <div style="height: 35px; line-height: 35px; font-family: cursive; font-size: 13px; color: #888;">${nameAr.split(' ')[0]}</div>
                </div>
              </div>
            </div>
          `;
        } else {
          // Generic official document template (like National Address, CV, Bank Letter)
          docHtml = `
            <div style="background: #fff; padding: 25px; border-radius: 4px; border: 1px solid #ddd; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 500px; margin: 0 auto; font-family: 'Cairo', sans-serif; color: #333; direction: rtl; text-align: right; line-height: 1.6;">
              <!-- Document Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--accent-orange); padding-bottom: 12px; margin-bottom: 20px;">
                <div>
                  <h3 style="font-size: 14px; margin: 0; color: #111;">${name}</h3>
                  <span style="font-size: 10px; color: #888;">مستند رسمي للموظف</span>
                </div>
                <div style="font-size: 24px; color: var(--accent-orange);">📄</div>
              </div>
              
              <!-- Document Contents -->
              <div style="font-size: 11px; min-height: 180px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <p style="margin-bottom: 12px;"><strong>صاحب المستند:</strong> ${nameAr}</p>
                  <p style="margin-bottom: 12px;"><strong>الرقم الوظيفي:</strong> ${emp.id}</p>
                  
                  ${type === 'address' ? `
                    <div style="background: #f9fafb; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 15px;">
                      <div style="font-weight: bold; margin-bottom: 5px; color: var(--accent-orange);">بيانات العنوان الوطني المسجل:</div>
                      <div>${window.Utils.getLocal(emp.nationalAddress)}</div>
                      <div style="margin-top: 5px; font-size: 10px; color: #666;">الرمز البريدي: ١١٥٦٤ | رقم المبنى: ٤١٢٤</div>
                    </div>
                  ` : ''}
                  
                  ${type === 'bank' ? `
                    <div style="background: #f9fafb; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 15px;">
                      <div style="font-weight: bold; margin-bottom: 5px; color: var(--accent-orange);">تأكيد الحساب البنكي النشط:</div>
                      <p><strong>اسم البنك:</strong> ${window.Utils.getLocal(emp.bankName)}</p>
                      <p><strong>رقم الآيبان:</strong> <span style="font-family: monospace; letter-spacing: 0.5px;">${emp.iban}</span></p>
                    </div>
                  ` : ''}
                  
                  ${type === 'cv' ? `
                    <div style="background: #f9fafb; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 15px;">
                      <div style="font-weight: bold; margin-bottom: 5px; color: var(--accent-orange);">السيرة الذاتية - ملخص مهني:</div>
                      <p><strong>المؤهل:</strong> ${window.Utils.getLocal(emp.qualification)}</p>
                      <p><strong>الخبرات السابقة:</strong> أكثر من 4 سنوات في تطوير الأنظمة والبرمجة باللغات الحديثة وإدارة قواعد البيانات.</p>
                    </div>
                  ` : ''}
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 12px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #888;">
                  <div>حالة المستند: <span class="badge ${window.Utils.getStatusBadge(status)}" style="font-size: 9px; padding: 1px 6px;">${window.Utils.getStatusLabel(status)}</span></div>
                  ${expiry ? `<div>ينتهي في: ${expiry}</div>` : ''}
                </div>
              </div>
            </div>
          `;
        }
        
        window.App.showModal(
          name,
          docHtml,
          `
          <button class="btn btn-ghost" onclick="window.App.closeModal()">${lang === 'ar' ? 'إغلاق' : 'Close'}</button>
          <div style="display:flex; gap:var(--space-2);">
            <button class="btn btn-secondary" onclick="window.App.showToast('${lang === 'ar' ? 'تم تنزيل المستند بنجاح' : 'Document downloaded successfully'}', 'success')">📥 ${lang === 'ar' ? 'تنزيل' : 'Download'}</button>
            <button class="btn btn-primary" onclick="window.App.showToast('${lang === 'ar' ? 'تم إرسال المستند للطباعة' : 'Document sent to printer'}', 'info')">🖨️ ${lang === 'ar' ? 'طباعة' : 'Print'}</button>
          </div>
          `
        );
      }
    };

    container.innerHTML = `
      <div class="breadcrumbs animate-fadeInDown">
        <span class="breadcrumb-item" onclick="window.App.navigate('employee')">${t('moduleEmployeeMgmt')}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">${emp.id}</span>
      </div>

      <div class="profile-header animate-fadeInUp stagger-1">
        <div class="profile-avatar" style="background: ${emp.avatar}">${window.Utils.getInitials(empName)}</div>
        <div class="profile-info">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h1 class="profile-name">${empName}</h1>
              <div class="profile-meta">
                <div class="profile-meta-item"><span>#️⃣</span> ${emp.id}</div>
                <div class="profile-meta-item"><span>🏢</span> ${window.Utils.getLocal(emp.department)}</div>
                <div class="profile-meta-item"><span>💼</span> ${window.Utils.getLocal(emp.jobTitle)}</div>
                <div class="profile-meta-item"><span>📱</span> ${emp.mobile}</div>
              </div>
            </div>
            <div class="badge ${window.Utils.getStatusBadge(emp.status)}">${window.Utils.getStatusLabel(emp.status)}</div>
          </div>
        </div>
      </div>

      <div class="tabs mb-6 animate-fadeInUp stagger-2">
        <div class="tab active" data-tab="1" onclick="window.EmployeeActions.switchTab(1)">${t('tabPersonal')}</div>
        <div class="tab" data-tab="2" onclick="window.EmployeeActions.switchTab(2)">${t('tabJob')}</div>
        <div class="tab" data-tab="3" onclick="window.EmployeeActions.switchTab(3)">${t('tabContract')}</div>
        <div class="tab" data-tab="4" onclick="window.EmployeeActions.switchTab(4)">${t('tabSalary')}</div>
        <div class="tab" data-tab="5" onclick="window.EmployeeActions.switchTab(5)">${t('tabDocuments')}</div>
        <div class="tab" data-tab="6" onclick="window.EmployeeActions.switchTab(6)">${t('tabAttendance')}</div>
        <div class="tab" data-tab="7" onclick="window.EmployeeActions.switchTab(7)">${t('tabPerformance')}</div>
        <div class="tab" data-tab="8" onclick="window.EmployeeActions.switchTab(8)">${t('tabRequests')}</div>
        <div class="tab" data-tab="9" onclick="window.EmployeeActions.switchTab(9)">${t('tabSensitive')}</div>
      </div>

      <div class="tab-content active animate-fadeInUp stagger-3" id="tab-1">${renderTab1()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-2">${renderTab2()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-3">${renderTab3()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-4">${renderTab4()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-5">${renderTab5()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-6">${renderTab6()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-7">${renderTab7()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-8">${renderTab8()}</div>
      <div class="tab-content animate-fadeInUp stagger-3" id="tab-9">${renderTab9()}</div>
    `;
  };
})();
