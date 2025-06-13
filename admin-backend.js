// CSM Knowledge Base Admin Backend with Authentication and Template Management
class CSMKnowledgeAdmin {
    constructor() {
        // Initialize user authentication
        this.currentUser = JSON.parse(localStorage.getItem('csm-current-user') || 'null');
        this.users = JSON.parse(localStorage.getItem('csm-users') || '[]');
        
        // Initialize demo users if empty
        if (this.users.length === 0) {
            this.users = [
                { id: 'admin', username: 'admin', password: 'admin123', role: 'management', name: 'Admin User', created: new Date().toISOString() },
                { id: 'user', username: 'user', password: 'user123', role: 'normal', name: 'Normal User', created: new Date().toISOString() }
            ];
            this.saveUserData();
        }
        
        // Initialize knowledge base data
        this.websites = JSON.parse(localStorage.getItem('csm-websites') || '[]');
        this.files = JSON.parse(localStorage.getItem('csm-files') || '[]');
        this.templates = JSON.parse(localStorage.getItem('csm-templates') || '[]');
        this.content = JSON.parse(localStorage.getItem('csm-content') || '[]');
        this.settings = JSON.parse(localStorage.getItem('csm-settings') || '{}');
        
        // Initialize default StoreHub website if empty
        if (this.websites.length === 0) {
            this.websites = [{
                id: 'storehub-help',
                name: 'StoreHub Help Center',
                url: 'https://care.storehub.com/en/',
                category: 'help-center',
                priority: 'high',
                description: 'Official StoreHub support documentation with 8+ categories covering POS, BackOffice, and troubleshooting',
                status: 'active',
                lastUpdated: new Date().toISOString(),
                sections: [
                    'Getting Started (95 articles)',
                    'Point of Sale System (72 articles)',
                    'BackOffice (75 articles)',
                    'Online Orders (60 articles)',
                    'Hardware & Set Up (8 articles)',
                    'External Integrations (27 articles)',
                    'Troubleshooting (24 articles)',
                    'Quick Help (12 articles)'
                ]
            }];
            this.saveData();
        }
        
        // Initialize default templates if empty
        if (this.templates.length === 0) {
            this.templates = [
                {
                    id: 'troubleshooting-template',
                    name: 'Customer Issue Troubleshooting Template',
                    type: 'troubleshooting',
                    description: 'Standard template for documenting customer issues, symptoms, and solutions',
                    format: 'excel',
                    structure: {
                        columns: ['Date', 'Customer ID', 'Issue Type', 'Description', 'Symptoms', 'Solution', 'Status', 'Priority', 'Assigned To'],
                        example_data: [
                            ['2024-01-15', 'CUST001', 'Login Problem', 'Customer cannot access POS system', 'Error message on login screen', 'Reset password and clear cache', 'Resolved', 'High', 'Support Team']
                        ]
                    },
                    createdBy: 'admin',
                    createdAt: new Date().toISOString(),
                    version: '1.0'
                }
            ];
            this.saveData();
        }
        
        this.initializeEventListeners();
        this.updateUserInterface();
        this.renderWebsites();
        this.renderFiles();
        this.renderTemplates();
        this.updateContentOverview();
    }

    // User Authentication Methods
    saveUserData() {
        localStorage.setItem('csm-users', JSON.stringify(this.users));
        localStorage.setItem('csm-current-user', JSON.stringify(this.currentUser));
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveUserData();
            this.updateUserInterface();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.saveUserData();
        this.updateUserInterface();
    }

    hasPermission(action) {
        if (!this.currentUser) return false;
        
        switch (action) {
            case 'template-upload':
            case 'template-edit':
            case 'template-delete':
                return this.currentUser.role === 'management';
            case 'template-download':
                return true; // Both roles can download
            case 'content-edit':
            case 'website-add':
            case 'file-upload':
                return this.currentUser.role === 'management';
            default:
                return false;
        }
    }

    updateUserInterface() {
        const currentUserSpan = document.getElementById('current-user');
        const userRoleSpan = document.getElementById('user-role');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (this.currentUser) {
            currentUserSpan.textContent = this.currentUser.name;
            userRoleSpan.textContent = this.currentUser.role === 'management' ? 'Management User' : 'Normal User';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } else {
            currentUserSpan.textContent = 'Not logged in';
            userRoleSpan.textContent = 'No Role';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        }
        
        this.updatePermissions();
    }

    updatePermissions() {
        // Update template management buttons
        const uploadTemplateBtn = document.getElementById('upload-template-btn');
        const createTemplateBtn = document.getElementById('create-template-btn');
        const permissionNotice = document.getElementById('template-permission-notice');
        
        if (this.hasPermission('template-upload')) {
            uploadTemplateBtn.disabled = false;
            createTemplateBtn.disabled = false;
            permissionNotice.classList.add('hidden');
        } else {
            uploadTemplateBtn.disabled = true;
            createTemplateBtn.disabled = true;
            permissionNotice.classList.remove('hidden');
        }
        
        // Update other management buttons based on permissions
        const managementButtons = ['add-website-btn', 'upload-files-btn'];
        managementButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = !this.hasPermission('website-add');
            }
        });
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('csm-websites', JSON.stringify(this.websites));
        localStorage.setItem('csm-files', JSON.stringify(this.files));
        localStorage.setItem('csm-templates', JSON.stringify(this.templates));
        localStorage.setItem('csm-content', JSON.stringify(this.content));
        localStorage.setItem('csm-settings', JSON.stringify(this.settings));
    }

    // Initialize event listeners
    initializeEventListeners() {
        // User Authentication
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('close-login-modal').addEventListener('click', () => this.hideLoginModal());
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Website management
        document.getElementById('add-website-btn').addEventListener('click', () => this.showAddWebsiteForm());
        document.getElementById('save-website-btn').addEventListener('click', () => this.saveWebsite());
        document.getElementById('cancel-website-btn').addEventListener('click', () => this.hideAddWebsiteForm());
        document.getElementById('test-website-btn').addEventListener('click', () => this.testWebsiteConnection());

        // File management
        document.getElementById('upload-files-btn').addEventListener('click', () => document.getElementById('file-upload-input').click());
        document.getElementById('file-upload-zone').addEventListener('click', () => document.getElementById('file-upload-input').click());
        document.getElementById('file-upload-input').addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Template management
        document.getElementById('upload-template-btn').addEventListener('click', () => this.showUploadTemplateForm());
        document.getElementById('create-template-btn').addEventListener('click', () => this.showCreateTemplateForm());
        document.getElementById('save-template-btn').addEventListener('click', () => this.saveTemplate());
        document.getElementById('cancel-template-btn').addEventListener('click', () => this.hideUploadTemplateForm());
        document.getElementById('generate-template-btn').addEventListener('click', () => this.generateTemplate());
        document.getElementById('cancel-create-template-btn').addEventListener('click', () => this.hideCreateTemplateForm());
        
        // Drag and drop
        const dropZone = document.getElementById('file-upload-zone');
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-blue-500'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-blue-500'));
        dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('border-blue-500'); this.handleFileUpload(e); });

        // Content search and filter
        document.getElementById('content-search').addEventListener('input', () => this.filterContent());
        document.getElementById('content-source-filter').addEventListener('change', () => this.filterContent());
        document.getElementById('content-type-filter').addEventListener('change', () => this.filterContent());

        // Settings
        document.getElementById('backup-data-btn').addEventListener('click', () => this.backupData());
        document.getElementById('clear-cache-btn').addEventListener('click', () => this.clearCache());
        document.getElementById('reset-system-btn').addEventListener('click', () => this.resetSystem());
    }

    // Authentication UI Methods
    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
        document.getElementById('login-username').focus();
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('login-form').reset();
    }

    handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (this.login(username, password)) {
            this.hideLoginModal();
            alert(`Welcome, ${this.currentUser.name}!`);
        } else {
            alert('Invalid username or password. Please try again.');
        }
    }

    // Template Management Methods
    showUploadTemplateForm() {
        if (!this.hasPermission('template-upload')) {
            alert('You need management permissions to upload templates.');
            return;
        }
        document.getElementById('template-upload-form').classList.remove('hidden');
        document.getElementById('template-name').focus();
    }

    hideUploadTemplateForm() {
        document.getElementById('template-upload-form').classList.add('hidden');
        this.clearTemplateForm();
    }

    showCreateTemplateForm() {
        if (!this.hasPermission('template-upload')) {
            alert('You need management permissions to create templates.');
            return;
        }
        document.getElementById('template-create-form').classList.remove('hidden');
        document.getElementById('create-template-name').focus();
    }

    hideCreateTemplateForm() {
        document.getElementById('template-create-form').classList.add('hidden');
        this.clearCreateTemplateForm();
    }

    clearTemplateForm() {
        document.getElementById('template-name').value = '';
        document.getElementById('template-type').value = 'troubleshooting';
        document.getElementById('template-description').value = '';
        document.getElementById('template-file-input').value = '';
    }

    clearCreateTemplateForm() {
        document.getElementById('create-template-name').value = '';
        document.getElementById('create-template-format').value = 'excel';
        document.getElementById('create-template-structure').value = '';
    }

    async saveTemplate() {
        const name = document.getElementById('template-name').value.trim();
        const type = document.getElementById('template-type').value;
        const description = document.getElementById('template-description').value.trim();
        const fileInput = document.getElementById('template-file-input');

        if (!name || !description || !fileInput.files[0]) {
            alert('Please fill in all fields and select a template file.');
            return;
        }

        const file = fileInput.files[0];
        const template = {
            id: `template-${Date.now()}`,
            name,
            type,
            description,
            format: this.getFileFormat(file.name),
            fileName: file.name,
            fileSize: file.size,
            createdBy: this.currentUser.username,
            createdAt: new Date().toISOString(),
            version: '1.0',
            structure: await this.extractTemplateStructure(file)
        };

        // Store file content as base64 for demo purposes
        template.fileContent = await this.fileToBase64(file);

        this.templates.push(template);
        this.saveData();
        this.renderTemplates();
        this.hideUploadTemplateForm();
        alert('Template uploaded successfully!');
    }

    async generateTemplate() {
        const name = document.getElementById('create-template-name').value.trim();
        const format = document.getElementById('create-template-format').value;
        const structureText = document.getElementById('create-template-structure').value.trim();

        if (!name || !structureText) {
            alert('Please fill in template name and structure.');
            return;
        }

        try {
            const structure = JSON.parse(structureText);
            const template = {
                id: `template-${Date.now()}`,
                name,
                type: 'custom',
                description: `Auto-generated ${format} template`,
                format,
                createdBy: this.currentUser.username,
                createdAt: new Date().toISOString(),
                version: '1.0',
                structure,
                generated: true
            };

            // Generate actual file content based on format
            template.fileContent = await this.generateTemplateFile(template);

            this.templates.push(template);
            this.saveData();
            this.renderTemplates();
            this.hideCreateTemplateForm();
            alert('Template generated successfully!');
        } catch (error) {
            alert('Invalid JSON structure. Please check your template structure format.');
        }
    }

    async generateTemplateFile(template) {
        const { structure, format } = template;
        
        if (format === 'excel') {
            return this.generateExcelTemplate(structure);
        } else if (format === 'text') {
            return btoa(this.generateTextTemplate(structure));
        }
        
        return null;
    }

    generateExcelTemplate(structure) {
        // Create a simple CSV-like structure for demo
        let content = structure.columns.join(',') + '\n';
        if (structure.example_data) {
            structure.example_data.forEach(row => {
                content += row.join(',') + '\n';
            });
        }
        return btoa(content);
    }

    generateTextTemplate(structure) {
        let content = `Template Structure:\n\n`;
        content += `Columns: ${structure.columns.join(', ')}\n\n`;
        
        if (structure.example_data) {
            content += `Example Data:\n`;
            structure.example_data.forEach((row, index) => {
                content += `Row ${index + 1}: ${row.join(' | ')}\n`;
            });
        }
        
        return content;
    }

    getFileFormat(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const formatMap = {
            'xlsx': 'excel',
            'xls': 'excel',
            'docx': 'word',
            'doc': 'word',
            'pdf': 'pdf',
            'txt': 'text'
        };
        return formatMap[extension] || 'unknown';
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    async extractTemplateStructure(file) {
        // For demo purposes, return a basic structure
        // In production, you would parse the actual file
        return {
            columns: ['Field1', 'Field2', 'Field3'],
            rows: 1,
            fileType: this.getFileFormat(file.name)
        };
    }

    downloadTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        if (!template.fileContent) {
            alert('Template file content not available.');
            return;
        }

        const blob = new Blob([atob(template.fileContent)], { 
            type: this.getMimeType(template.format) 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = template.fileName || `${template.name}.${this.getFileExtension(template.format)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getMimeType(format) {
        const mimeTypes = {
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'pdf': 'application/pdf',
            'text': 'text/plain'
        };
        return mimeTypes[format] || 'application/octet-stream';
    }

    getFileExtension(format) {
        const extensions = {
            'excel': 'xlsx',
            'word': 'docx',
            'pdf': 'pdf',
            'text': 'txt'
        };
        return extensions[format] || 'file';
    }

    deleteTemplate(templateId) {
        if (!this.hasPermission('template-delete')) {
            alert('You need management permissions to delete templates.');
            return;
        }

        if (confirm('Are you sure you want to delete this template?')) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.saveData();
            this.renderTemplates();
        }
    }

    renderTemplates() {
        const container = document.getElementById('templates-list');
        container.innerHTML = '';

        if (this.templates.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No templates uploaded yet.</p>';
            return;
        }

        this.templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
            
            const canEdit = this.hasPermission('template-edit');
            const canDelete = this.hasPermission('template-delete');

            templateCard.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-900">${template.name}</h3>
                        <div class="flex items-center space-x-4 mt-1">
                            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">${template.type}</span>
                            <span class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">${template.format}</span>
                            <span class="text-xs text-gray-500">v${template.version}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="admin.downloadTemplate('${template.id}')" class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-300 rounded">
                            📥 Download
                        </button>
                        ${canEdit ? `<button onclick="admin.editTemplate('${template.id}')" class="text-yellow-600 hover:text-yellow-800 px-3 py-1 text-sm border border-yellow-300 rounded">Edit</button>` : ''}
                        ${canDelete ? `<button onclick="admin.deleteTemplate('${template.id}')" class="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-300 rounded">Delete</button>` : ''}
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-3">${template.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Created by: ${template.createdBy}</span>
                    <span>Created: ${new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
            `;
            
            container.appendChild(templateCard);
        });
    }

    // Tab switching
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('tab-active');
            btn.classList.add('tab-inactive');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('tab-active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.remove('tab-inactive');

        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');

        // Update content when switching to content tab
        if (tabName === 'content') {
            this.updateContentTable();
        } else if (tabName === 'templates') {
            this.renderTemplates();
        }
    }

    // Website Management (keeping existing functionality)
    showAddWebsiteForm() {
        if (!this.hasPermission('website-add')) {
            alert('You need management permissions to add websites.');
            return;
        }
        document.getElementById('add-website-form').classList.remove('hidden');
        document.getElementById('website-name').focus();
    }

    hideAddWebsiteForm() {
        document.getElementById('add-website-form').classList.add('hidden');
        this.clearWebsiteForm();
    }

    clearWebsiteForm() {
        document.getElementById('website-name').value = '';
        document.getElementById('website-url').value = '';
        document.getElementById('website-category').value = 'help-center';
        document.getElementById('website-priority').value = 'medium';
        document.getElementById('website-description').value = '';
    }

    async testWebsiteConnection() {
        const url = document.getElementById('website-url').value.trim();
        if (!url) {
            alert('Please enter a website URL first.');
            return;
        }

        const testBtn = document.getElementById('test-website-btn');
        testBtn.textContent = 'Testing...';
        testBtn.disabled = true;

        try {
            // Simple connectivity test - in a real backend, you'd do proper scraping
            const response = await fetch(url, { mode: 'no-cors' });
            alert('✅ Website connection test passed! URL appears to be accessible.');
        } catch (error) {
            alert('⚠️ Website connection test: Unable to verify connectivity. The URL may still work for content extraction.');
        } finally {
            testBtn.textContent = 'Test Connection';
            testBtn.disabled = false;
        }
    }

    saveWebsite() {
        const name = document.getElementById('website-name').value.trim();
        const url = document.getElementById('website-url').value.trim();
        const category = document.getElementById('website-category').value;
        const priority = document.getElementById('website-priority').value;
        const description = document.getElementById('website-description').value.trim();

        if (!name || !url) {
            alert('Please fill in both name and URL fields.');
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            alert('Please enter a valid URL.');
            return;
        }

        const website = {
            id: `website-${Date.now()}`,
            name,
            url,
            category,
            priority,
            description,
            status: 'active',
            lastUpdated: new Date().toISOString(),
            sections: []
        };

        this.websites.push(website);
        this.saveData();
        this.renderWebsites();
        this.hideAddWebsiteForm();
        this.updateContentOverview();

        this.extractWebsiteContent(website);
    }

    async extractWebsiteContent(website) {
        const contentItems = [
            { type: 'page', title: 'Homepage', url: website.url, content: 'Main landing page content...' },
            { type: 'article', title: 'Getting Started Guide', url: website.url + '/getting-started', content: 'Setup instructions...' },
            { type: 'faq', title: 'Frequently Asked Questions', url: website.url + '/faq', content: 'Common questions and answers...' }
        ];

        contentItems.forEach(item => {
            this.content.push({
                id: `content-${Date.now()}-${Math.random()}`,
                source: website.name,
                sourceType: 'website',
                type: item.type,
                title: item.title,
                url: item.url,
                content: item.content,
                lastUpdated: new Date().toISOString()
            });
        });

        this.saveData();
        this.updateContentOverview();
    }

    deleteWebsite(websiteId) {
        if (!this.hasPermission('website-add')) {
            alert('You need management permissions to delete websites.');
            return;
        }
        if (confirm('Are you sure you want to delete this website source?')) {
            this.websites = this.websites.filter(w => w.id !== websiteId);
            this.content = this.content.filter(c => c.sourceId !== websiteId);
            this.saveData();
            this.renderWebsites();
            this.updateContentOverview();
        }
    }

    renderWebsites() {
        const container = document.getElementById('websites-list');
        container.innerHTML = '';

        if (this.websites.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No websites configured yet.</p>';
            return;
        }

        this.websites.forEach(website => {
            const websiteCard = document.createElement('div');
            websiteCard.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
            
            const canDelete = this.hasPermission('website-add');

            websiteCard.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-900">${website.name}</h3>
                        <div class="flex items-center space-x-4 mt-1">
                            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">${website.category}</span>
                            <span class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">${website.priority}</span>
                            <span class="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded">${website.status}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <a href="${website.url}" target="_blank" class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-300 rounded">Visit</a>
                        ${canDelete ? `<button onclick="admin.deleteWebsite('${website.id}')" class="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-300 rounded">Delete</button>` : ''}
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-3">${website.description}</p>
                <div class="text-xs text-gray-500">
                    Last Updated: ${new Date(website.lastUpdated).toLocaleDateString()}
                </div>
            `;
            
            container.appendChild(websiteCard);
        });
    }

    // File handling methods
    async handleFileUpload(event) {
        if (!this.hasPermission('file-upload')) {
            alert('You need management permissions to upload files.');
            return;
        }

        const files = event.target?.files || event.dataTransfer?.files;
        if (!files || files.length === 0) return;

        this.showLoadingModal('Processing files...');

        for (const file of files) {
            await this.processFile(file);
        }

        this.hideLoadingModal();
        this.renderFiles();
        this.updateContentOverview();
    }

    async processFile(file) {
        const fileObj = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            format: this.getFileFormat(file.name),
            uploadedAt: new Date().toISOString(),
            uploadedBy: this.currentUser?.username || 'anonymous',
            status: 'processing'
        };

        this.files.push(fileObj);

        try {
            let extractedContent = '';
            
            if (file.type.includes('pdf')) {
                extractedContent = await this.extractPDFContent(file);
            } else if (file.type.includes('sheet') || file.type.includes('excel')) {
                extractedContent = await this.extractExcelContent(file);
            } else if (file.type.includes('text')) {
                extractedContent = await this.extractTextContent(file);
            }

            if (extractedContent) {
                this.content.push({
                    id: `content-${Date.now()}-${Math.random()}`,
                    source: file.name,
                    sourceType: 'file',
                    type: fileObj.format,
                    title: file.name,
                    content: extractedContent,
                    fileId: fileObj.id,
                    lastUpdated: new Date().toISOString()
                });
            }

            fileObj.status = 'completed';
            fileObj.contentExtracted = extractedContent.length;

        } catch (error) {
            fileObj.status = 'error';
            fileObj.error = error.message;
        }

        this.saveData();
    }

    async extractPDFContent(file) {
        return `PDF Content from ${file.name}: This would contain the extracted text from the PDF file...`;
    }

    async extractExcelContent(file) {
        return `Excel Content from ${file.name}: This would contain the structured data from the Excel file...`;
    }

    async extractTextContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    deleteFile(fileId) {
        if (!this.hasPermission('file-upload')) {
            alert('You need management permissions to delete files.');
            return;
        }
        if (confirm('Are you sure you want to delete this file?')) {
            this.files = this.files.filter(f => f.id !== fileId);
            this.content = this.content.filter(c => c.fileId !== fileId);
            this.saveData();
            this.renderFiles();
            this.updateContentOverview();
        }
    }

    renderFiles() {
        const container = document.getElementById('files-list');
        container.innerHTML = '';

        if (this.files.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No files uploaded yet.</p>';
            return;
        }

        this.files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
            
            const canDelete = this.hasPermission('file-upload');
            const statusColor = file.status === 'completed' ? 'green' : file.status === 'error' ? 'red' : 'yellow';

            fileCard.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-900">${file.name}</h3>
                        <div class="flex items-center space-x-4 mt-1">
                            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">${file.format}</span>
                            <span class="text-sm px-2 py-1 bg-${statusColor}-100 text-${statusColor}-800 rounded">${file.status}</span>
                            <span class="text-xs text-gray-500">${(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        ${canDelete ? `<button onclick="admin.deleteFile('${file.id}')" class="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-300 rounded">Delete</button>` : ''}
                    </div>
                </div>
                <div class="text-xs text-gray-500">
                    Uploaded: ${new Date(file.uploadedAt).toLocaleDateString()} by ${file.uploadedBy}
                    ${file.contentExtracted ? ` • Content: ${file.contentExtracted} characters` : ''}
                </div>
            `;
            
            container.appendChild(fileCard);
        });
    }

    updateContentOverview() {
        document.getElementById('total-sources').textContent = this.websites.length + this.files.length;
        document.getElementById('active-websites').textContent = this.websites.filter(w => w.status === 'active').length;
        document.getElementById('uploaded-files').textContent = this.files.length;
        document.getElementById('content-entries').textContent = this.content.length;
    }

    updateContentTable() {
        const tbody = document.getElementById('content-table-body');
        tbody.innerHTML = '';

        this.content.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border border-gray-300 px-4 py-2">${item.source}</td>
                <td class="border border-gray-300 px-4 py-2">${item.sourceType}</td>
                <td class="border border-gray-300 px-4 py-2">${item.content.substring(0, 100)}...</td>
                <td class="border border-gray-300 px-4 py-2">${new Date(item.lastUpdated).toLocaleDateString()}</td>
                <td class="border border-gray-300 px-4 py-2">
                    <button class="text-blue-600 hover:text-blue-800 text-sm">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterContent() {
        this.updateContentTable();
    }

    showLoadingModal(text) {
        document.getElementById('loading-text').textContent = text;
        document.getElementById('loading-modal').classList.remove('hidden');
        document.getElementById('loading-modal').classList.add('flex');
    }

    hideLoadingModal() {
        document.getElementById('loading-modal').classList.add('hidden');
        document.getElementById('loading-modal').classList.remove('flex');
    }

    backupData() {
        const data = {
            websites: this.websites,
            files: this.files,
            templates: this.templates,
            content: this.content,
            settings: this.settings,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `csm-knowledge-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearCache() {
        if (confirm('This will clear all cached content. Are you sure?')) {
            this.content = [];
            this.saveData();
            this.updateContentOverview();
            this.updateContentTable();
            alert('Cache cleared successfully.');
        }
    }

    resetSystem() {
        if (confirm('This will reset the entire system. This action cannot be undone. Are you sure?')) {
            localStorage.clear();
            location.reload();
        }
    }

    // Method to get templates for AI processing
    getTemplatesForAI() {
        return this.templates.map(template => ({
            id: template.id,
            name: template.name,
            type: template.type,
            structure: template.structure,
            description: template.description
        }));
    }
}

// Initialize the admin system
const admin = new CSMKnowledgeAdmin(); 