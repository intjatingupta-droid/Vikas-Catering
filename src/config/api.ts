// API Configuration
// If VITE_API_URL is empty, use same domain (for production on Render)
// Otherwise use the specified URL (for local development)
export const API_URL = import.meta.env.VITE_API_URL || '';

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
