// API Configuration
// Reads from VITE_API_URL environment variable
// Falls back to auto-detection: localhost in dev, backend domain in production
const envApiUrl = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;

// Handle empty string as "not set"
export const API_URL = (envApiUrl && envApiUrl.trim() !== '') 
  ? envApiUrl 
  : (isDevelopment 
      ? 'http://localhost:5000' 
      : 'https://backend.vikascateringservice.com');

// API Endpoints
export const API_ENDPOINTS = {
  login: `${API_URL}/api/login`,
  verify: `${API_URL}/api/verify`,
  upload: `${API_URL}/api/upload`,
  siteData: `${API_URL}/api/sitedata`,
  contact: `${API_URL}/api/contact`,
  contacts: `${API_URL}/api/contacts`,
  contactUpdate: (id: string) => `${API_URL}/api/contacts/${id}`,
  contactDelete: (id: string) => `${API_URL}/api/contacts/${id}`,
};

console.log('🔧 API Configuration:', {
  envApiUrl: envApiUrl || '(not set)',
  isDevelopment,
  API_URL,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  allEnv: import.meta.env,
  'API_ENDPOINTS.login': API_ENDPOINTS.login,
});
