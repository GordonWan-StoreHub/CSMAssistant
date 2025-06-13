// API Configuration
// IMPORTANT: Add your actual API key here and keep this file secure
const CONFIG = {
    GEMINI_API_KEY: "AIzaSyCMRdy7e1kv0VbxQwGnW137XR2RNuV8lW0", // Replace with your actual API key
    API_BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
    MODEL_NAME: "gemini-2.5-flash-preview-05-20"
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
} 