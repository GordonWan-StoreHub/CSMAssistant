// Excel Knowledge Base Loader
// This script processes Excel files and converts them into searchable knowledge

class ExcelKnowledgeLoader {
    constructor() {
        this.knowledgeData = {
            troubleshooting: [],
            procedures: [],
            faq: [],
            productInfo: [],
            escalationPaths: []
        };
    }

    // Load Excel file and extract knowledge
    async loadExcelFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, {type: 'buffer'});
            
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                
                // Process different sheet types
                switch(sheetName.toLowerCase()) {
                    case 'troubleshooting':
                        this.processTroubleshootingSheet(jsonData);
                        break;
                    case 'procedures':
                        this.processProceduresSheet(jsonData);
                        break;
                    case 'faq':
                        this.processFAQSheet(jsonData);
                        break;
                    case 'products':
                        this.processProductSheet(jsonData);
                        break;
                    case 'escalation':
                        this.processEscalationSheet(jsonData);
                        break;
                    default:
                        this.processGenericSheet(sheetName, jsonData);
                }
            });
            
            return this.knowledgeData;
        } catch (error) {
            console.error('Error loading Excel knowledge:', error);
            return null;
        }
    }

    // Process troubleshooting sheet (columns: Problem, Solution, Category, Priority)
    processTroubleshootingSheet(data) {
        const headers = data[0];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 2) {
                this.knowledgeData.troubleshooting.push({
                    problem: row[0],
                    solution: row[1],
                    category: row[2] || 'General',
                    priority: row[3] || 'Medium',
                    source: 'Excel Knowledge Base'
                });
            }
        }
    }

    // Process procedures sheet (columns: Procedure, Steps, Department, Notes)
    processProceduresSheet(data) {
        const headers = data[0];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 2) {
                this.knowledgeData.procedures.push({
                    name: row[0],
                    steps: row[1],
                    department: row[2] || 'General',
                    notes: row[3] || '',
                    source: 'Excel Knowledge Base'
                });
            }
        }
    }

    // Process FAQ sheet (columns: Question, Answer, Category, Keywords)
    processFAQSheet(data) {
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 2) {
                this.knowledgeData.faq.push({
                    question: row[0],
                    answer: row[1],
                    category: row[2] || 'General',
                    keywords: row[3] || '',
                    source: 'Excel Knowledge Base'
                });
            }
        }
    }

    // Process product info sheet
    processProductSheet(data) {
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 2) {
                this.knowledgeData.productInfo.push({
                    product: row[0],
                    description: row[1],
                    features: row[2] || '',
                    limitations: row[3] || '',
                    source: 'Excel Knowledge Base'
                });
            }
        }
    }

    // Process escalation paths sheet
    processEscalationSheet(data) {
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length >= 3) {
                this.knowledgeData.escalationPaths.push({
                    issue: row[0],
                    level: row[1],
                    contact: row[2],
                    timeframe: row[3] || '',
                    source: 'Excel Knowledge Base'
                });
            }
        }
    }

    // Process generic sheets
    processGenericSheet(sheetName, data) {
        const sheetData = [];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length > 0) {
                sheetData.push({
                    data: row,
                    source: `Excel Knowledge Base - ${sheetName}`
                });
            }
        }
        this.knowledgeData[sheetName.toLowerCase()] = sheetData;
    }

    // Generate prompt context from knowledge data
    generateKnowledgeContext() {
        let context = "\n**EXCEL KNOWLEDGE BASE CONTENT:**\n";
        
        if (this.knowledgeData.troubleshooting.length > 0) {
            context += "\n**Troubleshooting Database:**\n";
            this.knowledgeData.troubleshooting.forEach(item => {
                context += `- Problem: ${item.problem}\n  Solution: ${item.solution}\n  Category: ${item.category}\n\n`;
            });
        }

        if (this.knowledgeData.faq.length > 0) {
            context += "\n**FAQ Database:**\n";
            this.knowledgeData.faq.forEach(item => {
                context += `- Q: ${item.question}\n  A: ${item.answer}\n\n`;
            });
        }

        if (this.knowledgeData.procedures.length > 0) {
            context += "\n**Procedures Database:**\n";
            this.knowledgeData.procedures.forEach(item => {
                context += `- ${item.name}: ${item.steps}\n\n`;
            });
        }

        return context;
    }

    // Search knowledge base
    searchKnowledge(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        // Search troubleshooting
        this.knowledgeData.troubleshooting.forEach(item => {
            if (item.problem.toLowerCase().includes(searchTerm) || 
                item.solution.toLowerCase().includes(searchTerm)) {
                results.push({...item, type: 'troubleshooting'});
            }
        });

        // Search FAQ
        this.knowledgeData.faq.forEach(item => {
            if (item.question.toLowerCase().includes(searchTerm) || 
                item.answer.toLowerCase().includes(searchTerm)) {
                results.push({...item, type: 'faq'});
            }
        });

        return results;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.ExcelKnowledgeLoader = ExcelKnowledgeLoader;
} 