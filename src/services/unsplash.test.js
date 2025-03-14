// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomMinimalistImage, getMultipleMinimalistImages } from './unsplash';

// Mock fetch
global.fetch = vi.fn();

describe('Unsplash Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Mock successful response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        urls: {
          full: 'https://images.unsplash.com/photo-example',
          regular: 'https://images.unsplash.com/photo-example?w=1080'
        },
        description: 'A beautiful minimalist landscape'
      })
    });
  });

  describe('getRandomMinimalistImage', () => {
    it('should fetch a random image from Unsplash API', async () => {
      // Call the function
      const result = await getRandomMinimalistImage();
      
      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.unsplash.com/photos/random'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Client-ID')
          })
        })
      );
      
      // Verify result
      expect(result).toBe('https://images.unsplash.com/photo-example');
    });

    it('should handle errors gracefully', async () => {
      // Mock a failed response
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      
      // Call the function
      const result = await getRandomMinimalistImage();
      
      // Verify result is null on error
      expect(result).toBeNull();
    });
  });

  describe('getMultipleMinimalistImages', () => {
    beforeEach(() => {
      // Mock response for multiple images
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([
          { urls: { full: 'https://images.unsplash.com/photo-1' } },
          { urls: { full: 'https://images.unsplash.com/photo-2' } },
          { urls: { full: 'https://images.unsplash.com/photo-3' } }
        ])
      });
    });

    it('should fetch multiple images from Unsplash API', async () => {
      // Call the function
      const result = await getMultipleMinimalistImages(3);
      
      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.unsplash.com/photos/random'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Client-ID')
          })
        })
      );
      
      // Verify result contains correct number of URLs
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        'https://images.unsplash.com/photo-1',
        'https://images.unsplash.com/photo-2',
        'https://images.unsplash.com/photo-3'
      ]);
    });

    it('should handle errors gracefully', async () => {
      // Mock a failed response
      global.fetch.mockRejectedValueOnce(new Error('API error'));
      
      // Call the function
      const result = await getMultipleMinimalistImages(3);
      
      // Verify result is empty array on error
      expect(result).toEqual([]);
    });
  });
});
