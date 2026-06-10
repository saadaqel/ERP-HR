/* ============================================
   HR/HCM System — Offboarding Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.offboarding = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const checklist = window.HRData.offboardingChecklist;
    const emp = window.HRData.employees.find(e => e.id === '1005'); // Sample resigning employee

    window.OffboardingActions = {
      toggleCheck: (id) => {
        const item = checklist.find(c => c.id === id);
        if (item) {
          item.checked = !item.checked;
          window.App.navigate('offboarding', true); // Re-render without hash change
          if(item.checked) window.App.showToast(`تم إنجاز: ${lang === 'ar' ? item.itemAr : item.itemEn}`, 'success');
        }
      }
    };

    const completed = checklist.filter(c => c.checked).length;
    const total = checklist.length;
    const progress = (completed / total) * 100;

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('offTitle')}</h1>
          <p class="page-subtitle">${t('offSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.showToast('Starting new offboarding', 'info')">
            <span>+</span> ${t('startOffboarding')}
          </button>
        </div>
      </div>

      <div class="grid grid-3 gap-6 animate-fadeInUp stagger-1">
        <!-- Left Col: Case Details & Checklist -->
        <div class="col-span-2" style="grid-column: span 2;">
          
          <div class="card mb-6">
            <div class="card-header border-b border-color" style="display:flex; justify-content:space-between; align-items:center;">
              <h3 class="card-title">حالة إخلاء طرف نشطة</h3>
              <span class="badge badge-warning">قيد الإجراء</span>
            </div>
            <div class="card-body">
              <div class="flex items-center gap-4 mb-6">
                <div class="avatar avatar-lg" style="background:${emp.avatar}">${window.Utils.getInitials(lang === 'ar' ? emp.nameAr : emp.nameEn)}</div>
                <div>
                  <h2 class="font-bold text-xl">${lang === 'ar' ? emp.nameAr : emp.nameEn} (${emp.id})</h2>
                  <div class="text-secondary">${window.Utils.getLocal(emp.department)} - ${window.Utils.getLocal(emp.jobTitle)}</div>
                </div>
              </div>
              
              <div class="grid grid-3 gap-4 mb-6 p-4 rounded-md" style="background:var(--bg-secondary);">
                <div><div class="text-xs text-tertiary uppercase">تاريخ تقديم الاستقالة</div><div class="font-bold">15 مايو 2024</div></div>
                <div><div class="text-xs text-tertiary uppercase">آخر يوم عمل</div><div class="font-bold text-danger">14 يونيو 2024</div></div>
                <div><div class="text-xs text-tertiary uppercase">السبب</div><div class="font-bold">استقالة - فرصة أفضل</div></div>
              </div>
              
              <div class="mb-2 flex justify-between items-end">
                <h4 class="font-bold">${t('offboardingChecklist')}</h4>
                <span class="text-sm font-bold ${progress === 100 ? 'text-success' : 'text-primary'}">${Math.round(progress)}%</span>
              </div>
              <div class="eval-bar mb-6" style="height:8px;">
                <div class="eval-bar-fill ${progress === 100 ? 'bg-success' : 'bg-primary'}" style="width:${progress}%"></div>
              </div>
              
              <div class="checklist" style="display:flex; flex-direction:column; gap:var(--space-2);">
                ${checklist.map(item => `
                  <div class="card card-body flex items-center justify-between" style="padding:var(--space-3); ${item.checked ? 'opacity:0.6;' : ''}">
                    <div class="flex items-center gap-3">
                      <input type="checkbox" ${item.checked ? 'checked' : ''} onclick="window.OffboardingActions.toggleCheck('${item.id}')" style="width:20px; height:20px; cursor:pointer; accent-color:var(--success);" />
                      <div>
                        <div class="font-semibold ${item.checked ? 'line-through text-tertiary' : ''}">${lang === 'ar' ? item.itemAr : item.itemEn}</div>
                        <div class="text-xs text-tertiary">${lang === 'ar' ? item.deptAr : item.deptEn}</div>
                      </div>
                    </div>
                    ${item.checked ? '<span class="text-success">✅</span>' : ''}
                  </div>
                `).join('')}
              </div>
              
              ${progress === 100 ? `
                <div class="mt-6 p-4 border border-success bg-success text-success rounded-md text-center" style="background: var(--success-light);">
                  <div class="font-bold text-lg mb-1">اكتمل إخلاء الطرف بنجاح 🎉</div>
                  <p class="text-sm">يمكنك الآن إصدار المخالصة النهائية.</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Right Col: Settlement & Access -->
        <div>
          <!-- Clearance Workflow -->
          <div class="card mb-6">
            <div class="card-header"><h3 class="card-title">${t('clearanceStatus')}</h3></div>
            <div class="card-body">
              <div class="timeline">
                <div class="timeline-item completed">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">تقديم الاستقالة</div>
                    <div class="text-xs text-tertiary">15 مايو 2024</div>
                  </div>
                </div>
                <div class="timeline-item current">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title text-primary">إخلاء الطرف (الأقسام)</div>
                    <div class="text-xs text-tertiary">قيد الإجراء</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">التسوية النهائية</div>
                    <div class="text-xs text-tertiary">المالية</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">المخالصة النهائية</div>
                    <div class="text-xs text-tertiary">الموارد البشرية</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Final Settlement -->
          <div class="card mb-6">
            <div class="card-header"><h3 class="card-title">${t('finalSettlement')} (تقديري)</h3></div>
            <div class="card-body">
              <div class="payroll-breakdown" style="grid-template-columns: 1fr;">
                <div class="payroll-item">
                  <span class="payroll-label">راتب الأيام المتبقية (14 يوم)</span>
                  <span class="payroll-amount positive">+${window.Utils.formatCurrency(4500)}</span>
                </div>
                <div class="payroll-item">
                  <span class="payroll-label">بدل رصيد إجازات (8 أيام)</span>
                  <span class="payroll-amount positive">+${window.Utils.formatCurrency(2800)}</span>
                </div>
                <div class="payroll-item">
                  <span class="payroll-label">مكافأة نهاية الخدمة (سنتين)</span>
                  <span class="payroll-amount positive">+${window.Utils.formatCurrency(8500)}</span>
                </div>
                <div class="payroll-total mt-4 border-t border-color pt-4">
                  <span>إجمالي التسوية</span>
                  <span class="text-primary font-bold">${window.Utils.formatCurrency(15800)}</span>
                </div>
              </div>
              <button class="btn btn-secondary w-full mt-4" ${progress < 100 ? 'disabled' : ''}>إصدار مسير التسوية</button>
            </div>
          </div>
          
          <!-- Access Control -->
          <div class="card">
            <div class="card-header"><h3 class="card-title">${t('accessRemoval')}</h3></div>
            <div class="card-body">
              <div class="flex items-center justify-between p-3 border-b border-color">
                <div class="flex items-center gap-2"><span>📧</span> <span>البريد الإلكتروني</span></div>
                <button class="btn btn-ghost btn-sm text-danger" onclick="this.textContent='تم الإلغاء'; this.classList.remove('text-danger'); this.classList.add('text-success')">إلغاء الصلاحية</button>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-color">
                <div class="flex items-center gap-2"><span>💻</span> <span>نظام ERP</span></div>
                <span class="text-success text-sm">تم الإلغاء</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-color">
                <div class="flex items-center gap-2"><span>🏢</span> <span>بطاقة الدخول للمبنى</span></div>
                <span class="text-warning text-sm">بانتظار التسليم</span>
              </div>
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center gap-2"><span>🏥</span> <span>التأمين الطبي</span></div>
                <span class="text-warning text-sm">يلغى بنهاية العقد</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
})();
