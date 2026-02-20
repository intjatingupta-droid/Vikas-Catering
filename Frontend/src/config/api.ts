// API Configuration
// Auto-detects environment and sets appropriate API URL
const envApiUrl = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;
const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

// Determine API URL based on environment
function getApiUrl(): string {
  // 1. If VITE_API_URL is explicitly set, use it
  if (envApiUrl && envApiUrl.trim() !== '') {
    return envApiUrl;
  }

  // 2. Auto-detect based on hostname
  if (isDevelopment || currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
    // Local development - API is at /api path
    return 'http://localhost:5001/api';
  } else if (currentHostname === 'vikascateringservice.com' || currentHostname === 'www.vikascateringservice.com') {
    // Production on main domain - API is at /api path
    return `${window.location.protocol}//${window.location.host}/api`;
  } else {
    // Fallback for other domains (Vercel preview, etc.)
    return 'https://vikascateringservice.com/api';
  }
}

export const API_URL = getApiUrl();

// API Endpoints
export const API_ENDPOINTS = {
  login: `${API_URL}/login`,
  verify: `${API_URL}/verify`,
  upload: `${API_URL}/upload`,
  siteData: `${API_URL}/sitedata`,
  contact: `${API_URL}/contact`,
  contacts: `${API_URL}/contacts`,
  contactUpdate: (id: string) => `${API_URL}/contacts/${id}`,
  contactDelete: (id: string) => `${API_URL}/contacts/${id}`,
};

console.log('🔧 API Configuration:', {
  hostname: currentHostname,
  envApiUrl: envApiUrl || '(not set)',
  isDevelopment,
  API_URL,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  'API_ENDPOINTS.login': API_ENDPOINTS.login,
  'API_ENDPOINTS.siteData': API_ENDPOINTS.siteData,
});
