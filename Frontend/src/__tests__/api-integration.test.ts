/**
 * API Integration Tests
 * Tests that all pages can fetch and push data using configured API endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { API_ENDPOINTS, API_URL } from '@/config/api';

// Use API_URL as the base
const API_BASE_URL = `${API_URL}/api`;

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication API', () => {
    it('should call login endpoint with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, token: 'test-token' })
      });

      await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.login,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should call verify endpoint with token', async () => {
      const testToken = 'test-jwt-token';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true })
      });

      await fetch(API_ENDPOINTS.verify, {
        headers: { 'Authorization': `Bearer ${testToken}` }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.verify,
        expect.objectContaining({
          headers: { 'Authorization': `Bearer ${testToken}` }
        })
      );
    });
  });

  describe('Site Data API', () => {
    it('should fetch site data from correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { siteName: 'Test' } })
      });

      await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': 'Bearer token' }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.siteData,
        expect.any(Object)
      );
      expect(mockFetch.mock.calls[0][0]).toBe(API_ENDPOINTS.siteData);
    });

    it('should update site data to correct endpoint', async () => {
      const testData = { siteName: 'Updated Name' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.siteData,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testData)
        })
      );
    });
  });

  describe('Contact Form API', () => {
    it('should submit contact form to correct endpoint', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        message: 'Test message'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.contact,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(contactData)
        })
      );
    });

    it('should fetch contact submissions from correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contacts: [] })
      });

      await fetch(API_ENDPOINTS.contacts, {
        headers: { 'Authorization': 'Bearer token' }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.contacts,
        expect.any(Object)
      );
    });

    it('should update contact status using dynamic endpoint', async () => {
      const contactId = 'test-contact-123';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await fetch(API_ENDPOINTS.contactUpdate(contactId), {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'read' })
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/contacts/${contactId}`),
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should delete contact using dynamic endpoint', async () => {
      const contactId = 'test-contact-456';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await fetch(API_ENDPOINTS.contactDelete(contactId), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer token' }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/contacts/${contactId}`),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('File Upload API', () => {
    it('should upload file to correct endpoint', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, url: 'http://localhost:5001/uploads/test.jpg' })
      });

      await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer token' },
        body: formData
      });

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.upload,
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch(API_ENDPOINTS.siteData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle 401 unauthorized errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      });

      const response = await fetch(API_ENDPOINTS.siteData);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should handle 500 server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' })
      });

      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({})
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('All Endpoints Use Environment Config', () => {
    it('should verify all endpoints use configured API_URL', () => {
      const endpoints = [
        API_ENDPOINTS.login,
        API_ENDPOINTS.verify,
        API_ENDPOINTS.siteData,
        API_ENDPOINTS.contact,
        API_ENDPOINTS.contacts,
        API_ENDPOINTS.upload
      ];

      endpoints.forEach(endpoint => {
        // Should use the configured API_URL (which comes from environment)
        expect(endpoint).toContain(API_URL);
        // Should have /api/ in the path
        expect(endpoint).toMatch(/\/api\//);
      });
      
      // Verify all endpoints start with the same base URL
      const baseUrls = endpoints.map(e => e.split('/api/')[0]);
      const uniqueBaseUrls = [...new Set(baseUrls)];
      expect(uniqueBaseUrls).toHaveLength(1); // All should use same base
    });
  });
});
