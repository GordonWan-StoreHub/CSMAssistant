# CSM Knowledge Assistant

A powerful AI-powered Customer Success Management (CSM) assistant built for StoreHub. This tool helps CSMs quickly analyze merchant problems and provide comprehensive solutions by leveraging the Gemini AI model and various file formats.

## Features

- **Multi-format File Analysis**: Supports images, videos, PDFs, and Excel files
- **Voice Input**: Speech-to-text functionality for quick problem description
- **Text-to-Speech**: Audio playback of solutions
- **Dual Output Format**: 
  - Customer-facing solutions (ready to copy-paste)
  - Internal CSM explanations with troubleshooting details
- **Knowledge Base Integration**: References StoreHub Help Center and uploaded files
- **Modern UI**: Clean, responsive interface with StoreHub branding

## Supported File Types

- **Images**: JPG, PNG, GIF, WebP (up to 10 files)
- **Videos**: MP4, AVI, MOV (up to 5 files)
- **PDFs**: Document analysis and text extraction (up to 5 files)
- **Excel**: .xls, .xlsx with full sheet analysis (up to 5 files)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/GordonWan-StoreHub/CSM.git
cd CSM
```

### 2. Configure API Key
1. Copy the example configuration:
   ```bash
   cp env.example .env
   ```
2. Edit `config.js` and add your Google Gemini API key:
   ```javascript
   GEMINI_API_KEY: "your_actual_api_key_here"
   ```

### 3. Start the Server
```bash
python3 -m http.server 3000
```

### 4. Access the Application
Open your browser and navigate to: `http://localhost:3000/index.html`

## Usage

1. **Describe the Problem**: Type or speak the merchant's issue
2. **Upload Files**: Drag & drop relevant files (screenshots, documents, etc.)
3. **Get Solution**: Click "Get Solution" to receive AI-powered analysis
4. **Review Output**: 
   - Copy merchant-facing solution for direct communication
   - Use CSM notes for internal understanding and escalation

## Knowledge Sources

The assistant references:
- **StoreHub Help Center** (https://care.storehub.com/en/)
  - Getting Started (95 articles)
  - Point of Sale System (71 articles) 
  - BackOffice (75 articles)
  - Online Orders (60 articles)
  - Hardware & Set Up (8 articles)
  - External Integrations (27 articles)
  - Troubleshooting (24 articles)
  - Quick Help (12 articles)
- **Uploaded Excel Files**: Treated as authoritative internal knowledge
- **Visual Content**: Screenshots and images for context

## Technical Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **AI Model**: Google Gemini 2.5 Flash Preview
- **File Processing**: 
  - PDF.js for PDF text extraction
  - SheetJS (XLSX) for Excel processing
  - HTML5 FileReader for image handling
- **Speech**: Web Speech API for voice input/output

## File Structure

```
CSM/
├── index.html          # Main application
├── config.js           # API configuration (add your key here)
├── knowledge-base.js   # Knowledge sources and references
├── env.example         # Example environment configuration
├── .gitignore         # Git ignore rules
├── test.html          # Server test page
└── README.md          # This file
```

## Security Notes

- Keep your `config.js` file secure and never commit API keys
- The `.gitignore` file excludes sensitive configuration files
- Use environment variables in production deployments

## Browser Compatibility

- Chrome/Edge: Full feature support
- Firefox: Full feature support  
- Safari: Full feature support
- Mobile browsers: Responsive design with touch support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to StoreHub. Internal use only.

## Support

For technical issues or feature requests, contact the StoreHub development team. 