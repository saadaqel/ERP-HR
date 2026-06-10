/* ============================================
   HR/HCM System — Performance & Dev Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.performance = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const employees = window.HRData.employees;

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('perfTitle')}</h1>
          <p class="page-subtitle">${t('perfSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.App.showToast('Evaluation Cycle Started', 'success')">
            <span>🚀</span> بدء دورة تقييم جديدة
          </button>
        </div>
      </div>

      <div class="grid grid-3 gap-6 mb-6 animate-fadeInUp stagger-1">
        <div class="card card-body col-span-2" style="grid-column: span 2;">
          <h3 class="section-title mb-4">دورة التقييم الحالية: النصف الأول 2024</h3>
          
          <div class="timeline mt-4" style="display:flex; flex-direction:row; align-items:flex-start; gap:var(--space-2);">
            <div style="flex:1; text-align:center;">
              <div style="width:24px; height:24px; background:var(--success); color:white; border-radius:50%; margin:0 auto 8px; line-height:24px; font-size:12px;">✓</div>
              <div class="font-bold text-sm">تحديد الأهداف</div>
              <div class="text-xs text-tertiary">يناير - فبراير</div>
            </div>
            <div style="flex:1; height:2px; background:var(--success); margin-top:12px;"></div>
            <div style="flex:1; text-align:center;">
              <div style="width:24px; height:24px; background:var(--primary); color:white; border-radius:50%; margin:0 auto 8px; line-height:24px; font-size:12px;">2</div>
              <div class="font-bold text-sm text-primary">التقييم الذاتي</div>
              <div class="text-xs text-tertiary">مايو</div>
            </div>
            <div style="flex:1; height:2px; background:var(--border-color); margin-top:12px;"></div>
            <div style="flex:1; text-align:center;">
              <div style="width:24px; height:24px; background:var(--bg-tertiary); color:var(--text-secondary); border-radius:50%; margin:0 auto 8px; line-height:24px; font-size:12px;">3</div>
              <div class="text-sm text-secondary">تقييم المدير</div>
              <div class="text-xs text-tertiary">يونيو</div>
            </div>
            <div style="flex:1; height:2px; background:var(--border-color); margin-top:12px;"></div>
            <div style="flex:1; text-align:center;">
              <div style="width:24px; height:24px; background:var(--bg-tertiary); color:var(--text-secondary); border-radius:50%; margin:0 auto 8px; line-height:24px; font-size:12px;">4</div>
              <div class="text-sm text-secondary">الاعتماد النهائي</div>
              <div class="text-xs text-tertiary">يوليو</div>
            </div>
          </div>
        </div>

        <div class="card stat-card border-l-4 border-purple" style="border-inline-start: 4px solid var(--purple);">
          <div>
            <div class="stat-card-label mb-2">نسبة إنجاز التقييمات</div>
            <div class="flex items-center gap-4">
              <div class="stat-card-value text-purple" style="font-size:36px;">45%</div>
              <div class="text-sm text-secondary">باقي 15 يوم على الإغلاق</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Performance Grid -->
      <h3 class="section-title mb-4 animate-fadeInUp stagger-2">نتائج الأداء للموظفين</h3>
      <div class="filter-bar animate-fadeInUp stagger-2">
        <select class="form-select">
          <option value="">${t('allDepartments')}</option>
          ${[...new Set(employees.map(e => e.department[lang === 'ar' ? 'ar' : 'en']))].map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
        <select class="form-select"><option>دورة 2023</option><option>دورة 2022</option></select>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="form-input search-input" placeholder="${t('search')}..." />
        </div>
      </div>
      
      <div class="grid grid-3 gap-4 animate-fadeInUp stagger-3 mb-8">
        ${employees.slice(0, 6).map(e => `
          <div class="card card-body flex items-center gap-4">
            <div class="avatar avatar-md" style="background:${e.avatar}">${window.Utils.getInitials(lang === 'ar' ? e.nameAr : e.nameEn)}</div>
            <div style="flex:1">
              <div class="font-bold mb-1 truncate">${lang === 'ar' ? e.nameAr : e.nameEn}</div>
              <div class="text-xs text-tertiary mb-2">${window.Utils.getLocal(e.department)}</div>
              <div class="flex items-center gap-2">
                <div class="eval-bar flex-1"><div class="eval-bar-fill ${e.performanceScore >= 4 ? 'bg-success' : e.performanceScore >= 3 ? 'bg-info' : 'bg-warning'}" style="width:${(e.performanceScore/5)*100}%"></div></div>
                <span class="text-xs font-bold">${e.performanceScore}</span>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="window.App.navigate('employee:${e.id}')">التفاصيل</button>
          </div>
        `).join('')}
      </div>

      <!-- Training Courses -->
      <div class="card animate-fadeInUp stagger-4">
        <div class="card-header"><h3 class="card-title">${t('trainingCourses')}</h3></div>
        <div class="table-container border-0">
          <table class="data-table">
            <thead>
              <tr>
                <th>اسم الدورة</th>
                <th>الموظف</th>
                <th>المزود</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold">قيادة فرق العمل المتقدمة</td>
                <td>${lang === 'ar' ? employees[0].nameAr : employees[0].nameEn}</td>
                <td>معهد الإدارة</td>
                <td>${window.Utils.formatDate('2024-06-20')}</td>
                <td><span class="badge badge-info">مجدولة</span></td>
                <td><button class="btn btn-ghost btn-sm">تأكيد</button></td>
              </tr>
              <tr>
                <td class="font-bold">شهادة PMP</td>
                <td>${lang === 'ar' ? employees[2].nameAr : employees[2].nameEn}</td>
                <td>PMI</td>
                <td>${window.Utils.formatDate('2024-03-10')}</td>
                <td><span class="badge badge-success">مكتملة</span></td>
                <td><button class="btn btn-ghost btn-sm">عرض الشهادة</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  };
})();
