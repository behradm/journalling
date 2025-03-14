// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomMinimalistImage, getMultipleMinimalistImages } from './unsplash';

// Mock global fetch
global.fetch = vi.fn();

describe('Unsplash Service', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset fetch mock
    global.fetch.mockReset();
  });
  
  describe('getRandomMinimalistImage', () => {
    it('should fetch a random image from Unsplash API', async () => {
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'abc123',
          description: 'A beautiful minimalist landscape',
          width: 1920,  // Ensure it's landscape (width > height)
          height: 1080,
          urls: {
            full: 'https://example.com/image.jpg'
          }
        })
      });
      
      const result = await getRandomMinimalistImage();
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch.mock.calls[0][0]).toContain('https://api.unsplash.com/photos/random');
      expect(global.fetch.mock.calls[0][0]).toContain('orientation=landscape');
      
      // Verify correct URL was returned
      expect(result).toBe('https://example.com/image.jpg');
    });
    
    it('should retry if a portrait image is returned', async () => {
      // First call returns a portrait image
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'portrait123',
          description: 'A portrait image',
          width: 1080,  // Portrait (width < height)
          height: 1920,
          urls: {
            full: 'https://example.com/portrait.jpg'
          }
        })
      });
      
      // Second call returns a landscape image
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'landscape456',
          description: 'A landscape image',
          width: 1920,  // Landscape (width > height)
          height: 1080,
          urls: {
            full: 'https://example.com/landscape.jpg'
          }
        })
      });
      
      const result = await getRandomMinimalistImage();
      
      // Verify fetch was called twice (retry)
      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      // Verify correct URL was returned (from second call)
      expect(result).toBe('https://example.com/landscape.jpg');
    });
    
    it('should handle errors gracefully', async () => {
      // Mock error response
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      
      const result = await getRandomMinimalistImage();
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Verify null was returned on error
      expect(result).toBeNull();
    });
  });
  
  describe('getMultipleMinimalistImages', () => {
    it('should fetch multiple images from Unsplash API', async () => {
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            id: 'abc123',
            description: 'First minimalist landscape',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/image1.jpg'
            }
          },
          {
            id: 'def456',
            description: 'Second minimalist landscape',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/image2.jpg'
            }
          },
          {
            id: 'ghi789',
            description: 'Third minimalist landscape',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/image3.jpg'
            }
          }
        ])
      });
      
      const result = await getMultipleMinimalistImages(3);
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch.mock.calls[0][0]).toContain('https://api.unsplash.com/photos/random');
      expect(global.fetch.mock.calls[0][0]).toContain('orientation=landscape');
      expect(global.fetch.mock.calls[0][0]).toContain('count=3');
      
      // Verify correct URLs were returned
      expect(result).toEqual([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]);
    });
    
    it('should filter out portrait images and fetch more if needed', async () => {
      // First call returns a mix of landscape and portrait images
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            id: 'landscape1',
            description: 'Landscape image',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/landscape1.jpg'
            }
          },
          {
            id: 'portrait1',
            description: 'Portrait image',
            width: 1080,  // Portrait
            height: 1920,
            urls: {
              full: 'https://example.com/portrait1.jpg'
            }
          },
          {
            id: 'landscape2',
            description: 'Another landscape image',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/landscape2.jpg'
            }
          }
        ])
      });
      
      // Second call (to get the missing image) returns a landscape image
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            id: 'landscape3',
            description: 'Additional landscape image',
            width: 1920,  // Landscape
            height: 1080,
            urls: {
              full: 'https://example.com/landscape3.jpg'
            }
          }
        ])
      });
      
      const result = await getMultipleMinimalistImages(3);
      
      // Verify fetch was called twice (initial + additional)
      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      // Verify correct URLs were returned (only landscape images)
      expect(result).toEqual([
        'https://example.com/landscape1.jpg',
        'https://example.com/landscape2.jpg',
        'https://example.com/landscape3.jpg'
      ]);
    });
    
    it('should handle errors gracefully', async () => {
      // Mock error response
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      
      const result = await getMultipleMinimalistImages(3);
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Verify empty array was returned on error
      expect(result).toEqual([]);
    });
  });
});
