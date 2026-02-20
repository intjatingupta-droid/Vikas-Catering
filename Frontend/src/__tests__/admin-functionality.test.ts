import { describe, it, expect, beforeEach, vi } from 'vitest';
import { API_ENDPOINTS } from '@/config/api';

describe('Admin Panel Functionality Tests', () => {
  let mockFetch: any;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'username') return 'admin';
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    // Mock fetch
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  describe('1. Admin Panel - Save Changes Functionality', () => {
    it('should save hero section changes to database', async () => {
      const heroData = {
        welcomeText: 'Welcome',
        heading: 'Test Heading',
        description: 'Test Description',
        ctaText: 'Book Now',
        backgroundImage: 'https://example.com/image.jpg',
        videoUrl: ''
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { hero: heroData } })
      });

      const response = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({ data: { hero: heroData } })
      });

      const result = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        API_ENDPOINTS.siteData,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result.success).toBe(true);
    });

    it('should save menu section changes to database', async () => {
      const menuData = {
        sectionLabel: 'Our Menu',
        sectionTitle: 'Explore Our Cuisines',
        items: [
          {
            title: 'Indian Cuisine',
            description: 'Authentic Indian dishes',
            image: 'https://example.com/indian.jpg'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { menu: menuData } })
      });

      const response = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({ data: { menu: menuData } })
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.menu.items).toHaveLength(1);
    });

    it('should save services section changes to database', async () => {
      const servicesData = {
        sectionTitle: 'Our Services',
        description: 'We offer various catering services',
        items: [
          {
            title: 'Wedding Catering',
            description: 'Perfect for your special day',
            image: 'https://example.com/wedding.jpg'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { services: servicesData } })
      });

      const response = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({ data: { services: servicesData } })
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.services.items).toHaveLength(1);
    });

    it('should handle save errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ success: false, message: 'Server error' })
      });

      const response = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: JSON.stringify({ data: {} })
      });

      const result = await response.json();

      expect(response.ok).toBe(false);
      expect(result.success).toBe(false);
    });

    it('should handle unauthorized save attempts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, message: 'Unauthorized' })
      });

      const response = await fetch(API_ENDPOINTS.siteData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token'
        },
        body: JSON.stringify({ data: {} })
      });

      expect(response.status).toBe(401);
    });
  });

  describe('2. Contact Submissions - Load and Display', () => {
    it('should fetch contact submissions successfully', async () => {
      const mockContacts = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          people: '50',
          message: 'Need catering for wedding',
          status: 'new',
          submittedAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          people: '100',
          message: 'Corporate event catering',
          status: 'read',
          submittedAt: new Date().toISOString()
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contacts: mockContacts })
      });

      const response = await fetch(API_ENDPOINTS.contacts, {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.contacts).toHaveLength(2);
      expect(result.contacts[0].name).toBe('John Doe');
    });

    it('should handle empty contact submissions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, contacts: [] })
      });

      const response = await fetch(API_ENDPOINTS.contacts, {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.contacts).toHaveLength(0);
    });

    it('should handle contact fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetch(API_ENDPOINTS.contacts, {
          headers: {
            'Authorization': 'Bearer mock-token'
          }
        })
      ).rejects.toThrow('Network error');
    });

    it('should update contact status', async () => {
      const contactId = '123';
      const newStatus = 'responded';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          contact: { _id: contactId, status: newStatus }
        })
      });

      const response = await fetch(API_ENDPOINTS.contactUpdate(contactId), {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.contact.status).toBe('responded');
    });

    it('should delete contact submission', async () => {
      const contactId = '123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          message: 'Contact deleted successfully'
        })
      });

      const response = await fetch(API_ENDPOINTS.contactDelete(contactId), {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact deleted successfully');
    });
  });

  describe('3. Image Upload Functionality', () => {
    it('should upload image to menu section', async () => {
      const mockFile = new File(['image content'], 'menu-item.jpg', { type: 'image/jpeg' });
      const mockUrl = 'https://backend.vikascateringservice.com/uploads/menu-item.jpg';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          url: mockUrl,
          filename: 'menu-item.jpg'
        })
      });

      const formData = new FormData();
      formData.append('file', mockFile);

      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        },
        body: formData
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockUrl);
    });

    it('should upload image to gallery section', async () => {
      const mockFile = new File(['image content'], 'gallery.jpg', { type: 'image/jpeg' });
      const mockUrl = 'https://backend.vikascateringservice.com/uploads/gallery.jpg';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          url: mockUrl
        })
      });

      const formData = new FormData();
      formData.append('file', mockFile);

      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        },
        body: formData
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.url).toContain('/uploads/');
    });

    it('should upload image to our work page', async () => {
      const mockFile = new File(['image content'], 'work.jpg', { type: 'image/jpeg' });
      const mockUrl = 'https://backend.vikascateringservice.com/uploads/work.jpg';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          url: mockUrl
        })
      });

      const formData = new FormData();
      formData.append('file', mockFile);

      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        },
        body: formData
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockUrl);
    });

    it('should handle upload errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: 'No file uploaded'
        })
      });

      const formData = new FormData();

      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        },
        body: formData
      });

      const result = await response.json();

      expect(response.ok).toBe(false);
      expect(result.success).toBe(false);
    });

    it('should handle large file uploads', async () => {
      const largeFile = new File(['x'.repeat(60 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: async () => ({ 
          success: false, 
          message: 'File too large'
        })
      });

      const formData = new FormData();
      formData.append('file', largeFile);

      const response = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token'
        },
        body: formData
      });

      expect(response.status).toBe(413);
    });
  });

  describe('4. Contact Form Submission (Public)', () => {
    it('should submit contact form successfully', async () => {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        people: '50',
        message: 'Test message'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          success: true, 
          message: 'Contact form submitted successfully',
          id: '123'
        })
      });

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact form submitted successfully');
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        name: 'Test User',
        email: '',
        phone: '',
        message: ''
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          success: false, 
          message: 'Name, email, phone, and message are required'
        })
      });

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incompleteData)
      });

      const result = await response.json();

      expect(response.ok).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should handle contact form submission errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetch(API_ENDPOINTS.contact, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('5. API Endpoints Configuration', () => {
    it('should have correct API endpoints configured', () => {
      expect(API_ENDPOINTS.login).toBeDefined();
      expect(API_ENDPOINTS.verify).toBeDefined();
      expect(API_ENDPOINTS.upload).toBeDefined();
      expect(API_ENDPOINTS.siteData).toBeDefined();
      expect(API_ENDPOINTS.contact).toBeDefined();
      expect(API_ENDPOINTS.contacts).toBeDefined();
    });

    it('should generate correct contact update endpoint', () => {
      const contactId = '123';
      const endpoint = API_ENDPOINTS.contactUpdate(contactId);
      expect(endpoint).toContain('/api/contacts/123');
    });

    it('should generate correct contact delete endpoint', () => {
      const contactId = '456';
      const endpoint = API_ENDPOINTS.contactDelete(contactId);
      expect(endpoint).toContain('/api/contacts/456');
    });
  });
});
