/**
 * API Configuration Tests
 * Tests that API endpoints are correctly configured from environment variables
 */

import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS, API_URL } from '@/config/api';

// Derive API_BASE_URL from API_URL
const API_BASE_URL = `${API_URL}/api`;

describe('API Configuration', () => {
  describe('Environment Variables', () => {
    it('should load API_BASE_URL from environment variable', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL).toMatch(/^https?:\/\/.+\/api$/);
    });

    it('should have correct API_BASE_URL format', () => {
      // Should end with /api
      expect(API_BASE_URL).toMatch(/\/api$/);
      // Should not have trailing slash after /api
      expect(API_BASE_URL).not.toMatch(/\/api\/$/);
    });

    it('should use VITE_API_URL from environment', () => {
      // In test environment, this should be set
      const envUrl = import.meta.env.VITE_API_URL;
      expect(envUrl).toBeDefined();
    });
  });

  describe('API Endpoints', () => {
    it('should have all required endpoints defined', () => {
      const requiredEndpoints = [
        'login',
        'verify',
        'siteData',
        'contact',
        'contacts',
        'upload'
      ];

      requiredEndpoints.forEach(endpoint => {
        expect(API_ENDPOINTS).toHaveProperty(endpoint);
        expect(API_ENDPOINTS[endpoint as keyof typeof API_ENDPOINTS]).toBeDefined();
      });
    });

    it('should have correct login endpoint', () => {
      expect(API_ENDPOINTS.login).toBe(`${API_BASE_URL}/login`);
      expect(API_ENDPOINTS.login).toMatch(/\/api\/login$/);
    });

    it('should have correct verify endpoint', () => {
      expect(API_ENDPOINTS.verify).toBe(`${API_BASE_URL}/verify`);
      expect(API_ENDPOINTS.verify).toMatch(/\/api\/verify$/);
    });

    it('should have correct siteData endpoint', () => {
      expect(API_ENDPOINTS.siteData).toBe(`${API_BASE_URL}/sitedata`);
      expect(API_ENDPOINTS.siteData).toMatch(/\/api\/sitedata$/);
    });

    it('should have correct contact endpoint', () => {
      expect(API_ENDPOINTS.contact).toBe(`${API_BASE_URL}/contact`);
      expect(API_ENDPOINTS.contact).toMatch(/\/api\/contact$/);
    });

    it('should have correct contacts endpoint', () => {
      expect(API_ENDPOINTS.contacts).toBe(`${API_BASE_URL}/contacts`);
      expect(API_ENDPOINTS.contacts).toMatch(/\/api\/contacts$/);
    });

    it('should have correct upload endpoint', () => {
      expect(API_ENDPOINTS.upload).toBe(`${API_BASE_URL}/upload`);
      expect(API_ENDPOINTS.upload).toMatch(/\/api\/upload$/);
    });

    it('should have contactUpdate function', () => {
      expect(typeof API_ENDPOINTS.contactUpdate).toBe('function');
      const testId = '123abc';
      expect(API_ENDPOINTS.contactUpdate(testId)).toBe(`${API_BASE_URL}/contacts/${testId}`);
    });

    it('should have contactDelete function', () => {
      expect(typeof API_ENDPOINTS.contactDelete).toBe('function');
      const testId = '456def';
      expect(API_ENDPOINTS.contactDelete(testId)).toBe(`${API_BASE_URL}/contacts/${testId}`);
    });
  });

  describe('Endpoint URL Format', () => {
    it('should not have hardcoded localhost URLs', () => {
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        const url = typeof endpoint === 'function' ? endpoint('test') : endpoint;
        // Should use API_BASE_URL, not hardcoded localhost
        expect(url).toContain(API_BASE_URL);
      });
    });

    it('should all endpoints start with API_BASE_URL', () => {
      const endpoints = [
        API_ENDPOINTS.login,
        API_ENDPOINTS.verify,
        API_ENDPOINTS.siteData,
        API_ENDPOINTS.contact,
        API_ENDPOINTS.contacts,
        API_ENDPOINTS.upload,
        API_ENDPOINTS.contactUpdate('test'),
        API_ENDPOINTS.contactDelete('test')
      ];

      endpoints.forEach(endpoint => {
        expect(endpoint).toMatch(new RegExp(`^${API_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
      });
    });

    it('should not have double slashes in URLs', () => {
      const endpoints = [
        API_ENDPOINTS.login,
        API_ENDPOINTS.verify,
        API_ENDPOINTS.siteData,
        API_ENDPOINTS.contact,
        API_ENDPOINTS.contacts,
        API_ENDPOINTS.upload
      ];

      endpoints.forEach(endpoint => {
        // Should not have // except in http:// or https://
        expect(endpoint.replace(/^https?:\/\//, '')).not.toMatch(/\/\//);
      });
    });
  });

  describe('Dynamic Endpoint Functions', () => {
    it('should generate correct contactUpdate URL with ID', () => {
      const testIds = ['abc123', '456def', 'test-id-789'];
      
      testIds.forEach(id => {
        const url = API_ENDPOINTS.contactUpdate(id);
        expect(url).toBe(`${API_BASE_URL}/contacts/${id}`);
        expect(url).toMatch(new RegExp(`/contacts/${id}$`));
      });
    });

    it('should generate correct contactDelete URL with ID', () => {
      const testIds = ['xyz999', '111aaa', 'delete-test'];
      
      testIds.forEach(id => {
        const url = API_ENDPOINTS.contactDelete(id);
        expect(url).toBe(`${API_BASE_URL}/contacts/${id}`);
        expect(url).toMatch(new RegExp(`/contacts/${id}$`));
      });
    });

    it('should handle special characters in IDs', () => {
      const specialId = 'test-id_123';
      expect(API_ENDPOINTS.contactUpdate(specialId)).toContain(specialId);
      expect(API_ENDPOINTS.contactDelete(specialId)).toContain(specialId);
    });
  });

  describe('Environment Variable Changes', () => {
    it('should be configurable via VITE_API_URL', () => {
      // This test verifies that changing VITE_API_URL would change all endpoints
      const currentBase = API_BASE_URL;
      
      // All endpoints should use the same base
      expect(API_ENDPOINTS.login).toContain(currentBase);
      expect(API_ENDPOINTS.verify).toContain(currentBase);
      expect(API_ENDPOINTS.siteData).toContain(currentBase);
      expect(API_ENDPOINTS.contact).toContain(currentBase);
      expect(API_ENDPOINTS.contacts).toContain(currentBase);
      expect(API_ENDPOINTS.upload).toContain(currentBase);
    });

    it('should not have any hardcoded port numbers in endpoint definitions', () => {
      // Check that endpoints don't have hardcoded :5001 or :8080
      const endpointValues = [
        API_ENDPOINTS.login,
        API_ENDPOINTS.verify,
        API_ENDPOINTS.siteData,
        API_ENDPOINTS.contact,
        API_ENDPOINTS.contacts,
        API_ENDPOINTS.upload
      ];

      // The base URL might have a port, but individual endpoints shouldn't add one
      endpointValues.forEach(endpoint => {
        const withoutBase = endpoint.replace(API_BASE_URL, '');
        expect(withoutBase).not.toMatch(/:\d+/);
      });
    });
  });
});
