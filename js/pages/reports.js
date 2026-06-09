/* ============================================
   HR/HCM System — Reports Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.reports = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    
    // Sample report categories and items
    const reports = [
      {
        catId: 'emp', 
        catName: lang === 'ar' ? 'الموظفون' : 'Employees',
        items: [
          { id: 'emp_master', icon: '👥', ar: 'البيانات الأساسية للموظفين', en: 'Employee Master Data' },
          { id: 'emp_history', icon: '📜', ar: 'السجل الوظيفي', en: 'Employment History' },
          { id: 'emp_promo', icon: '📈', ar: 'الترقيات', en: 'Promotions' },
          { id: 'emp_transfer', icon: '🔄', ar: 'التنقلات الداخلية', en: 'Internal Transfers' },
          { id: 'emp_salary_change', icon: '💰', ar: 'تغيرات الرواتب', en: 'Salary Changes' },
          { id: 'emp_contract_renew', icon: '📝', ar: 'تجديد العقود', en: 'Contract Renewals' },
          { id: 'emp_sensitive', icon: '🔒', ar: 'سجل التغييرات الحساسة', en: 'Sensitive Changes Log' }
        ]
      },
      {
        catId: 'att',
        catName: lang === 'ar' ? 'الحضور والإجازات' : 'Attendance & Leave',
        items: [
          { id: 'att_balance', icon: '🏖️', ar: 'أرصدة الإجازات', en: 'Leave Balances' },
          { id: 'att_usage', icon: '📅', ar: 'استخدام الإجازات', en: 'Leave Usage' },
          { id: 'att_avail', icon: '👥', ar: 'توفر الفريق', en: 'Team Availability' },
          { id: 'att_except', icon: '⚠️', ar: 'استثناءات الحضور', en: 'Attendance Exceptions' },
          { id: 'att_late', icon: '⏱️', ar: 'التأخير', en: 'Late Arrivals' },
          { id: 'att_early', icon: '🏃', ar: 'الخروج المبكر', en: 'Early Departures' },
          { id: 'att_absent', icon: '❌', ar: 'الغياب', en: 'Absences' }
        ]
      },
      {
        catId: 'pay',
        catName: lang === 'ar' ? 'الرواتب والمزايا' : 'Payroll & Benefits',
        items: [
          { id: 'pay_ot_hours', icon: '⏰', ar: 'ساعات العمل الإضافي', en: 'Overtime Hours' },
          { id: 'pay_ot_cost', icon: '💵', ar: 'تكلفة العمل الإضافي', en: 'Overtime Cost' },
          { id: 'pay_changes', icon: '📊', ar: 'تغيرات مسير الرواتب', en: 'Payroll Changes' },
          { id: 'pay_benefits', icon: '🏥', ar: 'المزايا والبدلات', en: 'Benefits & Allowances' },
          { id: 'pay_eos', icon: '💼', ar: 'مكافآت نهاية الخدمة', en: 'End of Service' }
        ]
      },
      {
        catId: 'ops',
        catName: lang === 'ar' ? 'العمليات' : 'Operations',
        items: [
          { id: 'ops_term', icon: '🚪', ar: 'إنهاء الخدمة / الاستقالات', en: 'Terminations / Resignations' },
          { id: 'ops_clear', icon: '📦', ar: 'إخلاء الطرف', en: 'Clearance' },
          { id: 'ops_access', icon: '🔑', ar: 'سحب الصلاحيات', en: 'Access Removal' },
          { id: 'ops_missing_docs', icon: '📄', ar: 'المستندات الناقصة', en: 'Missing Documents' },
          { id: 'ops_exp_contracts', icon: '⏳', ar: 'العقود المقاربة للانتهاء', en: 'Expiring Contracts' },
          { id: 'ops_perf', icon: '📈', ar: 'تقييم الأداء', en: 'Performance Evaluations' },
          { id: 'ops_train', icon: '🎓', ar: 'الدورات التدريبية', en: 'Training Courses' },
          { id: 'ops_bonus', icon: '🎁', ar: 'المكافآت', en: 'Bonuses' },
          { id: 'ops_warn', icon: '⚠️', ar: 'الإنذارات', en: 'Warnings' },
          { id: 'ops_new', icon: '🆕', ar: 'الموظفون الجدد', en: 'New Employees' }
        ]
      }
    ];

    window.ReportActions = {
      showReportSample: (repId, repName) => {
        window.App.showModal(
          repName,
          `
          <div class="filter-bar mb-4" style="background:none; padding:0; box-shadow:none;">
            <input type="date" class="form-input" value="2024-01-01" />
            <input type="date" class="form-input" value="2024-12-31" />
            <select class="form-select"><option>${t('allDepartments')}</option></select>
            <button class="btn btn-secondary">تطبيق التصفية</button>
          </div>
          
          <div class="table-container border-0">
            <table class="data-table">
              <thead><tr><th>رقم الموظف</th><th>الاسم</th><th>القسم</th><th>القيمة المحددة للتقرير</th><th>التاريخ</th></tr></thead>
              <tbody>
                <tr><td>EMP001</td><td>أحمد عبدالله</td><td>تقنية المعلومات</td><td>بيانات تجريبية 1</td><td>2024-05-01</td></tr>
                <tr><td>EMP002</td><td>سارة محمد</td><td>الموارد البشرية</td><td>بيانات تجريبية 2</td><td>2024-05-02</td></tr>
                <tr><td>EMP003</td><td>فهد عبدالعزيز</td><td>المالية</td><td>بيانات تجريبية 3</td><td>2024-05-03</td></tr>
              </tbody>
            </table>
          </div>
          `,
          `
          <button class="btn btn-ghost" onclick="window.App.closeModal()">${t('close')}</button>
          <div style="display:flex; gap:var(--space-2);">
            <button class="btn btn-secondary" onclick="window.App.showToast('Exporting to PDF...', 'info')">📄 تصدير PDF</button>
            <button class="btn btn-primary" onclick="window.App.showToast('Exporting to Excel...', 'success')">📊 تصدير Excel</button>
          </div>
          `
        );
      }
    };

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('repTitle')}</h1>
          <p class="page-subtitle">${t('repSubtitle')}</p>
        </div>
      </div>

      <div class="filter-bar animate-fadeInUp stagger-1">
        <input type="date" class="form-input" placeholder="${t('from')}" />
        <input type="date" class="form-input" placeholder="${t('to')}" />
        <select class="form-select"><option>${t('allDepartments')}</option></select>
        <select class="form-select"><option>جميع الحالات</option><option>نشط</option><option>منتهي</option></select>
        <button class="btn btn-secondary">${t('search')}</button>
      </div>

      <div class="grid gap-8 animate-fadeInUp stagger-2">
        ${reports.map(cat => `
          <div>
            <h2 class="section-title mb-4 border-b border-color pb-2">${cat.catName}</h2>
            <div class="grid grid-4 gap-4">
              ${cat.items.map(item => `
                <div class="card card-body card-clickable text-center" style="padding:var(--space-4);" onclick="window.ReportActions.showReportSample('${item.id}', '${lang === 'ar' ? item.ar : item.en}')">
                  <div style="font-size:24px; margin-bottom:var(--space-2);">${item.icon}</div>
                  <h4 class="font-bold text-sm">${lang === 'ar' ? item.ar : item.en}</h4>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };
})();
