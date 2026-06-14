/* ============================================
   HR/HCM System — Company Structure Page
   ============================================ */
(function() {
  window.Pages = window.Pages || {};
  
  // Initialize default structure on window.HRData if not present
  window.HRData.companyStructure = window.HRData.companyStructure || [
    { id: '1', titleAr: 'الرئيس التنفيذي (CEO)', titleEn: 'Chief Executive Officer (CEO)', employeeId: '1006', parentId: null },
    { id: '2', titleAr: 'المدير المالي', titleEn: 'Finance Manager', employeeId: '1008', parentId: '1' },
    { id: '3', titleAr: 'محاسب', titleEn: 'Accountant', employeeId: '1005', parentId: '2' },
    { id: '4', titleAr: 'مدير الموارد البشرية', titleEn: 'HR Manager', employeeId: '1004', parentId: '1' },
    { id: '5', titleAr: 'أخصائي موارد بشرية', titleEn: 'HR Specialist', employeeId: '1002', parentId: '4' },
    { id: '6', titleAr: 'الرئيس التقني (CTO)', titleEn: 'Chief Technology Officer (CTO)', employeeId: '1003', parentId: '1' },
    { id: '7', titleAr: 'أخصائي تقنية معلومات', titleEn: 'IT Specialist', employeeId: '1001', parentId: '6' },
    { id: '8', titleAr: 'أخصائي تقنية معلومات', titleEn: 'IT Specialist', employeeId: null, parentId: '6' },
    { id: '9', titleAr: 'مدير القطاع التقني', titleEn: 'Director of Technical Sector', employeeId: '1007', parentId: '1' },
    { id: '10', titleAr: 'مدير قطاع التشغيل', titleEn: 'Operations Sector Director', employeeId: null, parentId: '1' },
    { id: '11', titleAr: 'موظف استقبال', titleEn: 'Receptionist', employeeId: '1010', parentId: '10' },
    { id: '12', titleAr: 'مدير قطاع الفعاليات والمؤتمرات', titleEn: 'Events & Conferences Director', employeeId: null, parentId: '1' },
    { id: '13', titleAr: 'أخصائية فعاليات وتسويق', titleEn: 'Events & Marketing Specialist', employeeId: '1009', parentId: '12' }
  ];

  window.Pages.structure = function(container) {
    const t = window.App.t.bind(window.App);
    const lang = window.App.currentLang;
    
    window.StructureActions = {
      currentScale: (window.StructureActions && window.StructureActions.currentScale) || 1.0,

      zoomIn: () => {
        let scale = window.StructureActions.currentScale || 1.0;
        scale = Math.min(scale + 0.1, 2.0);
        window.StructureActions.currentScale = scale;
        window.StructureActions.applyZoom();
      },

      zoomOut: () => {
        let scale = window.StructureActions.currentScale || 1.0;
        scale = Math.max(scale - 0.1, 0.4);
        window.StructureActions.currentScale = scale;
        window.StructureActions.applyZoom();
      },

      resetZoom: () => {
        window.StructureActions.currentScale = 1.0;
        window.StructureActions.applyZoom();
        
        const viewport = document.getElementById('org-viewport');
        const scaler = document.getElementById('org-scaler');
        if (viewport && scaler) {
          const orgTree = scaler.querySelector('.org-tree');
          if (orgTree) {
            viewport.scrollLeft = (orgTree.offsetWidth - viewport.clientWidth) / 2;
            viewport.scrollTop = 0;
          }
        }
      },

      applyZoom: () => {
        const scaler = document.getElementById('org-scaler');
        if (scaler) {
          scaler.style.transform = `scale(${window.StructureActions.currentScale || 1.0})`;
        }
      },

      initPanZoom: () => {
        const viewport = document.getElementById('org-viewport');
        const scaler = document.getElementById('org-scaler');
        if (!viewport || !scaler) return;

        let isDown = false;
        let startX, startY;
        let scrollLeft, scrollTop;

        // Mouse events
        viewport.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // Only drag with left click
          isDown = true;
          viewport.style.cursor = 'grabbing';
          startX = e.pageX - viewport.offsetLeft;
          startY = e.pageY - viewport.offsetTop;
          scrollLeft = viewport.scrollLeft;
          scrollTop = viewport.scrollTop;
        });

        viewport.addEventListener('mouseleave', () => {
          isDown = false;
          viewport.style.cursor = 'grab';
        });

        viewport.addEventListener('mouseup', () => {
          isDown = false;
          viewport.style.cursor = 'grab';
        });

        viewport.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - viewport.offsetLeft;
          const y = e.pageY - viewport.offsetTop;
          const walkX = (x - startX);
          const walkY = (y - startY);
          viewport.scrollLeft = scrollLeft - walkX;
          viewport.scrollTop = scrollTop - walkY;
        });

        // Touch events
        viewport.addEventListener('touchstart', (e) => {
          isDown = true;
          startX = e.touches[0].pageX - viewport.offsetLeft;
          startY = e.touches[0].pageY - viewport.offsetTop;
          scrollLeft = viewport.scrollLeft;
          scrollTop = viewport.scrollTop;
        });

        viewport.addEventListener('touchend', () => {
          isDown = false;
        });

        viewport.addEventListener('touchmove', (e) => {
          if (!isDown) return;
          const x = e.touches[0].pageX - viewport.offsetLeft;
          const y = e.touches[0].pageY - viewport.offsetTop;
          const walkX = (x - startX);
          const walkY = (y - startY);
          viewport.scrollLeft = scrollLeft - walkX;
          viewport.scrollTop = scrollTop - walkY;
        });

        // Horizontal centering helper
        setTimeout(() => {
          const orgTree = scaler.querySelector('.org-tree');
          if (orgTree && viewport) {
            const treeWidth = orgTree.scrollWidth || orgTree.offsetWidth;
            const viewportWidth = viewport.clientWidth;
            if (treeWidth > viewportWidth) {
              viewport.scrollLeft = (treeWidth - viewportWidth) / 2;
            } else {
              viewport.scrollLeft = 0;
            }
            viewport.scrollTop = 0;
          }
        }, 50);
      },

      renderAll: () => {
        const nodes = window.HRData.companyStructure;
        
        // Recursive helper to build tree nodes
        const buildTree = (list, parentId) => {
          return list
            .filter(n => n.parentId === parentId)
            .map(n => ({
              ...n,
              children: buildTree(list, n.id)
            }));
        };

        const renderNode = (node) => {
          const hasChildren = node.children && node.children.length > 0;
          const emp = node.employeeId ? window.HRData.employees.find(e => e.id === node.employeeId) : null;
          const isFilled = !!emp;
          
          const nodeClass = isFilled ? 'filled' : 'vacant';
          const title = lang === 'ar' ? node.titleAr : node.titleEn;
          const statusText = isFilled ? (lang === 'ar' ? emp.nameAr : emp.nameEn) : t('vacant');
          
          return `
            <div class="org-node-wrapper ${hasChildren ? '' : 'no-children'}">
              <div class="org-node ${nodeClass}" onclick="window.StructureActions.showNodeOptions('${node.id}')">
                <div class="org-node-title">${title}</div>
                <div class="org-node-name">${statusText}</div>
                <div class="org-node-status">${isFilled ? '🟢' : '🔴'}</div>
              </div>
              ${hasChildren ? `
                <div class="org-children">
                  ${node.children.map(renderNode).join('')}
                </div>
              ` : ''}
            </div>
          `;
        };

        const roots = buildTree(nodes, null);
        
        container.innerHTML = `
          <div class="page-header animate-fadeInDown">
            <div>
              <h1 class="page-title">${t('navStructure')}</h1>
              <p class="page-subtitle">${lang === 'ar' ? 'هيكلة وتوزيع المناصب والموظفين في الشركة' : 'Organizational structure and employee position mapping'}</p>
            </div>
            <div class="page-actions">
              <button class="btn btn-primary" onclick="window.StructureActions.addRootPositionModal()">
                <span>+</span> ${t('addRootPosition')}
              </button>
            </div>
          </div>
          
          <div class="org-tree-container animate-fadeInUp">
            <div class="org-tree-viewport" id="org-viewport">
              <div class="org-tree-scaler" id="org-scaler">
                <div class="org-tree">
                  ${roots.length > 0 ? roots.map(renderNode).join('') : `<div class="empty-state"><div class="empty-state-icon">🌳</div><div class="empty-state-title">${lang === 'ar' ? 'الهيكل فارغ' : 'Structure is empty'}</div></div>`}
                </div>
              </div>
            </div>
            <!-- Floating Controls -->
            <div class="org-controls">
              <button class="org-control-btn" onclick="window.StructureActions.zoomIn()" title="${lang === 'ar' ? 'تكبير' : 'Zoom In'}">➕</button>
              <button class="org-control-btn" onclick="window.StructureActions.zoomOut()" title="${lang === 'ar' ? 'تصغير' : 'Zoom Out'}">➖</button>
              <button class="org-control-btn" onclick="window.StructureActions.resetZoom()" title="${lang === 'ar' ? 'إعادة ضبط' : 'Reset Zoom'}">🎯</button>
            </div>
          </div>
        `;

        // Initialize pan, zoom, and centering
        window.StructureActions.initPanZoom();
        window.StructureActions.applyZoom();
      },

      showNodeOptions: (id) => {
        const node = window.HRData.companyStructure.find(n => n.id === id);
        if (!node) return;
        
        const employees = window.HRData.employees;
        const currentEmpId = node.employeeId;
        
        const empSelectOptions = employees.map(e => {
          const otherRole = window.HRData.companyStructure.find(n => n.employeeId === e.id && n.id !== id);
          const otherRoleLabel = otherRole ? ` (${lang === 'ar' ? 'معين كـ: ' + otherRole.titleAr : 'Assigned as: ' + otherRole.titleEn})` : '';
          const isSelected = e.id === currentEmpId ? 'selected' : '';
          return `<option value="${e.id}" ${isSelected}>${lang === 'ar' ? e.nameAr : e.nameEn}${otherRoleLabel}</option>`;
        }).join('');
        
        const bodyHtml = `
          <div style="display:flex; flex-direction:column; gap:var(--space-4); direction:${lang === 'ar' ? 'rtl' : 'ltr'}; text-align:${lang === 'ar' ? 'right' : 'left'};">
            
            <!-- Assign Employee -->
            <div class="form-group">
              <label class="form-label">${t('assignEmployee')}</label>
              <select class="form-select" id="node-emp-select">
                <option value="">-- ${lang === 'ar' ? 'شاغر (بدون موظف)' : 'Vacant (No Employee)'} --</option>
                ${empSelectOptions}
              </select>
            </div>

            <hr class="divider">
            
            <!-- Edit Titles -->
            <div class="form-group">
              <label class="form-label">${t('positionTitle')}</label>
              <input type="text" class="form-input" id="node-title-ar" value="${node.titleAr}">
            </div>
            <div class="form-group">
              <label class="form-label">${t('positionTitleEn')}</label>
              <input type="text" class="form-input" id="node-title-en" value="${node.titleEn}">
            </div>
            
            <hr class="divider">
            
            <!-- Create Child Branch -->
            <div style="background:var(--bg-secondary); padding:var(--space-4); border-radius:var(--radius-md); border:1.5px dashed var(--border-color);">
              <h4 style="font-weight:bold; margin-bottom:var(--space-3);">${t('addChildPosition')}</h4>
              <div class="form-group">
                <label class="form-label">${lang === 'ar' ? 'مسمى الفرع بالعربية' : 'Subordinate Title (Arabic)'}</label>
                <input type="text" class="form-input" id="new-child-title-ar" placeholder="مثال: مطور ويب...">
              </div>
              <div class="form-group">
                <label class="form-label">${lang === 'ar' ? 'مسمى الفرع بالإنجليزية' : 'Subordinate Title (English)'}</label>
                <input type="text" class="form-input" id="new-child-title-en" placeholder="e.g. Web Developer...">
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.StructureActions.addChildPosition('${id}')">+ ${t('addChildPosition')}</button>
            </div>
          </div>
        `;
        
        const footerHtml = `
          <div style="display:flex; justify-content:space-between; width:100%; direction:${lang === 'ar' ? 'rtl' : 'ltr'};">
            <button class="btn btn-ghost text-danger" onclick="window.StructureActions.deletePosition('${id}')">${t('deletePosition')}</button>
            <div style="display:flex; gap:var(--space-2);">
              <button class="btn btn-ghost" onclick="window.App.closeModal()">${t('close')}</button>
              <button class="btn btn-primary" onclick="window.StructureActions.saveNodeChanges('${id}')">${t('save')}</button>
            </div>
          </div>
        `;
        
        window.App.showModal(lang === 'ar' ? `إدارة منصب: ${node.titleAr}` : `Manage Position: ${node.titleEn}`, bodyHtml, footerHtml);
      },

      saveNodeChanges: (id) => {
        const node = window.HRData.companyStructure.find(n => n.id === id);
        if (!node) return;
        
        const titleAr = document.getElementById('node-title-ar').value.trim();
        const titleEn = document.getElementById('node-title-en').value.trim();
        const selectedEmpId = document.getElementById('node-emp-select').value;
        
        if (!titleAr || !titleEn) {
          window.App.showToast(lang === 'ar' ? 'يرجى ملء المسميات الوظيفية' : 'Please fill in job titles', 'error');
          return;
        }
        
        // If employee is being assigned, vacate their previous position
        if (selectedEmpId) {
          const oldPosition = window.HRData.companyStructure.find(n => n.employeeId === selectedEmpId && n.id !== id);
          if (oldPosition) {
            oldPosition.employeeId = null;
          }
        }
        
        node.titleAr = titleAr;
        node.titleEn = titleEn;
        node.employeeId = selectedEmpId || null;
        
        window.App.closeModal();
        window.App.showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully', 'success');
        window.StructureActions.renderAll();
      },

      addChildPosition: (parentId) => {
        const titleAr = document.getElementById('new-child-title-ar').value.trim();
        const titleEn = document.getElementById('new-child-title-en').value.trim();
        
        if (!titleAr || !titleEn) {
          window.App.showToast(lang === 'ar' ? 'يرجى إدخال المسميات الوظيفية للفرع الجديد' : 'Please enter job titles for the new branch', 'error');
          return;
        }
        
        const newId = Date.now().toString();
        window.HRData.companyStructure.push({
          id: newId,
          titleAr,
          titleEn,
          employeeId: null,
          parentId
        });
        
        window.App.closeModal();
        window.App.showToast(lang === 'ar' ? 'تم إضافة المنصب الفرعي بنجاح' : 'Subordinate position added successfully', 'success');
        window.StructureActions.renderAll();
      },

      addRootPositionModal: () => {
        const bodyHtml = `
          <div style="display:flex; flex-direction:column; gap:var(--space-4); direction:${lang === 'ar' ? 'rtl' : 'ltr'}; text-align:${lang === 'ar' ? 'right' : 'left'};">
            <div class="form-group">
              <label class="form-label">${lang === 'ar' ? 'المسمى الوظيفي للمنصب الرئيسي بالعربية' : 'Root Position Title (Arabic)'}</label>
              <input type="text" class="form-input" id="root-title-ar" placeholder="مثال: مجلس الإدارة...">
            </div>
            <div class="form-group">
              <label class="form-label">${lang === 'ar' ? 'المسمى الوظيفي للمنصب الرئيسي بالإنجليزية' : 'Root Position Title (English)'}</label>
              <input type="text" class="form-input" id="root-title-en" placeholder="e.g. Board of Directors...">
            </div>
          </div>
        `;
        
        const footerHtml = `
          <div style="display:flex; gap:var(--space-2); direction:${lang === 'ar' ? 'rtl' : 'ltr'};">
            <button class="btn btn-ghost" onclick="window.App.closeModal()">${t('close')}</button>
            <button class="btn btn-primary" onclick="window.StructureActions.saveRootNode()">${t('save')}</button>
          </div>
        `;
        
        window.App.showModal(t('addRootPosition'), bodyHtml, footerHtml);
      },

      saveRootNode: () => {
        const titleAr = document.getElementById('root-title-ar').value.trim();
        const titleEn = document.getElementById('root-title-en').value.trim();
        
        if (!titleAr || !titleEn) {
          window.App.showToast(lang === 'ar' ? 'يرجى ملء المسميات الوظيفية' : 'Please fill in job titles', 'error');
          return;
        }
        
        const newId = Date.now().toString();
        window.HRData.companyStructure.unshift({
          id: newId,
          titleAr,
          titleEn,
          employeeId: null,
          parentId: null
        });
        
        window.App.closeModal();
        window.App.showToast(lang === 'ar' ? 'تم إضافة المنصب الرئيسي بنجاح' : 'Root position added successfully', 'success');
        window.StructureActions.renderAll();
      },

      deletePosition: (id) => {
        const node = window.HRData.companyStructure.find(n => n.id === id);
        if (!node) return;
        
        const confirmMsg = lang === 'ar' 
          ? `هل أنت متأكد من حذف منصب "${node.titleAr}" وجميع المناصب التابعة له؟` 
          : `Are you sure you want to delete "${node.titleEn}" and all its subordinate positions?`;
          
        if (confirm(confirmMsg)) {
          // Recursive helper to retrieve all descendant IDs
          const getDescendants = (parentId) => {
            let desc = [];
            const children = window.HRData.companyStructure.filter(n => n.parentId === parentId);
            children.forEach(c => {
              desc.push(c.id);
              desc = desc.concat(getDescendants(c.id));
            });
            return desc;
          };
          
          const toDelete = [id].concat(getDescendants(id));
          window.HRData.companyStructure = window.HRData.companyStructure.filter(n => !toDelete.includes(n.id));
          
          window.App.closeModal();
          window.App.showToast(lang === 'ar' ? 'تم حذف المنصب بنجاح' : 'Position deleted successfully', 'success');
          window.StructureActions.renderAll();
        }
      }
    };
    
    window.StructureActions.renderAll();
  };
})();
