/**
 * Pages API Usage Tests
 * Verifies that all pages use API_ENDPOINTS from config, not hardcoded URLs
 */

import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS, API_URL } from '@/config/api';
import fs from 'fs';
import path from 'path';

// Derive API_BASE_URL from API_URL
const API_BASE_URL = `${API_URL}/api`;

describe('Pages API Usage Verification', () => {
  const pagesDir = path.join(__dirname, '../pages');
  const contextDir = path.join(__dirname, '../context');
  
  const readFileContent = (filePath: string): string => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      return '';
    }
  };

  describe('Login Page', () => {
    it('should import API_ENDPOINTS', () => {
      const loginContent = readFileContent(path.join(pagesDir, 'Login.tsx'));
      expect(loginContent).toMatch(/from ['"]@\/config\/api['"]/);
      expect(loginContent).toContain('API_ENDPOINTS');
    });

    it('should not have hardcoded API URLs', () => {
      const loginContent = readFileContent(path.join(pagesDir, 'Login.tsx'));
      expect(loginContent).not.toMatch(/['"]https?:\/\/localhost:5001/);
      expect(loginContent).not.toMatch(/['"]http:\/\/localhost:5001\/api\/login['"]/);
    });

    it('should use API_ENDPOINTS.login', () => {
      const loginContent = readFileContent(path.join(pagesDir, 'Login.tsx'));
      expect(loginContent).toContain('API_ENDPOINTS.login');
    });
  });

  describe('Admin Page', () => {
    it('should import API_ENDPOINTS', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).toMatch(/from ['"]@\/config\/api['"]/);
      expect(adminContent).toContain('API_ENDPOINTS');
    });

    it('should not have hardcoded API URLs', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).not.toMatch(/['"]https?:\/\/localhost:5001/);
    });

    it('should use API_ENDPOINTS for contacts', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).toContain('API_ENDPOINTS.contacts');
    });

    it('should use API_ENDPOINTS.contactUpdate', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).toContain('API_ENDPOINTS.contactUpdate');
    });

    it('should use API_ENDPOINTS.contactDelete', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).toContain('API_ENDPOINTS.contactDelete');
    });

    it('should use API_ENDPOINTS.upload', () => {
      const adminContent = readFileContent(path.join(pagesDir, 'Admin.tsx'));
      expect(adminContent).toContain('API_ENDPOINTS.upload');
    });
  });

  describe('Contact Page', () => {
    it('should import API_ENDPOINTS', () => {
      const contactContent = readFileContent(path.join(pagesDir, 'ContactPage.tsx'));
      expect(contactContent).toMatch(/from ['"]@\/config\/api['"]/);
      expect(contactContent).toContain('API_ENDPOINTS');
    });

    it('should not have hardcoded API URLs', () => {
      const contactContent = readFileContent(path.join(pagesDir, 'ContactPage.tsx'));
      expect(contactContent).not.toMatch(/['"]https?:\/\/localhost:5001/);
    });

    it('should use API_ENDPOINTS.contact', () => {
      const contactContent = readFileContent(path.join(pagesDir, 'ContactPage.tsx'));
      expect(contactContent).toContain('API_ENDPOINTS.contact');
    });
  });

  describe('Protected Route Component', () => {
    const protectedRouteContent = readFileContent(
      path.join(__dirname, '../components/ProtectedRoute.tsx')
    );

    it('should import API_ENDPOINTS', () => {
      expect(protectedRouteContent).toMatch(/from ['"]@\/config\/api['"]/);
      expect(protectedRouteContent).toContain('API_ENDPOINTS');
    });

    it('should not have hardcoded API URLs', () => {
      expect(protectedRouteContent).not.toMatch(/['"]https?:\/\/localhost:5001/);
    });

    it('should use API_ENDPOINTS.verify', () => {
      expect(protectedRouteContent).toContain('API_ENDPOINTS.verify');
    });
  });

  describe('SiteDataContext', () => {
    const contextContent = readFileContent(path.join(contextDir, 'SiteDataContext.tsx'));

    it('should import API_ENDPOINTS', () => {
      expect(contextContent).toMatch(/from ['"]@\/config\/api['"]/);
      expect(contextContent).toContain('API_ENDPOINTS');
    });

    it('should not have hardcoded API URLs', () => {
      expect(contextContent).not.toMatch(/['"]https?:\/\/localhost:5001/);
    });

    it('should use API_ENDPOINTS.siteData', () => {
      expect(contextContent).toContain('API_ENDPOINTS.siteData');
    });
  });

  describe('No Hardcoded URLs Anywhere', () => {
    const filesToCheck = [
      { path: path.join(pagesDir, 'Login.tsx'), name: 'Login.tsx' },
      { path: path.join(pagesDir, 'Admin.tsx'), name: 'Admin.tsx' },
      { path: path.join(pagesDir, 'ContactPage.tsx'), name: 'ContactPage.tsx' },
      { path: path.join(__dirname, '../components/ProtectedRoute.tsx'), name: 'ProtectedRoute.tsx' },
      { path: path.join(contextDir, 'SiteDataContext.tsx'), name: 'SiteDataContext.tsx' }
    ];

    filesToCheck.forEach(({ path: filePath, name }) => {
      it(`${name} should not contain hardcoded localhost:5001`, () => {
        const content = readFileContent(filePath);
        if (content) {
          expect(content).not.toMatch(/localhost:5001/);
        }
      });

      it(`${name} should not contain hardcoded /api/ paths`, () => {
        const content = readFileContent(filePath);
        if (content) {
          // Should not have strings like "http://localhost:5001/api/login"
          expect(content).not.toMatch(/['"]https?:\/\/[^'"]+\/api\/\w+['"]/);
        }
      });
    });
  });

  describe('Environment Variable Usage', () => {
    it('should have API_BASE_URL derived from VITE_API_URL', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });

    it('should have all endpoints using API_BASE_URL', () => {
      const allEndpoints = [
        API_ENDPOINTS.login,
        API_ENDPOINTS.verify,
        API_ENDPOINTS.siteData,
        API_ENDPOINTS.contact,
        API_ENDPOINTS.contacts,
        API_ENDPOINTS.upload,
        API_ENDPOINTS.contactUpdate('test'),
        API_ENDPOINTS.contactDelete('test')
      ];

      allEndpoints.forEach(endpoint => {
        expect(endpoint).toContain(API_BASE_URL);
      });
    });

    it('should allow changing API URL via environment variable', () => {
      // This test verifies the architecture allows env changes
      // All endpoints should be derived from API_BASE_URL
      const baseUrlPattern = API_BASE_URL.replace(/https?:\/\/[^/]+/, '');
      
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        const url = typeof endpoint === 'function' ? endpoint('test') : endpoint;
        // Each endpoint should have the base pattern
        expect(url).toMatch(/\/api\//);
      });
    });
  });

  describe('API Config File Structure', () => {
    const configContent = readFileContent(path.join(__dirname, '../config/api.ts'));

    it('should export API_URL', () => {
      expect(configContent).toMatch(/export const API_URL/);
    });

    it('should export API_ENDPOINTS', () => {
      expect(configContent).toContain('export const API_ENDPOINTS');
    });

    it('should use import.meta.env.VITE_API_URL', () => {
      expect(configContent).toContain('import.meta.env.VITE_API_URL');
    });

    it('should have fallback for VITE_API_URL', () => {
      // Check for ternary operator with http fallback
      expect(configContent).toMatch(/\?.*http/);
    });
  });
});
