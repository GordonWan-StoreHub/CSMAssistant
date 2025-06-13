// Knowledge Base API Bridge
// This connects the admin-managed knowledge base to the main CSM Assistant

class KnowledgeAPI {
    constructor() {
        this.knowledgeBase = this.loadKnowledgeBase();
        this.lastRefresh = localStorage.getItem('csm-knowledge-last-refresh');
        
        // Auto-refresh every hour
        setInterval(() => this.refreshKnowledgeBase(), 60 * 60 * 1000);
    }

    // Load knowledge base from admin panel data
    loadKnowledgeBase() {
        try {
            const websites = JSON.parse(localStorage.getItem('csm-websites') || '[]');
            const files = JSON.parse(localStorage.getItem('csm-files') || '[]');
            const content = JSON.parse(localStorage.getItem('csm-content') || '[]');
            
            return {
                websites: websites.filter(w => w.status === 'active'),
                files: files.filter(f => f.status === 'processed'),
                content: content,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error loading knowledge base:', error);
            return { websites: [], files: [], content: [], lastUpdated: new Date().toISOString() };
        }
    }

    // Refresh knowledge base
    refreshKnowledgeBase() {
        this.knowledgeBase = this.loadKnowledgeBase();
        localStorage.setItem('csm-knowledge-last-refresh', new Date().toISOString());
        console.log('Knowledge base refreshed');
    }

    // Get all website sources for AI prompt
    getWebsiteSources() {
        return this.knowledgeBase.websites.map(website => ({
            name: website.name,
            url: website.url,
            description: website.description,
            sections: website.sections || [],
            priority: website.priority
        }));
    }

    // Get all file sources for AI prompt
    getFileSources() {
        return this.knowledgeBase.files.map(file => ({
            name: file.name,
            type: file.type,
            contentType: file.contentType,
            uploadDate: file.uploadDate
        }));
    }

    // Get content by source
    getContentBySource(sourceName) {
        return this.knowledgeBase.content.filter(item => item.source === sourceName);
    }

    // Search content
    searchContent(query) {
        const searchTerm = query.toLowerCase();
        return this.knowledgeBase.content.filter(item => 
            item.title?.toLowerCase().includes(searchTerm) ||
            item.content?.toLowerCase().includes(searchTerm) ||
            item.source?.toLowerCase().includes(searchTerm)
        );
    }

    // Generate comprehensive knowledge context for AI
    generateKnowledgeContext() {
        let context = "\n**KNOWLEDGE BASE SOURCES:**\n";
        
        // Website sources
        if (this.knowledgeBase.websites.length > 0) {
            context += "\n**WEBSITE SOURCES:**\n";
            this.knowledgeBase.websites.forEach(website => {
                context += `- **${website.name}** (${website.url})\n`;
                context += `  Description: ${website.description}\n`;
                context += `  Priority: ${website.priority.toUpperCase()}\n`;
                if (website.sections && website.sections.length > 0) {
                    context += `  Sections: ${website.sections.join(', ')}\n`;
                }
                context += `\n`;
            });
        }

        // File sources
        if (this.knowledgeBase.files.length > 0) {
            context += "\n**UPLOADED FILE SOURCES:**\n";
            this.knowledgeBase.files.forEach(file => {
                context += `- **${file.name}** (${file.type.toUpperCase()})\n`;
                context += `  Content Type: ${file.contentType}\n`;
                context += `  Status: Official internal knowledge\n\n`;
            });
        }

        // Template sources for AI guidance
        const templates = this.getAvailableTemplates();
        if (templates.length > 0) {
            context += "\n**AVAILABLE TEMPLATES FOR FILE INTERPRETATION:**\n";
            templates.forEach(template => {
                context += `- **${template.name}** (${template.type})\n`;
                context += `  Description: ${template.description}\n`;
                if (template.structure && template.structure.columns) {
                    context += `  Expected columns: ${template.structure.columns.join(', ')}\n`;
                }
                context += `\n`;
            });
            context += "**IMPORTANT:** Use these templates to better understand and interpret uploaded files. If a file matches a template structure, apply the template's logic for analysis.\n\n";
        }

        // Recent content updates
        const recentContent = this.knowledgeBase.content
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .slice(0, 10);

        if (recentContent.length > 0) {
            context += "\n**RECENT KNOWLEDGE UPDATES:**\n";
            recentContent.forEach(item => {
                context += `- ${item.source}: ${item.title}\n`;
            });
            context += `\n`;
        }

        context += `\n**KNOWLEDGE BASE STATS:**\n`;
        context += `- Total Websites: ${this.knowledgeBase.websites.length}\n`;
        context += `- Total Files: ${this.knowledgeBase.files.length}\n`;
        context += `- Total Templates: ${templates.length}\n`;
        context += `- Total Content Entries: ${this.knowledgeBase.content.length}\n`;
        context += `- Last Updated: ${new Date(this.knowledgeBase.lastUpdated).toLocaleString()}\n`;

        return context;
    }

    // Get specific content for file processing
    getFileContent(fileName) {
        const fileContentItems = this.knowledgeBase.content.filter(item => 
            item.source === fileName && item.type === 'file'
        );
        
        if (fileContentItems.length > 0) {
            return fileContentItems.map(item => ({
                text: `--- Content from ${fileName} ---\n${item.content}\n--- End of ${fileName} Content ---\n`
            }));
        }
        
        return null;
    }

    // Get website-specific guidance
    getWebsiteGuidance() {
        const websiteGuidance = this.knowledgeBase.websites.map(website => {
            let guidance = `**${website.name}** (${website.url}):\n`;
            guidance += `${website.description}\n`;
            
            if (website.sections && website.sections.length > 0) {
                guidance += `Available sections: ${website.sections.join(', ')}\n`;
            }
            
            return guidance;
        }).join('\n');

        return websiteGuidance;
    }

    // Check if admin panel is configured
    hasAdminConfiguration() {
        return this.knowledgeBase.websites.length > 0 || this.knowledgeBase.files.length > 0;
    }

    // Get admin panel URL
    getAdminPanelUrl() {
        return `${window.location.origin}/admin-panel.html`;
    }

    // Get available templates from admin system
    getAvailableTemplates() {
        try {
            const templates = JSON.parse(localStorage.getItem('csm-templates') || '[]');
            return templates.map(template => ({
                id: template.id,
                name: template.name,
                type: template.type,
                description: template.description,
                structure: template.structure
            }));
        } catch (error) {
            console.error('Error loading templates:', error);
            return [];
        }
    }

    // Enhanced file content analysis using templates
    analyzeFileWithTemplates(fileName, fileContent) {
        const templates = this.getAvailableTemplates();
        let analysis = { matchedTemplate: null, structuredData: null, interpretation: '' };
        
        // Try to match file content with available templates
        for (const template of templates) {
            if (this.doesFileMatchTemplate(fileName, fileContent, template)) {
                analysis.matchedTemplate = template;
                analysis.structuredData = this.extractStructuredData(fileContent, template);
                analysis.interpretation = this.generateTemplateInterpretation(analysis.structuredData, template);
                break;
            }
        }
        
        return analysis;
    }

    // Check if file matches a template pattern
    doesFileMatchTemplate(fileName, content, template) {
        const fileFormat = this.getFileFormat(fileName);
        
        // Basic format matching
        if (template.format && template.format !== fileFormat) {
            return false;
        }
        
        // Check if content contains expected columns
        if (template.structure && template.structure.columns) {
            const contentLower = content.toLowerCase();
            const matchedColumns = template.structure.columns.filter(col => 
                contentLower.includes(col.toLowerCase())
            );
            
            // Consider it a match if at least 60% of columns are found
            return matchedColumns.length >= (template.structure.columns.length * 0.6);
        }
        
        return false;
    }

    // Extract structured data based on template
    extractStructuredData(content, template) {
        if (!template.structure || !template.structure.columns) {
            return null;
        }
        
        // Simple CSV-like parsing for demo
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0] ? lines[0].split(',').map(h => h.trim()) : [];
        const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
        
        return {
            headers,
            rows,
            totalRows: rows.length,
            matchedColumns: template.structure.columns.filter(col => 
                headers.some(h => h.toLowerCase().includes(col.toLowerCase()))
            )
        };
    }

    // Generate interpretation based on template
    generateTemplateInterpretation(structuredData, template) {
        if (!structuredData) {
            return `File appears to match ${template.name} but structure could not be parsed.`;
        }
        
        let interpretation = `File matches "${template.name}" template.\n`;
        interpretation += `Found ${structuredData.totalRows} data rows with ${structuredData.headers.length} columns.\n`;
        
        if (structuredData.matchedColumns.length > 0) {
            interpretation += `Matched template columns: ${structuredData.matchedColumns.join(', ')}\n`;
        }
        
        // Add template-specific insights
        switch (template.type) {
            case 'troubleshooting':
                interpretation += 'This appears to be a troubleshooting log. Look for issue patterns, resolution status, and priority levels.';
                break;
            case 'faq':
                interpretation += 'This appears to be an FAQ document. Focus on question-answer pairs and categorization.';
                break;
            case 'procedures':
                interpretation += 'This appears to be a procedures document. Look for step-by-step processes and guidelines.';
                break;
            default:
                interpretation += `This is a ${template.type} document. Analyze according to its structure and purpose.`;
        }
        
        return interpretation;
    }

    getFileFormat(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const formatMap = {
            'xlsx': 'excel',
            'xls': 'excel',
            'docx': 'word',
            'doc': 'word',
            'pdf': 'pdf',
            'txt': 'text',
            'csv': 'excel'
        };
        return formatMap[extension] || 'unknown';
    }

    // Export knowledge for backup
    exportKnowledge() {
        return {
            ...this.knowledgeBase,
            templates: this.getAvailableTemplates(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }
}

// Initialize Knowledge API
const knowledgeAPI = new KnowledgeAPI();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.knowledgeAPI = knowledgeAPI;
} 