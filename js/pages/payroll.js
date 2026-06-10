/* ============================================
   HR/HCM System — Payroll & Benefits Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.payroll = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const emp = window.HRData.employees[0]; // Use employee 1001 for sample
    
    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('payTitle')}</h1>
          <p class="page-subtitle">${t('paySubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.showToast('Generating payroll...', 'info')">
            <span>⚙️</span> تشغيل مسير الرواتب
          </button>
        </div>
      </div>

      <div class="grid grid-2 gap-6 animate-fadeInUp stagger-1">
        <!-- Sample Payroll Breakdown -->
        <div class="card card-body">
          <h3 class="section-title mb-4">مسير رواتب تجريبي (${lang === 'ar' ? emp.nameAr : emp.nameEn})</h3>
          
          <div class="payroll-breakdown" style="grid-template-columns: 1fr;">
            <!-- Additions -->
            <div class="font-bold text-sm text-tertiary uppercase mb-2 mt-2">الاستحقاقات</div>
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
              <span class="payroll-label">${t('overtime')} (12 ${t('hours')})</span>
              <span class="payroll-amount positive">+${window.Utils.formatCurrency(850)}</span>
            </div>

            <!-- Deductions -->
            <div class="font-bold text-sm text-tertiary uppercase mb-2 mt-4">الاستقطاعات</div>
            <div class="payroll-item">
              <span class="payroll-label">${t('gosi')} (9.75%)</span>
              <span class="payroll-amount negative">-${window.Utils.formatCurrency(emp.gosi)}</span>
            </div>
            <div class="payroll-item">
              <span class="payroll-label">تأخير / غياب</span>
              <span class="payroll-amount negative">-${window.Utils.formatCurrency(150)}</span>
            </div>

            <div class="payroll-total mt-4 border-t border-color pt-4">
              <span>صافي الراتب</span>
              <span class="text-primary">${window.Utils.formatCurrency(emp.totalSalary + 850 - 150)}</span>
            </div>
          </div>
        </div>

        <div>
          <!-- Payroll Integration -->
          <div class="card mb-6">
            <div class="card-header"><h3 class="card-title">${t('payrollIntegration')}</h3></div>
            <div class="card-body" style="display:flex; flex-direction:column; gap:var(--space-3);">
              <div class="integration-indicator">
                <span class="text-success">✅</span> <span>العمل الإضافي المعتمد يؤثر تلقائياً في مسير الرواتب</span>
              </div>
              <div class="integration-indicator">
                <span class="text-success">✅</span> <span>الإجازات غير المدفوعة تخصم تلقائياً من الراتب الأساسي</span>
              </div>
              <div class="integration-indicator">
                <span class="text-success">✅</span> <span>مكافآت الأداء تدرج كبند إضافي في الشهر التالي</span>
              </div>
              <div class="integration-indicator">
                <span class="text-success">✅</span> <span>تحديث الحساب البنكي يعكس فوراً في ملف حماية الأجور (WPS)</span>
              </div>
            </div>
          </div>
          
          <!-- Pay Slip Actions -->
          <div class="card">
            <div class="card-header"><h3 class="card-title">${t('payrollSlips')}</h3></div>
            <div class="card-body text-center">
              <div style="font-size:48px; margin-bottom:var(--space-2);">📄</div>
              <p class="mb-4">إرسال كشوف الرواتب للموظفين عبر البريد الإلكتروني وتطبيق الجوال</p>
              <button class="btn btn-secondary w-full" onclick="window.App.showToast('Slips sent successfully', 'success')">إرسال كشوف رواتب هذا الشهر</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits Catalog -->
      <h2 class="section-title mb-4 mt-8 animate-fadeInUp stagger-2">${t('benefits')} & ${t('allowances')}</h2>
      <div class="grid grid-4 gap-4 animate-fadeInUp stagger-3">
        <div class="card card-body text-center">
          <div style="font-size:32px; margin-bottom:var(--space-2);">🏥</div>
          <h4 class="font-bold mb-1">${t('healthInsurance')}</h4>
          <p class="text-xs text-tertiary">إدارة بوالص التأمين والترقيات</p>
        </div>
        <div class="card card-body text-center">
          <div style="font-size:32px; margin-bottom:var(--space-2);">👨‍👩‍👧‍👦</div>
          <h4 class="font-bold mb-1">${t('familyBenefits')}</h4>
          <p class="text-xs text-tertiary">تذاكر سفر، تأمين العائلة</p>
        </div>
        <div class="card card-body text-center">
          <div style="font-size:32px; margin-bottom:var(--space-2);">📚</div>
          <h4 class="font-bold mb-1">${t('educationAllowance')}</h4>
          <p class="text-xs text-tertiary">بدل تعليم الأبناء</p>
        </div>
        <div class="card card-body text-center">
          <div style="font-size:32px; margin-bottom:var(--space-2);">📱</div>
          <h4 class="font-bold mb-1">${t('mobileAllowance')}</h4>
          <p class="text-xs text-tertiary">بدل اتصال وجوال</p>
        </div>
      </div>
    `;
  };
})();
