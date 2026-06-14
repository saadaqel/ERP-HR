/* ============================================
   HR/HCM System — Payroll & Benefits Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.payroll = function(container, reqParam) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    
    // State management & LocalStorage persistence
    const storageKey = 'saadaqel_payroll_state';
    const defaultState = {
      approvedMonths: ["2026-04", "2026-05"],
      juneState: {
        gosiRate: 9.75,
        lateRate: 0.5,
        missingRate: 1.0,
        absentRate: 3.33,
        tardinessDeduction: true,
        unpaidLeaveDeduction: true,
        overtimeAddition: true,
        proRata: {} // empId -> days
      }
    };
    
    let pState = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(defaultState));
    
    function saveState() {
      localStorage.setItem(storageKey, JSON.stringify(pState));
    }
    
    // Determine selected month (default to June 2026)
    const selectedMonth = reqParam || '2026-06';
    const isApproved = pState.approvedMonths.includes(selectedMonth);
    const state = pState.juneState; // June settings
    
    // Payroll Calculations Helper
    function calculateEmployeePayroll(emp, month, s) {
      const basic = parseFloat(emp.basicSalary.replace(/,/g, '')) || 0;
      
      // Allowances
      const housing = parseFloat(emp.allowances.housing.replace(/,/g, '')) || 0;
      const transport = parseFloat(emp.allowances.transport.replace(/,/g, '')) || 0;
      const food = parseFloat(emp.allowances.food.replace(/,/g, '')) || 0;
      const allowancesTotal = housing + transport + food;
      
      // Rates (percentages)
      const gosiRate = s.gosiRate || 9.75;
      const lateRate = s.lateRate || 0.5;
      const missingRate = s.missingRate || 1.0;
      const absentRate = s.absentRate || 3.33;
      
      // 1. GOSI Deduction (Calculated on Basic + Housing for Saudis, 2% hazard for non-Saudis)
      const gosiBase = basic + housing;
      let gosiDeduction = 0;
      if (emp.isSaudi) {
        gosiDeduction = (gosiRate / 100) * gosiBase;
      } else {
        gosiDeduction = 0.02 * gosiBase; // Hazard insurance
      }
      
      // 2. Attendance Deductions (if enabled)
      let attendanceDeductions = 0;
      let lateCount = 0;
      let missingCount = 0;
      let absentCount = 0;
      
      if (s.tardinessDeduction && month === '2026-06') {
        const attendance = window.HRData.attendance || [];
        const empAttendance = attendance.filter(a => a.empId === emp.id && a.date.startsWith('2026-06'));
        
        empAttendance.forEach(a => {
          if (a.status === 'late') {
            lateCount++;
            attendanceDeductions += (lateRate / 100) * basic;
          } else if (a.status === 'missing-checkout') {
            missingCount++;
            attendanceDeductions += (missingRate / 100) * basic;
          } else if (a.status === 'absent') {
            absentCount++;
            attendanceDeductions += (absentRate / 100) * basic;
          }
        });
      }
      
      // 3. Unpaid Leaves Deduction (if enabled)
      let unpaidDeduction = 0;
      let unpaidDays = 0;
      if (s.unpaidLeaveDeduction && month === '2026-06') {
        // Mock some unpaid leaves for Yasser Al-Shahri (1010) and Mohammed Al-Shammari (1005)
        if (emp.id === '1010') {
          unpaidDays = 2;
          unpaidDeduction = unpaidDays * (basic / 30);
        } else if (emp.id === '1005') {
          unpaidDays = 1;
          unpaidDeduction = unpaidDays * (basic / 30);
        }
      }
      
      // 4. Approved Overtime Pay (if enabled)
      let overtimePay = 0;
      let overtimeHours = 0;
      if (s.overtimeAddition && month === '2026-06') {
        const requests = window.HRData.requests || [];
        const empOvertime = requests.filter(r => r.employeeId === emp.id && r.type === 'overtime' && r.status === 'approved' && r.createdDate.startsWith('2026-06'));
        
        empOvertime.forEach(r => {
          if (r.data && r.data.hours) {
            overtimeHours += parseFloat(r.data.hours) || 0;
          }
        });
        
        if (overtimeHours > 0) {
          const hourlyRate = basic / 176; // standard 176 hours per month
          overtimePay = overtimeHours * 1.5 * hourlyRate; // 1.5x overtime multiplier
        }
      }
      
      // 5. Pro-rata Adjustment (الفرقية)
      let proRataDays = 0;
      if (month === '2026-06') {
        proRataDays = parseFloat(s.proRata[emp.id]) || 0;
      } else if (month === '2026-05') {
        proRataDays = emp.id === '1009' ? -3 : 0;
      } else if (month === '2026-04') {
        proRataDays = emp.id === '1004' ? 2 : 0;
      }
      
      const proRataAdjustment = proRataDays * (basic / 30);
      
      // Net Salary
      const netSalary = (basic + allowancesTotal + overtimePay + proRataAdjustment) - (gosiDeduction + attendanceDeductions + unpaidDeduction);
      
      return {
        basic,
        allowancesTotal,
        overtimePay,
        overtimeHours,
        proRataAdjustment,
        proRataDays,
        gosiDeduction,
        attendanceDeductions,
        lateCount,
        missingCount,
        absentCount,
        unpaidDeduction,
        unpaidDays,
        netSalary
      };
    }
    
    // Page Content Rendering
    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">مسير الرواتب والمزايا</h1>
          <p class="page-subtitle">إدارة ومراجعة كشوف الرواتب، الاحتساب، والاعتمادات المالية الشهرية</p>
        </div>
        <div class="page-actions" style="display:flex; gap:var(--space-3); align-items:center;">
          <select id="payroll-month-select" class="form-select" style="min-width:180px; font-weight:var(--fw-semibold);">
            <option value="2026-06" ${selectedMonth === '2026-06' ? 'selected' : ''}>يونيو 2026 (الحالي)</option>
            <option value="2026-05" ${selectedMonth === '2026-05' ? 'selected' : ''}>مايو 2026 (معتمد)</option>
            <option value="2026-04" ${selectedMonth === '2026-04' ? 'selected' : ''}>أبريل 2026 (معتمد)</option>
          </select>
          <button id="payroll-approve-btn" class="btn btn-primary" ${isApproved ? 'disabled' : ''}>
            <span>${isApproved ? '✅' : '📁'}</span>
            ${isApproved ? 'تم اعتماد وإرسال المسيرة للمالية' : 'اعتماد المسيرة وإرسالها لقسم المالية'}
          </button>
        </div>
      </div>

      <!-- Settings Panel -->
      <div class="card mb-6 animate-fadeInUp stagger-1" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
        <div class="card-header" style="border-bottom: 1px solid var(--border-light); padding: var(--space-4) var(--space-5);">
          <h3 class="card-title font-semibold" style="font-size: var(--fs-md); display:flex; align-items:center; gap:var(--space-2);">⚙️ إعدادات الحسابات والخصميات</h3>
        </div>
        <div class="card-body" style="padding: var(--space-5);">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:var(--space-4); margin-bottom: var(--space-5);">
            <!-- Rate Inputs -->
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label text-xs">خصم التأمينات الاجتماعية (GOSI %)</label>
              <input type="number" step="0.05" id="param-gosi-rate" class="form-input" value="${state.gosiRate}" ${isApproved ? 'disabled' : ''} style="max-width:140px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label text-xs">خصم التأخير (% من الأساسي)</label>
              <input type="number" step="0.05" id="param-late-rate" class="form-input" value="${state.lateRate}" ${isApproved ? 'disabled' : ''} style="max-width:140px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label text-xs">خصم خروج مفقود (% من الأساسي)</label>
              <input type="number" step="0.05" id="param-missing-rate" class="form-input" value="${state.missingRate}" ${isApproved ? 'disabled' : ''} style="max-width:140px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label text-xs">خصم الغياب (% من الأساسي)</label>
              <input type="number" step="0.05" id="param-absent-rate" class="form-input" value="${state.absentRate}" ${isApproved ? 'disabled' : ''} style="max-width:140px;">
            </div>
          </div>
          
          <div style="display:flex; flex-wrap:wrap; gap:var(--space-6); border-top:1px solid var(--border-light); padding-top:var(--space-4);">
            <label class="toggle-container" style="display:flex; align-items:center; gap:var(--space-2); cursor:pointer;">
              <input type="checkbox" id="toggle-tardiness" ${state.tardinessDeduction ? 'checked' : ''} ${isApproved ? 'disabled' : ''}>
              <span class="text-sm font-semibold">تفعيل خصم التأخر والغياب</span>
            </label>
            <label class="toggle-container" style="display:flex; align-items:center; gap:var(--space-2); cursor:pointer;">
              <input type="checkbox" id="toggle-unpaid" ${state.unpaidLeaveDeduction ? 'checked' : ''} ${isApproved ? 'disabled' : ''}>
              <span class="text-sm font-semibold">تفعيل خصم الإجازات غير المدفوعة</span>
            </label>
            <label class="toggle-container" style="display:flex; align-items:center; gap:var(--space-2); cursor:pointer;">
              <input type="checkbox" id="toggle-overtime" ${state.overtimeAddition ? 'checked' : ''} ${isApproved ? 'disabled' : ''}>
              <span class="text-sm font-semibold">تفعيل إضافي ساعات العمل المعتمدة</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Summary Dashboard -->
      <div class="grid grid-4 gap-4 mb-6 animate-fadeInUp stagger-2">
        <div class="card card-body text-center" style="border-inline-start: 4px solid var(--primary);">
          <div class="text-xs text-tertiary mb-1">صافي الرواتب الإجمالي</div>
          <div id="summary-total-net" class="text-2xl font-bold text-primary">—</div>
        </div>
        <div class="card card-body text-center" style="border-inline-start: 4px solid var(--success);">
          <div class="text-xs text-tertiary mb-1">إجمالي التأمينات (GOSI)</div>
          <div id="summary-total-gosi" class="text-2xl font-bold text-success">—</div>
        </div>
        <div class="card card-body text-center" style="border-inline-start: 4px solid var(--accent-orange);">
          <div class="text-xs text-tertiary mb-1">إجمالي الخصميات والجزاءات</div>
          <div id="summary-total-deductions" class="text-2xl font-bold text-orange">—</div>
        </div>
        <div class="card card-body text-center" style="border-inline-start: 4px solid var(--purple);">
          <div class="text-xs text-tertiary mb-1">حالة مسار الاعتماد</div>
          <div id="summary-status" class="text-sm font-bold text-purple" style="margin-top:2px;">—</div>
        </div>
      </div>

      <!-- Main Payroll Table -->
      <div class="card animate-fadeInUp stagger-3" style="border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
        <div class="table-container border-0" style="overflow-x: auto;">
          <table class="data-table" id="payroll-table">
            <thead>
              <tr>
                <th style="text-align:right;">الموظف</th>
                <th style="text-align:center;">الراتب الأساسي</th>
                <th style="text-align:center;">البدلات</th>
                <th style="text-align:center;">الخصميات</th>
                <th style="text-align:center;">الفرقية (أيام)</th>
                <th style="text-align:center;">صافي الراتب</th>
                <th style="text-align:right;">المستندات والحساب البنكي</th>
                <th style="text-align:center;">الإجراءات</th>
              </tr>
            </thead>
            <tbody id="payroll-tbody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Core Rendering Logic
    const populateTable = () => {
      const tbody = document.getElementById('payroll-tbody');
      if (!tbody) return;
      
      let totalNet = 0;
      let totalGosi = 0;
      let totalDeductions = 0;
      let missingBankCount = 0;
      
      const rows = window.HRData.employees.map(emp => {
        const calc = calculateEmployeePayroll(emp, selectedMonth, state);
        
        totalNet += calc.netSalary;
        totalGosi += calc.gosiDeduction;
        totalDeductions += (calc.gosiDeduction + calc.attendanceDeductions + calc.unpaidDeduction);
        
        const hasBank = emp.bankName && emp.iban;
        if (!hasBank) {
          missingBankCount++;
        }
        
        // Documents check
        const missingDoc = emp.documents.some(d => d.status === 'missing' || d.status === 'expired');
        const docBadge = missingDoc 
          ? `<span class="badge badge-warning" style="font-size:10px; margin-inline-start:4px; border:none; padding:2px 6px;">⚠️ نقص ملفات</span>` 
          : `<span class="badge badge-success" style="font-size:10px; margin-inline-start:4px; border:none; padding:2px 6px;">✓ مكتمل</span>`;
          
        const bankBadge = hasBank
          ? `<div style="font-size:11px; color:var(--text-secondary);">🏦 ${window.Utils.getLocal(emp.bankName)}</div>`
          : `<span class="badge badge-danger" style="font-size:10px; border:none; padding:2px 6px;">⚠️ بدون حساب بنكي</span>`;
          
        const proRataCell = isApproved
          ? `<span>${calc.proRataDays > 0 ? '+' : ''}${calc.proRataDays} يوم</span>`
          : `<input type="number" class="form-input pro-rata-input" style="max-width:75px; text-align:center; padding: 4px 6px; font-size:13px; margin:0 auto;" data-emp-id="${emp.id}" value="${calc.proRataDays}">`;
          
        return `
          <tr>
            <td style="text-align:right;">
              <div class="font-bold" style="font-size:14px; color:var(--text-primary);">${lang === 'ar' ? emp.nameAr : emp.nameEn}</div>
              <div class="text-xs text-tertiary">#${emp.id} — ${window.Utils.getLocal(emp.jobTitle)}</div>
            </td>
            <td style="text-align:center; font-weight:var(--fw-medium);">${window.Utils.formatNumber(calc.basic)}</td>
            <td style="text-align:center; font-weight:var(--fw-medium); color:var(--success);">+${window.Utils.formatNumber(calc.allowancesTotal)}</td>
            <td style="text-align:center; font-weight:var(--fw-medium); color:var(--danger);">${window.Utils.formatNumber(calc.gosiDeduction + calc.attendanceDeductions + calc.unpaidDeduction)}</td>
            <td style="text-align:center;">${proRataCell}</td>
            <td style="text-align:center; font-weight:var(--fw-bold); color:var(--primary);">${window.Utils.formatCurrency(calc.netSalary)}</td>
            <td style="text-align:right; vertical-align:middle;">
              <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start;">
                ${bankBadge}
                ${docBadge}
              </div>
            </td>
            <td style="text-align:center;">
              <button class="btn btn-secondary btn-sm" onclick="window.PayrollActions.showPayslip('${emp.id}')">📄 كشف الراتب</button>
            </td>
          </tr>
        `;
      }).join('');
      
      tbody.innerHTML = rows;
      
      // Update Summary Cards
      document.getElementById('summary-total-net').innerText = window.Utils.formatCurrency(totalNet);
      document.getElementById('summary-total-gosi').innerText = window.Utils.formatCurrency(totalGosi);
      document.getElementById('summary-total-deductions').innerText = window.Utils.formatCurrency(totalDeductions);
      
      const statusCard = document.getElementById('summary-status');
      if (isApproved) {
        statusCard.innerHTML = `<span class="text-success" style="display:flex; align-items:center; justify-content:center; gap:4px;">✅ معتمد ومرسل للمالية</span>`;
      } else {
        statusCard.innerHTML = `<span class="text-warning">⏳ مسودة قيد التعديل</span>${missingBankCount > 0 ? `<div style="font-size:10px; color:var(--danger); font-weight:var(--fw-medium); margin-top:2px;">⚠️ ${missingBankCount} موظف بدون حساب بنكي</div>` : ''}`;
      }
    };
    
    // Register actions
    window.PayrollActions = {
      showPayslip: (empId) => {
        const emp = window.HRData.employees.find(e => e.id === empId);
        if (!emp) return;
        
        const calc = calculateEmployeePayroll(emp, selectedMonth, state);
        
        window.App.showModal(
          `كشف راتب تفصيلي — ${lang === 'ar' ? emp.nameAr : emp.nameEn} (#${emp.id})`,
          `
          <div style="direction:rtl; text-align:right; font-family:'Cairo', sans-serif;">
            <div style="display:flex; justify-content:space-between; margin-bottom:var(--space-4); border-bottom:1px solid var(--border-light); padding-bottom:var(--space-3);">
              <div>
                <strong>المنصب:</strong> ${window.Utils.getLocal(emp.jobTitle)}
              </div>
              <div>
                <strong>الفترة:</strong> ${selectedMonth === '2026-06' ? 'يونيو 2026' : selectedMonth === '2026-05' ? 'مايو 2026' : 'أبريل 2026'}
              </div>
            </div>
            
            <table class="data-table" style="width:100%; border:1px solid var(--border-light); font-size:13px; margin-bottom:var(--space-4);">
              <thead>
                <tr style="background:var(--bg-secondary);">
                  <th style="text-align:right; padding:6px 12px;">البند</th>
                  <th style="text-align:center; padding:6px 12px;">الاستحقاقات (SAR)</th>
                  <th style="text-align:center; padding:6px 12px;">الاستقطاعات (SAR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align:right;">الراتب الأساسي</td>
                  <td style="text-align:center; font-weight:var(--fw-medium);">${window.Utils.formatNumber(calc.basic)}</td>
                  <td style="text-align:center;">—</td>
                </tr>
                <tr>
                  <td style="text-align:right;">بدل سكن</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--success);">+${window.Utils.formatNumber(parseFloat(emp.allowances.housing.replace(/,/g, '')))}</td>
                  <td style="text-align:center;">—</td>
                </tr>
                <tr>
                  <td style="text-align:right;">بدل نقل</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--success);">+${window.Utils.formatNumber(parseFloat(emp.allowances.transport.replace(/,/g, '')))}</td>
                  <td style="text-align:center;">—</td>
                </tr>
                <tr>
                  <td style="text-align:right;">بدل معيشة / غذاء</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--success);">+${window.Utils.formatNumber(parseFloat(emp.allowances.food.replace(/,/g, '')))}</td>
                  <td style="text-align:center;">—</td>
                </tr>
                ${calc.overtimePay > 0 ? `
                <tr>
                  <td style="text-align:right;">العمل الإضافي (${calc.overtimeHours} ساعة معتمدة)</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--success);">+${window.Utils.formatNumber(calc.overtimePay)}</td>
                  <td style="text-align:center;">—</td>
                </tr>
                ` : ''}
                ${calc.proRataDays !== 0 ? `
                <tr>
                  <td style="text-align:right;">الفرقية (تعديل الأيام: ${calc.proRataDays > 0 ? '+' : ''}${calc.proRataDays} يوم)</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); ${calc.proRataAdjustment >= 0 ? 'color:var(--success);' : 'color:var(--danger);'}">
                    ${calc.proRataAdjustment >= 0 ? '+' : ''}${window.Utils.formatNumber(calc.proRataAdjustment)}
                  </td>
                  <td style="text-align:center;">—</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="text-align:right;">خصم التأمينات الاجتماعية (GOSI)</td>
                  <td style="text-align:center;">—</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--danger);">${window.Utils.formatNumber(calc.gosiDeduction)}</td>
                </tr>
                ${calc.attendanceDeductions > 0 ? `
                <tr>
                  <td style="text-align:right;">حسومات الحضور والغياب (${calc.lateCount} تأخر، ${calc.missingCount} خروج مفقود، ${calc.absentCount} غياب)</td>
                  <td style="text-align:center;">—</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--danger);">${window.Utils.formatNumber(calc.attendanceDeductions)}</td>
                </tr>
                ` : ''}
                ${calc.unpaidDeduction > 0 ? `
                <tr>
                  <td style="text-align:right;">حسومات إجازات بدون راتب (${calc.unpaidDays} يوم)</td>
                  <td style="text-align:center;">—</td>
                  <td style="text-align:center; font-weight:var(--fw-medium); color:var(--danger);">${window.Utils.formatNumber(calc.unpaidDeduction)}</td>
                </tr>
                ` : ''}
                <tr style="background:var(--bg-secondary); font-weight:var(--fw-bold);">
                  <td style="text-align:right;">المجموع الإجمالي</td>
                  <td style="text-align:center; color:var(--success);">+${window.Utils.formatNumber(calc.basic + calc.allowancesTotal + calc.overtimePay + (calc.proRataAdjustment > 0 ? calc.proRataAdjustment : 0))}</td>
                  <td style="text-align:center; color:var(--danger);">${window.Utils.formatNumber(calc.gosiDeduction + calc.attendanceDeductions + calc.unpaidDeduction + (calc.proRataAdjustment < 0 ? Math.abs(calc.proRataAdjustment) : 0))}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:var(--space-3); border-radius:var(--radius-md); font-weight:var(--fw-bold); font-size:15px;">
              <span>صافي راتب الموظف:</span>
              <span class="text-primary">${window.Utils.formatCurrency(calc.netSalary)}</span>
            </div>
            
            <div style="font-size:11px; color:var(--text-tertiary); margin-top:var(--space-3); line-height:var(--lh-relaxed);">
              ${emp.bankName ? `🏦 يتم الإيداع في: <strong>${window.Utils.getLocal(emp.bankName)}</strong> — الآيبان: ${emp.iban}` : '⚠️ تنبيه: لم يتم تسجيل حساب بنكي للموظف. سيتم تعليق الإيداع التلقائي.'}
            </div>
          </div>
          `,
          `
          <div style="display:flex; justify-content:space-between; width:100%;">
            <button class="btn btn-secondary" onclick="window.App.closeModal()">إغلاق</button>
            <button class="btn btn-primary" onclick="window.print();">🖨️ طباعة كشف الراتب</button>
          </div>
          `
        );
      }
    };
    
    // Mount initial values
    populateTable();
    
    // Event listeners
    const monthSelect = document.getElementById('payroll-month-select');
    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        window.App.navigate('payroll:' + e.target.value);
      });
    }
    
    const approveBtn = document.getElementById('payroll-approve-btn');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        pState.approvedMonths.push(selectedMonth);
        saveState();
        window.App.showToast('تم اعتماد مسير الرواتب بنجاح وإرساله للمالية', 'success');
        window.Pages.payroll(container, selectedMonth);
      });
    }
    
    // Inputs & toggles event listener
    const bindChange = (id, field, isCheckbox = false) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener(isCheckbox ? 'change' : 'input', (e) => {
          state[field] = isCheckbox ? e.target.checked : parseFloat(e.target.value) || 0;
          saveState();
          populateTable();
        });
      }
    };
    
    bindChange('param-gosi-rate', 'gosiRate');
    bindChange('param-late-rate', 'lateRate');
    bindChange('param-missing-rate', 'missingRate');
    bindChange('param-absent-rate', 'absentRate');
    bindChange('toggle-tardiness', 'tardinessDeduction', true);
    bindChange('toggle-unpaid', 'unpaidLeaveDeduction', true);
    bindChange('toggle-overtime', 'overtimeAddition', true);
    
    // Pro-rata input delegation
    const table = document.getElementById('payroll-table');
    if (table) {
      table.addEventListener('input', (e) => {
        if (e.target && e.target.classList.contains('pro-rata-input')) {
          const empId = e.target.getAttribute('data-emp-id');
          state.proRata[empId] = parseFloat(e.target.value) || 0;
          saveState();
          populateTable();
        }
      });
    }
  };
})();
