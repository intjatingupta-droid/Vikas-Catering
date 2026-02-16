// API Configuration
// Production: Use Render backend URL
// Development: Use localhost backend
const isDevelopment = import.meta.env.DEV;
export const API_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : 'https://vikas-catering.onrender.com';

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
  isDevelopment,
  API_URL,
  'API_ENDPOINTS.login': API_ENDPOINTS.login,
});
