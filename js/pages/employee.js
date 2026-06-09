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
          <div class="search-box" style="flex: 1; min-width: 250px;">
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
                <th>${t('date')}</th>
                <th>${t('from')}</th>
                <th>${t('to')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${window.Utils.formatDate('2024-03-15')}</td>
                <td>${window.Utils.formatDate('2024-03-15')}</td>
                <td>${window.Utils.formatDate('2026-03-14')}</td>
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
            
            <h4 class="font-bold mb-3 mt-6">${t('endOfService')} (Estimated)</h4>
            <div class="integration-indicator" style="font-size: var(--fs-base); justify-content: space-between;">
              <span>Calculation based on ${window.Utils.daysUntil(emp.hireDate)*-1} days of service</span>
              <span class="font-bold">SAR 45,000</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const renderTab5 = () => `
      <div class="docs-grid">
        ${emp.documents.map(doc => `
          <div class="card doc-card">
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
