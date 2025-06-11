// Knowledge Base Sources
// This file contains pre-loaded knowledge that the AI can reference

const KNOWLEDGE_BASE = {
    // StoreHub Help Center Reference
    helpCenter: {
        url: "https://care.storehub.com/en/",
        sections: [
            "Getting Started - Set up your store, products, and POS system",
            "Point of Sale (POS) System - Transform your checkout process", 
            "BackOffice - Your central hub for business management",
            "Online Orders - Manage and process online orders",
            "Hardware & Set Up - Configure your POS equipment",
            "External Integrations - StoreHub ecosystem integrations",
            "Troubleshooting - Solutions for common problems",
            "Quick Help - Fast solutions for common issues"
        ]
    },
    
    // Excel Knowledge Base (to be populated with your Excel data)
    excelKnowledgeBase: {
        // You can add extracted Excel data here
        // Example structure:
        troubleshooting: [],
        productInfo: [],
        procedures: []
    }
};

// Function to load Excel file as knowledge base
async function loadExcelKnowledgeBase(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, {type:'buffer'});
        
        let knowledgeData = {};
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            knowledgeData[sheetName] = jsonData;
        });
        
        return knowledgeData;
    } catch (error) {
        console.error('Error loading Excel knowledge base:', error);
        return null;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
    window.loadExcelKnowledgeBase = loadExcelKnowledgeBase;
} 