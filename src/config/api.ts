// API Configuration
// In production (Render), use same domain (empty string for relative URLs)
// In development, use localhost backend
const isProduction = import.meta.env.MODE === 'production';
export const API_URL = isProduction ? '' : 'http://localhost:5000';

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
  mode: import.meta.env.MODE,
  isProduction,
  API_URL: API_URL || '(same domain - relative URLs)',
  'API_ENDPOINTS.login': API_ENDPOINTS.login,
  allEnv: import.meta.env
});
