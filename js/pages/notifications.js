/* ============================================
   HR/HCM System — Notifications Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  window.Pages.notifications = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    const notifs = window.HRData.notifications;

    window.NotifActions = {
      switchTab: (tabId) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
      },
      markAllRead: () => {
        window.App.markAllRead();
        window.App.navigate('notifications', true);
        window.App.showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
      }
    };

    container.innerHTML = `
      <div class="page-header animate-fadeInDown">
        <div>
          <h1 class="page-title">${t('notifTitle')}</h1>
          <p class="page-subtitle">${t('notifSubtitle')}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="window.NotifActions.markAllRead()">
            <span>✓✓</span> ${t('markAllRead')}
          </button>
        </div>
      </div>

      <div class="tabs mb-6 animate-fadeInUp stagger-1">
        <div class="tab active" data-tab="inapp" onclick="window.NotifActions.switchTab('inapp')">${t('inApp')} <span class="badge badge-danger ml-2" style="border-radius:10px;">${notifs.filter(n=>!n.read).length}</span></div>
        <div class="tab" data-tab="email" onclick="window.NotifActions.switchTab('email')">${t('emailPreview')}</div>
        <div class="tab" data-tab="sms" onclick="window.NotifActions.switchTab('sms')">${t('smsPlaceholder')}</div>
      </div>

      <!-- Tab 1: In-App Notifications -->
      <div class="tab-content active animate-fadeInUp stagger-2" id="tab-inapp">
        <div class="filter-bar mb-4">
          <select class="form-select" style="min-width: 200px;">
            <option>جميع الإشعارات</option>
            <option>طلبات وموافقات</option>
            <option>مستندات وعقود</option>
            <option>تنبيهات النظام</option>
          </select>
        </div>
        
        <div class="card">
          <div class="notif-list">
            ${notifs.map(n => `
              <div class="notif-item ${n.read ? '' : 'unread'}" style="padding: var(--space-4); border-bottom: 1px solid var(--border-color); ${n.read ? '' : 'background: var(--bg-secondary);'}">
                <div class="notif-icon" style="background:${n.bgColor}; width:48px; height:48px; font-size:24px;">${n.icon}</div>
                <div class="notif-content">
                  <div class="notif-title" style="font-size: var(--fs-base);">${lang === 'ar' ? n.titleAr : n.titleEn}</div>
                  <div class="notif-desc" style="font-size: var(--fs-sm);">${lang === 'ar' ? n.descAr : n.descEn}</div>
                  <div class="notif-time mt-2" style="font-size: var(--fs-xs);">${window.Utils.timeAgo(n.time)}</div>
                </div>
                ${!n.read ? `<div style="width:10px; height:10px; border-radius:50%; background:var(--primary);"></div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Tab 2: Email Preview -->
      <div class="tab-content animate-fadeInUp stagger-2" id="tab-email">
        <div class="grid grid-2 gap-6">
          <div class="card">
            <div class="card-header border-b border-color" style="background:#f3f4f6;">
              <div class="text-sm"><strong>من:</strong> نظام الموارد البشرية &lt;noreply@hr.company.com&gt;</div>
              <div class="text-sm mt-1"><strong>إلى:</strong> مدير القسم &lt;manager@company.com&gt;</div>
              <div class="font-bold mt-2">الموضوع: إجراء مطلوب - طلب إجازة جديد</div>
            </div>
            <div class="card-body" style="font-family: Arial, sans-serif;">
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:32px; color:var(--primary);">نظام ساعد</div>
              </div>
              <h2 style="font-size:18px; color:#333; margin-bottom:15px;">عزيزي المدير،</h2>
              <p style="color:#555; line-height:1.5;">قام الموظف <strong>أحمد عبدالله (1001)</strong> بتقديم طلب إجازة سنوية ويحتاج إلى مراجعتك واعتمادك.</p>
              
              <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
                <div style="margin-bottom:8px;"><strong>تاريخ البداية:</strong> 15 يوليو 2024</div>
                <div style="margin-bottom:8px;"><strong>عدد الأيام:</strong> 10 أيام</div>
                <div><strong>رصيد الإجازات المتبقي:</strong> 21 يوم</div>
              </div>
              
              <div style="text-align:center; margin:30px 0;">
                <button class="btn btn-primary">عرض الطلب في النظام</button>
              </div>
              
              <p style="font-size:12px; color:#999; text-align:center;">هذه رسالة تلقائية من النظام، الرجاء عدم الرد عليها.</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header border-b border-color" style="background:#f3f4f6;">
              <div class="text-sm"><strong>من:</strong> نظام الموارد البشرية &lt;noreply@hr.company.com&gt;</div>
              <div class="text-sm mt-1"><strong>إلى:</strong> سارة محمد &lt;sara@company.com&gt;</div>
              <div class="font-bold mt-2">الموضوع: تحديث حالة الطلب - تمت الموافقة</div>
            </div>
            <div class="card-body" style="font-family: Arial, sans-serif;">
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:32px; color:var(--primary);">نظام ساعد</div>
              </div>
              <h2 style="font-size:18px; color:#333; margin-bottom:15px;">عزيزتي سارة،</h2>
              <p style="color:#555; line-height:1.5;">نود إعلامك بأنه قد تمت <span style="color:var(--success); font-weight:bold;">الموافقة</span> على طلبك رقم (REQ-2024-045).</p>
              
              <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
                <div style="margin-bottom:8px;"><strong>نوع الطلب:</strong> خطاب تعريف بالراتب</div>
                <div style="margin-bottom:8px;"><strong>الجهة الموجه إليها:</strong> البنك الأهلي السعودي</div>
                <div><strong>ملاحظات الاعتماد:</strong> تم إصدار الخطاب وهو مرفق في النظام.</div>
              </div>
              
              <div style="text-align:center; margin:30px 0;">
                <button class="btn btn-secondary">تحميل الخطاب</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: SMS Preview -->
      <div class="tab-content animate-fadeInUp stagger-2" id="tab-sms">
        <div style="display:flex; justify-content:center;">
          <!-- Phone Mockup -->
          <div style="width:320px; height:600px; background:#fff; border:12px solid #333; border-radius:36px; position:relative; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
            <!-- Speaker notch -->
            <div style="position:absolute; top:0; left:50%; transform:translateX(-50%); width:120px; height:25px; background:#333; border-bottom-left-radius:15px; border-bottom-right-radius:15px; z-index:10;"></div>
            
            <!-- Screen Header -->
            <div style="height:80px; background:#f9f9f9; border-bottom:1px solid #eee; display:flex; flex-direction:column; justify-content:flex-end; padding-bottom:10px; text-align:center;">
              <div style="font-size:12px; color:#999; margin-bottom:2px;">رسائل نصية</div>
              <div style="font-weight:bold; font-size:14px;">HR System</div>
            </div>
            
            <!-- Messages -->
            <div style="padding:15px; display:flex; flex-direction:column; gap:15px; height:calc(100% - 80px); background:#f0f2f5;">
              <div style="align-self:center; font-size:11px; color:#999;">أمس 09:30 ص</div>
              
              <div style="background:#fff; padding:12px 15px; border-radius:18px; border-top-right-radius:4px; max-width:85%; align-self:flex-start; box-shadow:0 1px 2px rgba(0,0,0,0.05); font-size:14px; line-height:1.4;">
                عزيزي الموظف،<br>تم تحويل راتب شهر مايو لحسابك البنكي بنجاح.<br>بإمكانك الاطلاع على مسير الرواتب عبر تطبيق نظام ساعد
              </div>
              
              <div style="align-self:center; font-size:11px; color:#999;">اليوم 11:15 ص</div>
              
              <div style="background:#fff; padding:12px 15px; border-radius:18px; border-top-right-radius:4px; max-width:85%; align-self:flex-start; box-shadow:0 1px 2px rgba(0,0,0,0.05); font-size:14px; line-height:1.4;">
                نظام ساعد: لديك (3) طلبات جديدة بانتظار الاعتماد. الرجاء الدخول للنظام للمراجعة.
              </div>
              
              <div style="background:#fff; padding:12px 15px; border-radius:18px; border-top-right-radius:4px; max-width:85%; align-self:flex-start; box-shadow:0 1px 2px rgba(0,0,0,0.05); font-size:14px; line-height:1.4;">
                تذكير: عقدك ينتهي بعد 30 يوماً. نرجو التواصل مع الموارد البشرية لتجديد العقد.
              </div>
            </div>
            
            <!-- Home bar -->
            <div style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); width:100px; height:4px; background:#ccc; border-radius:2px;"></div>
          </div>
        </div>
      </div>
    `;
  };
})();
