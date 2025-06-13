# CSM Knowledge Base Admin Guide

## 🎯 **Overview**

The CSM Knowledge Base Admin Panel allows your internal team to easily manage multiple knowledge sources for the CSM Assistant. Instead of manual file uploads, you can now:

- **Add multiple websites** as knowledge sources
- **Upload and manage files** (PDF, Excel, Word) systematically  
- **Organize content** with categories and priorities
- **Monitor usage** and update sources conveniently

## 🚀 **Getting Started**

### Access the Admin Panel
1. **URL**: `http://localhost:3000/admin-panel.html`
2. **Default Setup**: StoreHub Help Center is pre-configured
3. **Integration**: Changes automatically sync with the main CSM Assistant

## 📋 **Admin Panel Features**

### **🌐 Website Sources Tab**
Manage multiple websites as knowledge sources:

#### Adding a Website
1. Click **"+ Add Website"**
2. Fill in details:
   - **Name**: e.g., "StoreHub Help Center"
   - **URL**: Full website URL
   - **Category**: help-center, documentation, knowledge-base, faq, support
   - **Priority**: High, Medium, Low
   - **Description**: Brief explanation of the source
3. **Test Connection** to verify accessibility
4. **Save** to add to knowledge base

#### Default Website Sources
- **StoreHub Help Center** (https://care.storehub.com/en/)
  - 95 Getting Started articles
  - 72 POS System articles  
  - 75 BackOffice articles
  - 60 Online Orders articles
  - 27 External Integrations articles
  - 24 Troubleshooting articles
  - 12 Quick Help articles

### **📁 File Sources Tab**
Upload and manage files systematically:

#### Supported File Types
- **PDF**: Automatic text extraction
- **Excel (.xls, .xlsx)**: Sheet-by-sheet processing
- **Word (.doc, .docx)**: Document content extraction
- **Text (.txt)**: Direct content processing

#### File Upload Process
1. **Drag & drop** files into the upload zone, or
2. **Click to browse** and select files
3. **Automatic processing**: Content extraction and indexing
4. **Status tracking**: Monitor processing success/errors

#### File Organization
- **Automatic categorization** by file type
- **Content type detection** (document, structured-data, text)
- **Processing status** monitoring
- **Preview capabilities** for uploaded content

### **📝 Content Management Tab**
Monitor and organize all knowledge sources:

#### Content Overview
- **Total Sources**: Combined websites and files
- **Active Websites**: Currently enabled website sources
- **Uploaded Files**: Successfully processed files
- **Content Entries**: Total indexed content pieces

#### Search & Filter
- **Search content** across all sources
- **Filter by source** (specific website or file)
- **Filter by type** (website, PDF, Excel, Word)

#### Content Table
- **Source identification**
- **Content type** with visual indicators
- **Content preview** (first 100 characters)
- **Last updated** timestamps
- **Edit/Delete** actions for content management

### **⚙️ Settings Tab**
Configure system behavior:

#### API Configuration
- **Content Refresh Interval**: How often to update website content
- **Max File Size**: Upload limit for files

#### Knowledge Base Settings
- **Auto-update content**: Automatically refresh website sources
- **Content versioning**: Track changes over time
- **Duplicate detection**: Merge similar content automatically

#### Data Management
- **Backup Data**: Export complete knowledge base
- **Clear Cache**: Reset processed content
- **Reset System**: Complete system reset (use carefully!)

## 🔄 **Integration with Main CSM Assistant**

### Automatic Sync
- **Real-time updates**: Changes in admin panel immediately available
- **Knowledge base status**: Main interface shows current source counts
- **Refresh capability**: Manual refresh button for immediate updates

### AI Enhancement
The AI assistant now references:
1. **Website sources** (with priority weighting)
2. **Uploaded file content** (treated as authoritative)
3. **Per-query files** (uploaded during conversations)
4. **Combined knowledge context** for comprehensive responses

## 📊 **Best Practices**

### Website Management
1. **Start with high-priority sources** (official documentation)
2. **Use descriptive names** for easy identification
3. **Regular testing** of website connectivity
4. **Categorize appropriately** for better organization

### File Management
1. **Structure Excel files** with clear sheet names:
   - "Troubleshooting" (Problem, Solution, Category, Priority)
   - "FAQ" (Question, Answer, Category, Keywords)
   - "Procedures" (Procedure, Steps, Department, Notes)
   - "Escalation" (Issue, Level, Contact, Timeframe)

2. **Use clear file names** that describe content
3. **Regular cleanup** of outdated files
4. **Monitor processing status** for errors

### Content Organization
1. **Regular content audits** to remove duplicates
2. **Update descriptions** for better searchability
3. **Monitor usage patterns** through the content table
4. **Backup regularly** using export functionality

## 🛠️ **Troubleshooting**

### Common Issues
1. **Website not accessible**: Check URL format and connectivity
2. **File processing errors**: Verify file format and size limits
3. **Content not appearing**: Use refresh button to sync changes
4. **Duplicate content**: Enable duplicate detection in settings

### Support Actions
1. **Export configuration** for backup/sharing
2. **Clear cache** if content seems outdated
3. **Check browser console** for technical errors
4. **Use test connections** to verify website accessibility

## 🎯 **Next Steps**

1. **Add your organization's knowledge sources**
2. **Upload standard CSM documentation**
3. **Test with sample queries** in the main assistant
4. **Train team members** on admin panel usage
5. **Establish content update schedules**

Your CSM team now has a powerful, centralized knowledge management system that makes the AI assistant much more effective and accurate! 🚀 