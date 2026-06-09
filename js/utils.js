/* ============================================
   HR/HCM System — Utility Functions
   ============================================ */
(function() {
window.Utils = {
  // Get localized text from a bilingual object { ar, en }
  getLocal(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[window.App.currentLang] || obj.ar || obj.en || '';
  },

  // Format date for display
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const lang = window.App.currentLang;
    return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  },

  // Relative time
  timeAgo(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const lang = window.App.currentLang;

    if (diffMins < 1) return lang === 'ar' ? 'الآن' : 'Just now';
    if (diffMins < 60) return lang === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return lang === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays < 7) return lang === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    return this.formatDate(dateStr);
  },

  // Days until a date
  daysUntil(dateStr) {
    if (!dateStr) return Infinity;
    const now = new Date();
    const d = new Date(dateStr);
    return Math.ceil((d - now) / 86400000);
  },

  // Status badge class
  getStatusBadge(status) {
    const map = {
      'pending': 'badge-warning badge-dot',
      'approved': 'badge-success badge-dot',
      'rejected': 'badge-danger badge-dot',
      'in-progress': 'badge-info badge-dot',
      'completed': 'badge-success badge-dot',
      'returned': 'badge-orange badge-dot',
      'cancelled': 'badge-neutral badge-dot',
      'active': 'badge-success badge-dot',
      'on-leave': 'badge-info badge-dot',
      'probation': 'badge-warning badge-dot',
      'inactive': 'badge-neutral badge-dot',
      'valid': 'badge-success',
      'expiring': 'badge-warning',
      'expired': 'badge-danger',
      'missing': 'badge-danger',
      'current': 'badge-orange badge-dot',
      'present': 'badge-success',
      'late': 'badge-warning',
      'early-departure': 'badge-warning',
      'absent': 'badge-danger',
      'missing-checkout': 'badge-danger',
      'sick-leave': 'badge-info',
    };
    return map[status] || 'badge-neutral';
  },

  // Status label
  getStatusLabel(status) {
    const lang = window.App.currentLang;
    const map = {
      'pending': { ar: 'قيد الموافقة', en: 'Pending' },
      'approved': { ar: 'معتمد', en: 'Approved' },
      'rejected': { ar: 'مرفوض', en: 'Rejected' },
      'in-progress': { ar: 'قيد التنفيذ', en: 'In Progress' },
      'completed': { ar: 'مكتمل', en: 'Completed' },
      'returned': { ar: 'معاد للتعديل', en: 'Returned' },
      'cancelled': { ar: 'ملغي', en: 'Cancelled' },
      'active': { ar: 'نشط', en: 'Active' },
      'on-leave': { ar: 'في إجازة', en: 'On Leave' },
      'probation': { ar: 'فترة تجربة', en: 'Probation' },
      'inactive': { ar: 'غير نشط', en: 'Inactive' },
      'valid': { ar: 'ساري', en: 'Valid' },
      'expiring': { ar: 'يقارب الانتهاء', en: 'Expiring' },
      'expired': { ar: 'منتهي', en: 'Expired' },
      'missing': { ar: 'ناقص', en: 'Missing' },
      'current': { ar: 'الحالي', en: 'Current' },
      'present': { ar: 'حاضر', en: 'Present' },
      'late': { ar: 'تأخر', en: 'Late' },
      'early-departure': { ar: 'انصراف مبكر', en: 'Early Departure' },
      'absent': { ar: 'غائب', en: 'Absent' },
      'missing-checkout': { ar: 'خروج مفقود', en: 'Missing Checkout' },
      'sick-leave': { ar: 'إجازة مرضية', en: 'Sick Leave' },
    };
    const m = map[status];
    return m ? m[lang] : status;
  },

  // Get employee by ID
  getEmployee(id) {
    return window.HRData.employees.find(e => e.id === id);
  },

  // Get employee name
  getEmployeeName(id) {
    const emp = this.getEmployee(id);
    if (!emp) return '';
    return this.getLocal(emp.nameAr ? { ar: emp.nameAr, en: emp.nameEn } : emp);
  },

  // Generate initials from name
  getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0];
    return parts[0][0];
  },

  // Random color for avatars
  avatarColors: ['#FF9800', '#7C3AED', '#2196F3', '#E91E63', '#009688', '#4CAF50', '#795548', '#607D8B', '#F44336', '#3F51B5'],

  // Debounce
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Number format
  formatNumber(num) {
    if (typeof num === 'string') num = parseFloat(num.replace(/,/g, ''));
    if (isNaN(num)) return '0';
    return num.toLocaleString(window.App.currentLang === 'ar' ? 'ar-SA' : 'en-US');
  },

  // Currency format
  formatCurrency(amount) {
    const t = window.App.t.bind(window.App);
    if (typeof amount === 'string') return `${amount} ${t('sar')}`;
    return `${this.formatNumber(amount)} ${t('sar')}`;
  },

  // Create element helper
  el(tag, attrs, children) {
    const elem = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') elem.className = v;
        else if (k === 'innerHTML') elem.innerHTML = v;
        else if (k.startsWith('on')) elem.addEventListener(k.slice(2).toLowerCase(), v);
        else elem.setAttribute(k, v);
      });
    }
    if (children) {
      if (typeof children === 'string') elem.textContent = children;
      else if (Array.isArray(children)) children.forEach(c => c && elem.appendChild(c));
      else elem.appendChild(children);
    }
    return elem;
  }
};
})();
