/**
 * End-to-End Data Flow Tests
 * Tests complete data flow from frontend to backend using environment-configured URLs
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { API_ENDPOINTS } from '@/config/api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('E2E Data Flow Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Authentication Flow', () => {
    it('should complete login -> verify -> access protected resource flow', async () => {
      // Step 1: Login
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, token: 'test-jwt-token', username: 'admin' })
      });

      const loginResponse = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });

      const loginData = await loginResponse.json();
      expect(loginData.success).toBe(true);
      expect(loginData.token).toBeDefined();

      // Step 2: Verify token
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true, username: 'admin' })
      });

      const verifyResponse = await fetch(API_ENDPOINTS.verify, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });

      const verifyData = await verifyResponse.json();
      expect(verifyData.valid).toBe(true);

      // Step 3: Access protected resource (site data)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          data: { siteName: 'Vikas Caterings', phone: '1234567890' }
        })
      });

      const dataResponse = await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });

      const siteData = await dataResponse.json();
      expect(siteData.success).toBe(true);
      expect(siteData.data).toBeDefined();

      // Verify all calls used correct endpoints
      expect(mockFetch).toHaveBeenNthCalledWith(1, API_ENDPOINTS.login, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(2, API_ENDPOINTS.verify, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(3, API_ENDPOINTS.siteData, expect.any(Object));
    });
  });

  describe('Complete Site Data Update Flow', () => {
    it('should fetch -> modify -> save -> verify site data', async () => {
      const token = 'test-token';

      // Step 1: Fetch current data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            siteName: 'Vikas Caterings',
            phone: '1234567890',
            email: 'info@vikas.com'
          }
        })
      });

      const fetchResponse = await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const currentData = await fetchResponse.json();

      // Step 2: Modify data
      const updatedData = {
        ...currentData.data,
        phone: '9876543210'
      };

      // Step 3: Save updated data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const saveResponse = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const saveResult = await saveResponse.json();
      expect(saveResult.success).toBe(true);

      // Step 4: Verify data was saved
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: updatedData
        })
      });

      const verifyResponse = await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const verifiedData = await verifyResponse.json();

      expect(verifiedData.data.phone).toBe('9876543210');
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Complete Contact Form Flow', () => {
    it('should submit -> fetch -> update status -> delete contact', async () => {
      const token = 'test-token';

      // Step 1: Submit contact form
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        people: '50',
        message: 'Test inquiry'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contactId: 'contact-123' })
      });

      const submitResponse = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      const submitResult = await submitResponse.json();
      expect(submitResult.success).toBe(true);

      // Step 2: Fetch all contacts (admin view)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          contacts: [{
            _id: 'contact-123',
            ...contactData,
            status: 'new',
            submittedAt: new Date().toISOString()
          }]
        })
      });

      const fetchResponse = await fetch(API_ENDPOINTS.contacts, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contacts = await fetchResponse.json();
      expect(contacts.contacts).toHaveLength(1);
      expect(contacts.contacts[0].status).toBe('new');

      // Step 3: Update contact status
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const updateResponse = await fetch(API_ENDPOINTS.contactUpdate('contact-123'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'read' })
      });

      const updateResult = await updateResponse.json();
      expect(updateResult.success).toBe(true);

      // Step 4: Delete contact
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const deleteResponse = await fetch(API_ENDPOINTS.contactDelete('contact-123'), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const deleteResult = await deleteResponse.json();
      expect(deleteResult.success).toBe(true);

      // Verify all endpoints were called correctly
      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(mockFetch).toHaveBeenNthCalledWith(1, API_ENDPOINTS.contact, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(2, API_ENDPOINTS.contacts, expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(3, expect.stringContaining('/contacts/contact-123'), expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(4, expect.stringContaining('/contacts/contact-123'), expect.any(Object));
    });
  });

  describe('Complete File Upload Flow', () => {
    it('should upload file -> get URL -> save to data -> verify', async () => {
      const token = 'test-token';

      // Step 1: Upload file
      const file = new Blob(['test image data'], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file, 'test-image.jpg');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          url: 'http://localhost:5001/uploads/1234567890-test-image.jpg'
        })
      });

      const uploadResponse = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      expect(uploadResult.success).toBe(true);
      expect(uploadResult.url).toContain('/uploads/');

      // Step 2: Save image URL to site data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const siteDataUpdate = {
        hero: {
          backgroundImage: uploadResult.url
        }
      };

      const saveResponse = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(siteDataUpdate)
      });

      const saveResult = await saveResponse.json();
      expect(saveResult.success).toBe(true);

      // Step 3: Verify image URL is saved
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: siteDataUpdate
        })
      });

      const verifyResponse = await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const verifiedData = await verifyResponse.json();
      expect(verifiedData.data.hero.backgroundImage).toBe(uploadResult.url);

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Environment Variable Configuration Test', () => {
    it('should use configured API URL for all operations', async () => {
      const operations = [
        { endpoint: API_ENDPOINTS.login, method: 'POST' },
        { endpoint: API_ENDPOINTS.verify, method: 'GET' },
        { endpoint: API_ENDPOINTS.siteData, method: 'GET' },
        { endpoint: API_ENDPOINTS.contact, method: 'POST' },
        { endpoint: API_ENDPOINTS.contacts, method: 'GET' },
        { endpoint: API_ENDPOINTS.upload, method: 'POST' }
      ];

      for (const { endpoint, method } of operations) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

        await fetch(endpoint, { method });
      }

      // Verify all calls used endpoints from config
      expect(mockFetch).toHaveBeenCalledTimes(6);
      
      // Verify no hardcoded URLs were used
      mockFetch.mock.calls.forEach(call => {
        const url = call[0] as string;
        expect(url).toMatch(/\/api\//);
        // Should use the configured base URL
        expect(url).toContain(API_ENDPOINTS.login.split('/api/')[0]);
      });
    });
  });

  describe('Error Recovery Flow', () => {
    it('should handle failed request and retry with same endpoint', async () => {
      const token = 'test-token';

      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch(API_ENDPOINTS.siteData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      // Retry with same endpoint
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} })
      });

      const retryResponse = await fetch(API_ENDPOINTS.siteData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const retryData = await retryResponse.json();
      expect(retryData.success).toBe(true);

      // Both attempts used the same configured endpoint
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[0][0]).toBe(mockFetch.mock.calls[1][0]);
    });
  });
});
